export type VerifiedStatus = 'verified' | 'unverified' | 'needs_review';

export type SupportService = {
  id: string;
  name: string;
  source_url: string;
  source_name: string;
  last_checked_at: string;
  verified_status: VerifiedStatus;
  normal_description: string;
  easy_read_description: string;
  eligibility: string;
  opening_hours: string;
  phone: string;
  website: string;
  state: string;
  service_area: string;
  categories: string[];
  tags: string[];
  courses_programs: string[];
  related_services: string[];
  active: boolean;
};

export type DirectoryType = 'service' | 'practitioner' | 'advocacy_group' | 'helpline' | 'course';
export type CostType = 'free' | 'paid' | 'unknown';

export type DirectoryListing = {
  id: string;
  type: DirectoryType;
  name: string;
  category: string[];
  location: string;
  availability: Array<'online' | 'phone' | 'in_person'>;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  whoTheyHelp?: string;
  whatTheyProvide?: string;
  cost?: CostType;
  accessibility?: string[];
  tags: string[];
  sourceUrl: string;
  lastVerified: string;
};

export type InfoPage = {
  slug: string;
  title: string;
  summary: string;
  whatItMeans: string;
  signs: string[];
  examples: string[];
  whatYouCanDo: string[];
  urgentHelp: string;
  relatedServices: string[];
  relatedTemplates: string[];
  sources: string[];
  disclaimer: string;
};

export type GuidedPathwayQuestion = { id: string; text: string; options: string[] };
export type GuidedPathwayResult = { id: string; triggers: string[]; nextSteps: string[]; relatedServiceIds: string[]; warning?: string };

export type ImportMethod = 'api' | 'csv' | 'manual' | 'approved_scrape';
