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

export type ImportMethod = 'api' | 'csv' | 'manual' | 'approved_scrape';
