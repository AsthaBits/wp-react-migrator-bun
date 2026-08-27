import * as cheerio from "cheerio";
import { parseStringPromise } from "xml2js";
import sanitizeHtml from "sanitize-html";

const USER_AGENT = "WP-React-Migrator/2.0 (+https://github.com)";
const MAX_SITEMAP_URLS = 50;

function normalizeUrl(input) {
  try {
    const u = new URL(input);
    u.hash = "";
    return u.toString().replace(/\/$/, "") || u.origin;
  } catch {
    return input;
  }
}

async function fetchText(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "user-agent": USER_AGENT,
          accept: "text/html,application/xml,text/xml,text/css,*/*",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Request failed (${response.status}) for ${url}`);
      }
      return await response.text();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, 800 * (i + 1)));
    }
  }
}

function absoluteUrl(value, base) {
  if (!value) return null;
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
}

function classifyPage(url, title, headings = []) {
  const pathname = new URL(url).pathname.toLowerCase();
  const text = `${pathname} ${title} ${headings.join(" ")}`.toLowerCase();

  if (pathname === "/" || pathname === "") return "home";
  if (/about|company|team|story|who-we-are/.test(text)) return "about";
  if (/contact|get-in-touch|reach-us|support/.test(text)) return "contact";
  if (/location|locations|office|branch|find-us/.test(text)) return "location";
  return "service";
}

function recommendTemplate(page) {
  if (page.type === "home") return "home-v1";
  if (page.type === "about") return "about-v1";
  if (page.type === "contact") return "contact-v1";
  if (page.type === "location") return "location-v1";
  return page.images.length >= 3 || page.headings.length >= 4 ? "service-v2" : "service-v1";
}

async function extractBrandingStyles($, baseUrl) {
  let cssText = $("style").text();

  // Fetch top 2 external stylesheets if present
  const externalCssUrls = $('link[rel="stylesheet"]')
    .map((_, el) => absoluteUrl($(el).attr("href"), baseUrl))
    .get()
    .filter(Boolean)
    .slice(0, 2);

  for (const cssUrl of externalCssUrls) {
    try {
      const externalCss = await fetchText(cssUrl, 1);
      if (externalCss) {
        cssText += `\n${externalCss.slice(0, 50000)}`;
      }
    } catch {}
  }

  const hexColors = cssText.match(/#[0-9a-fA-F]{6}\b/g) || [];
  const rgbColors = cssText.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g) || [];
  const rawColors = [...hexColors, ...rgbColors];
  const uniqueColors = [...new Set(rawColors)].slice(0, 8);

  const fontMatch = cssText.match(/font-family\s*:\s*['"]?([^;'"}]+)['"]?/i);

  return {
    colors: uniqueColors,
    font: fontMatch?.[1]?.replace(/['"]/g, "").trim() || "Inter, sans-serif",
    hasExternalStyles: externalCssUrls.length > 0,
  };
}

function parsePage(html, url, brandingData) {
  const $ = cheerio.load(html);
  $("script, noscript, iframe, svg, style").remove();

  const title = $("title").first().text().trim() || "Untitled page";
  const description = $('meta[name="description"]').attr("content")?.trim() || "";
  const canonical = absoluteUrl($('link[rel="canonical"]').attr("href"), url) || url;

  const mainWrapper =
    $("main, .entry-content, article, #content, .post-content").first().html() ||
    $("body").html() ||
    "";

  const contentHtml = sanitizeHtml(mainWrapper, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "section", "article"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading", "srcset"],
      a: ["href", "target", "rel", "title"],
      "*": ["class", "id"],
    },
  });

  const headings = $("h1,h2,h3")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean);

  const images = $("img")
    .map((_, el) => {
      const src = absoluteUrl($(el).attr("src") || $(el).attr("data-src"), url);
      if (!src) return null;
      const alt = $(el).attr("alt")?.trim() || "";
      return { src, alt };
    })
    .get()
    .filter(Boolean);

  const logo = absoluteUrl(
    $("img.custom-logo, img[alt*='logo' i], header img").first().attr("src") ||
      $("img.custom-logo, img[alt*='logo' i], header img").first().attr("data-src"),
    url
  ) || "";

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const phone = bodyText.match(/(?:\+?\d[\d\s().-]{8,}\d)/)?.[0]?.trim() || "";
  const email = bodyText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";

  const page = {
    url,
    path: new URL(url).pathname || "/",
    title,
    description,
    canonical,
    headings,
    contentHtml,
    images,
    logo,
    phone,
    email,
    colors: brandingData.colors,
    font: brandingData.font,
    type: "service",
    template: "service-v1",
    recommendedTemplate: "service-v1",
  };

  page.type = classifyPage(url, page.title, headings);
  page.template = recommendTemplate(page);
  page.recommendedTemplate = page.template;
  return page;
}

async function getSitemapUrls(siteUrl) {
  const origin = new URL(siteUrl).origin;
  const candidates = [
    `${origin}/wp-sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/sitemap.xml`,
  ];

  for (const candidate of candidates) {
    try {
      const xml = await fetchText(candidate);
      const parsed = await parseStringPromise(xml);
      const root = parsed.urlset || parsed.sitemapindex;
      if (!root) continue;

      if (parsed.urlset?.url) {
        const urls = parsed.urlset.url.map((x) => x.loc?.[0]).filter(Boolean);
        return {
          urls: urls.slice(0, MAX_SITEMAP_URLS),
          totalFound: urls.length,
          truncated: urls.length > MAX_SITEMAP_URLS,
        };
      }

      if (parsed.sitemapindex?.sitemap) {
        const childMaps = parsed.sitemapindex.sitemap.map((x) => x.loc?.[0]).filter(Boolean);
        const collectedUrls = [];
        for (const child of childMaps.slice(0, 8)) {
          try {
            const childXml = await fetchText(child);
            const childParsed = await parseStringPromise(childXml);
            const childUrls = childParsed.urlset?.url?.map((x) => x.loc?.[0]).filter(Boolean) || [];
            collectedUrls.push(...childUrls);
            if (collectedUrls.length >= MAX_SITEMAP_URLS) break;
          } catch {}
        }
        return {
          urls: collectedUrls.slice(0, MAX_SITEMAP_URLS),
          totalFound: collectedUrls.length,
          truncated: collectedUrls.length > MAX_SITEMAP_URLS,
        };
      }
    } catch {}
  }

  return { urls: [], totalFound: 0, truncated: false };
}

export async function crawlWordPress(siteUrl) {
  const cleanSiteUrl = normalizeUrl(siteUrl);
  const sitemapResult = await getSitemapUrls(cleanSiteUrl);

  let urls = sitemapResult.urls.map(normalizeUrl).filter((u, i, a) => a.indexOf(u) === i);
  if (!urls.length) urls = [cleanSiteUrl];

  const pages = [];
  const failures = [];

  // Crawl home/first URL first to extract comprehensive branding
  let brandingData = { colors: ["#2563eb", "#0f172a"], font: "Inter, sans-serif", hasExternalStyles: false };
  try {
    const firstHtml = await fetchText(urls[0]);
    const $ = cheerio.load(firstHtml);
    brandingData = await extractBrandingStyles($, urls[0]);
    pages.push(parsePage(firstHtml, urls[0], brandingData));
  } catch (error) {
    failures.push({ url: urls[0], error: error.message });
  }

  // Crawl remainder in concurrent batches
  const remainingUrls = urls.slice(1);
  const batchSize = 5;
  for (let i = 0; i < remainingUrls.length; i += batchSize) {
    const batch = remainingUrls.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (url) => {
        try {
          const html = await fetchText(url);
          pages.push(parsePage(html, url, brandingData));
        } catch (error) {
          failures.push({ url, error: error.message });
        }
      })
    );
  }

  const homePage = pages.find((p) => p.type === "home") || pages[0] || {};
  const primaryColor = homePage.colors?.[0] || "#2563eb";
  const secondaryColor = homePage.colors?.[1] || "#0f172a";

  const config = {
    siteUrl: cleanSiteUrl,
    branding: {
      logo: homePage.logo || "",
      primaryColor,
      secondaryColor,
      font: homePage.font || "Inter, sans-serif",
      confidence: homePage.colors && homePage.colors.length > 0 ? "high" : "low",
    },
    contact: {
      phone: homePage.phone || "",
      email: homePage.email || "",
    },
    navigation: pages.slice(0, 8).map((p) => ({ label: p.title, url: p.path })),
    templates: Object.fromEntries(pages.map((p) => [p.path, p.template])),
  };

  return {
    importedAt: new Date().toISOString(),
    sitemap: {
      found: sitemapResult.urls.length > 0,
      urlCount: sitemapResult.totalFound,
      urls: sitemapResult.urls,
      truncated: sitemapResult.truncated,
    },
    pages,
    failures,
    config,
    stats: {
      discovered: urls.length,
      migrated: pages.length,
      failed: failures.length,
    },
  };
}