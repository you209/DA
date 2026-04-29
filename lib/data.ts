import type { SupportService } from './types';

export const states = ['TAS','VIC','NSW','QLD','SA','WA','NT','ACT'];
export const categories = [
  'Domestic violence','Family violence','Mental health','Crisis support','Legal help','Housing',
  'Grandparents/family support','ADHD','Autism','Neurodivergent support','Psychologists','Doctors/GPs','Facebook/community groups'
];

export type Service = {
  id: string;
  name: string;
  helps: string;
  phone: string;
  website: string;
  hours: string;
  area: string;
  tags: string[];
  description: string;
};

export const services: Service[] = [
  {id:'000',name:'000 Emergency',helps:'Immediate danger or emergency',phone:'000',website:'https://www.triplezero.gov.au',hours:'24/7',area:'Australia-wide',tags:['Crisis support'],description:'Call 000 if someone is seriously hurt, unsafe, or in immediate danger.'},
  {id:'1800respect',name:'1800RESPECT',helps:'People impacted by domestic, family, or sexual violence',phone:'1800 737 732',website:'https://www.1800respect.org.au',hours:'24/7',area:'Australia-wide',tags:['Domestic violence','Family violence'],description:'Confidential counselling, information, and referral support.'},
  {id:'lifeline',name:'Lifeline',helps:'Anyone in emotional distress or crisis',phone:'13 11 14',website:'https://www.lifeline.org.au',hours:'24/7',area:'Australia-wide',tags:['Mental health','Crisis support'],description:'Crisis support and suicide prevention services by phone and chat.'},
  {id:'beyondblue',name:'Beyond Blue',helps:'People experiencing anxiety or depression',phone:'1300 22 4636',website:'https://www.beyondblue.org.au',hours:'24/7',area:'Australia-wide',tags:['Mental health'],description:'Support line and resources for mental health and wellbeing.'},
  {id:'kids',name:'Kids Helpline',helps:'Young people aged 5 to 25',phone:'1800 55 1800',website:'https://kidshelpline.com.au',hours:'24/7',area:'Australia-wide',tags:['Mental health','Family violence'],description:'Free counselling for children and young adults.'},
  {id:'healthdirect',name:'Healthdirect',helps:'Anyone needing health advice',phone:'1800 022 222',website:'https://www.healthdirect.gov.au',hours:'24/7',area:'Australia-wide',tags:['Doctors/GPs'],description:'Government-funded health advice and service finder.'},
  {id:'autismconnect',name:'Autism Connect',helps:'Autistic people, families and carers',phone:'1300 308 699',website:'https://www.amaze.org.au/autism-connect',hours:'Business hours',area:'Australia-wide',tags:['Autism','Neurodivergent support'],description:'Guidance to autism supports and trusted local pathways.'},
  {id:'askizzy',name:'Ask Izzy',helps:'People looking for local support services',phone:'N/A',website:'https://askizzy.org.au',hours:'Always available online',area:'Australia-wide',tags:['Housing','Legal help','Crisis support'],description:'Search tool to find housing, food, health and legal help.'}
];
