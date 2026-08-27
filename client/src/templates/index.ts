import React from "react";
import type { TemplateProps, TemplateOption } from "../type";
import { HomeV1 } from "./HomeV1";
import { AboutV1 } from "./AboutV1";
import { ServiceSplitHero } from "./ServiceSplit";
import { ServiceFeatureGrid } from "./ServiceFeatureGrid";
import { ContactV1 } from "./ContactV1";
import { LocationV1 } from "./LocationV1";

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: "home-v1", name: "Home — Modern Gradient Hero", description: "High-impact hero with navigation cards", type: "home" },
  { id: "about-v1", name: "About — Story & Team Grid", description: "Narrative layout with team member grid", type: "about" },
  { id: "service-v1", name: "Service — Split Hero", description: "Side-by-side hero image and quote button", type: "service" },
  { id: "service-v2", name: "Service — Feature Grid", description: "Grid cards with icons and image thumbnails", type: "service" },
  { id: "contact-v1", name: "Contact — Form & Details", description: "Phone, email badges, and interactive form", type: "contact" },
  { id: "location-v1", name: "Location — Office Details", description: "Location card, address, and hours layout", type: "location" },
];

const TEMPLATE_MAP: Record<string, React.FC<TemplateProps>> = {
  "home-v1": HomeV1,
  "about-v1": AboutV1,
  "service-v1": ServiceSplitHero,
  "service-v2": ServiceFeatureGrid,
  "contact-v1": ContactV1,
  "location-v1": LocationV1,
};

export function resolveTemplate(templateId: string): React.FC<TemplateProps> {
  return TEMPLATE_MAP[templateId] ?? ServiceSplitHero;
}

export { HomeV1, AboutV1, ServiceSplitHero, ServiceFeatureGrid, ContactV1, LocationV1 };