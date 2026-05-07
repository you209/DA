export type CuratedCourse = {
  id: string;
  title: string;
  provider: string;
  summary: string;
  state: string;
  delivery: Array<'online' | 'phone' | 'in_person'>;
  website: string;
  phone?: string;
  cost: 'free' | 'paid' | 'unknown';
  audience: string;
  verified_status: 'verified' | 'needs_review';
  last_checked_at: string;
  notes?: string;
};

// Only add a course here after checking it against the official provider page.
// Do not auto-create courses from service descriptions or placeholder support pathways.
export const curatedCourses: CuratedCourse[] = [
  {
    id: 'relationships-australia-courses',
    title: 'Relationships Australia courses and workshops',
    provider: 'Relationships Australia',
    summary: 'Relationship, family and parenting workshops offered through state and territory Relationships Australia services. Availability varies by location.',
    state: 'Australia-wide',
    delivery: ['online', 'in_person'],
    website: 'https://www.relationships.org.au/what-we-do/',
    phone: '1300 364 277',
    cost: 'unknown',
    audience: 'Individuals, couples, parents and families',
    verified_status: 'needs_review',
    last_checked_at: '2026-04-30',
    notes: 'Check the user’s state branch before showing enrolment details.'
  },
  {
    id: 'carer-gateway-coaching',
    title: 'Carer coaching and support',
    provider: 'Carer Gateway',
    summary: 'Coaching and support options for carers. Good for people supporting family members, children, older people or people with disability.',
    state: 'Australia-wide',
    delivery: ['online', 'phone'],
    website: 'https://www.carergateway.gov.au/',
    phone: '1800 422 737',
    cost: 'free',
    audience: 'Carers and family supports',
    verified_status: 'needs_review',
    last_checked_at: '2026-04-30',
    notes: 'Confirm exact program availability before publishing as a fixed course.'
  }
];
