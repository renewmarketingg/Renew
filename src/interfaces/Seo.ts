export interface SeoMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export interface SeoFonts {
  provider?: 'googleapis' | 'gstatic';
  family?: string;
  weights?: string[];
}

export interface SeoProps {
  adm?: boolean;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  icon?: string;
  themeColor?: string;
  fonts?: SeoFonts;
  og?: SeoMeta;
  twitter?: SeoMeta & { card?: string };
  schema?: Record<string, any>;
  canonicalURL?: string;
}
