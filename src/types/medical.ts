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
  description?: string;
  symptoms?: string[];
  severity?: "low" | "moderate" | "high";
  recommended_action?: string;
  info_link?: string;
}

export interface SymptomMatch {
  matchedSymptoms: string[];
  unmatchedSymptoms: string[];
  matchScore: number;
}

export interface UrgencyResult {
  level: "low" | "moderate" | "high" | "emergency";
  reasoning: string[];
}

export interface Symptom {
  id: string;
  name: string;
}
