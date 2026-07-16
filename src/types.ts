export type AppRole = 'senior' | 'family';

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  instruction: string;
  remainingDays: number;
  enabled: boolean;
};

export type MedicationLog = {
  id: string;
  medicationId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'taken' | 'skipped';
  confirmedAt: string;
};

export type HealthRecord = {
  id: string;
  type: 'blood-pressure' | 'blood-sugar' | 'heart-rate';
  primaryValue: number;
  secondaryValue?: number;
  note?: string;
  recordedAt: string;
};

export type CareEvent = {
  id: string;
  level: 'normal' | 'attention' | 'urgent';
  title: string;
  detail: string;
  occurredAt: string;
  acknowledged: boolean;
};

export type FamilyMessage = {
  id: string;
  author: string;
  text: string;
  sentAt: string;
  played: boolean;
};

export type EmergencyContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  priority: number;
};

export type SeniorProfile = {
  name: string;
  preferredName: string;
  city: string;
  lastActiveAt: string;
};

export type AppData = {
  senior: SeniorProfile;
  medications: Medication[];
  medicationLogs: MedicationLog[];
  healthRecords: HealthRecord[];
  events: CareEvent[];
  messages: FamilyMessage[];
  contacts: EmergencyContact[];
};

export type HealthRecordInput = Omit<HealthRecord, 'id' | 'recordedAt'>;
export type MedicationInput = Omit<Medication, 'id' | 'remainingDays' | 'enabled'>;
