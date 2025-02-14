export interface HealthProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  medications: string[];
  allergies: string[];
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface SymptomRecord {
  id: string;
  timestamp: Date;
  symptoms: string[];
  urgencyLevel: UrgencyLevel;
  notes: string;
}

export type UrgencyLevel = "low" | "moderate" | "high" | "emergency";

export interface ConditionResult {
  primary_name: string;
  consumer_name: string;
  related_symptoms?: string[];
  severity?: number;
}
