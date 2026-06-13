import { useEffect, useState } from 'react';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface SafePlace {
  id: string;
  name: string;
  notes: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface SafetyPlan {
  contacts: Contact[];
  safePlaces: SafePlace[];
  codeWord: string;
  codeWordMeaning: string;
  bagItems: ChecklistItem[];
  documents: ChecklistItem[];
  notes: string;
  childrenNotes: string;
}

const STORAGE_KEY = 'helphub_safety_plan';

export const DEFAULT_BAG_ITEMS = [
  'ID — driver licence, passport, Medicare card',
  'Money, bank cards and some cash',
  'Phone and charger',
  'Medications and prescriptions',
  'House, car and work keys',
  'A change of clothes for you and your children',
  "Children's comfort items (toys, blankets)",
  'Important documents (see checklist below)',
];

export const DEFAULT_DOCUMENTS = [
  'Birth certificates — you and your children',
  'Passports and visas',
  'Medicare card',
  'Driver licence or photo ID',
  'Bank account and superannuation details',
  'Centrelink / government correspondence',
  'Lease or rental agreement',
  'Insurance documents',
  'Custody, parenting or family violence orders',
  'Medical records and prescriptions',
];

function emptyPlan(): SafetyPlan {
  return {
    contacts: [],
    safePlaces: [],
    codeWord: '',
    codeWordMeaning: '',
    bagItems: DEFAULT_BAG_ITEMS.map((label) => ({ id: crypto.randomUUID(), label, checked: false })),
    documents: DEFAULT_DOCUMENTS.map((label) => ({ id: crypto.randomUUID(), label, checked: false })),
    notes: '',
    childrenNotes: '',
  };
}

export function useSafetyPlan() {
  const [plan, setPlan] = useState<SafetyPlan>({
    contacts: [],
    safePlaces: [],
    codeWord: '',
    codeWordMeaning: '',
    bagItems: [],
    documents: [],
    notes: '',
    childrenNotes: '',
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setPlan(stored ? (JSON.parse(stored) as SafetyPlan) : emptyPlan());
    } catch {
      setPlan(emptyPlan());
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      /* ignore storage errors */
    }
  }, [plan, loaded]);

  const reset = () => setPlan(emptyPlan());

  return { plan, setPlan, loaded, reset };
}
