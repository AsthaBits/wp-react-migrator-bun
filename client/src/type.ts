export type PageImage = {
  src: string;
  alt: string;
};

export type Page = {
  url: string;
  path: string;
  title: string;
  description: string;
  canonical: string;
  headings: string[];
  contentHtml?: string;
  images: PageImage[];
  logo: string;
  phone: string;
  email: string;
  colors: string[];
  font: string;
  type: "home" | "about" | "service" | "contact" | "location" | string;
  template: string;
  recommendedTemplate: string;
};

export type BrandingConfig = {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  confidence: "high" | "low";
};

export type NavigationItem = {
  label: string;
  url: string;
};

export type SiteConfig = {
  siteUrl: string;
  branding: BrandingConfig;
  contact: {
    phone: string;
    email: string;
  };
  navigation: NavigationItem[];
  templates: Record<string, string>;
};

export type SitemapData = {
  found: boolean;
  urlCount: number;
  urls: string[];
  truncated: boolean;
};

export type Failure = {
  url: string;
  error: string;
};

export type MigrationStats = {
  discovered: number;
  migrated: number;
  failed: number;
};

export type MigrationResult = {
  importedAt: string;
  sitemap: SitemapData;
  pages: Page[];
  failures: Failure[];
  config: SiteConfig;
  stats: MigrationStats;
};

export type TemplateProps = {
  page: Page;
  config: SiteConfig;
  primary: string;
};

export type TemplateOption = {
  id: string;
  name: string;
  description: string;
  type: string;
};