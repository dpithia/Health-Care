import { AxiosError } from "axios";
import { ConditionResult, SymptomRecord, UrgencyLevel } from "../types/medical";

class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "APIError";
  }
}

class NIHService {
  private static BASE_URL =
    "https://clinicaltables.nlm.nih.gov/api/conditions/v3";

  static async searchConditions(query: string): Promise<ConditionResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/search?terms=${encodeURIComponent(
          query
        )}&df=primary_name,consumer_name`
      );

      if (!response.ok) {
        throw new APIError("Failed to fetch conditions", response.status);
      }

      const [total, terms, fields, items] = await response.json();

      return items.map((item: string[]) => ({
        primary_name: item[0],
        consumer_name: item[1] || item[0],
        severity: this.calculateSymptomSeverity(item[0]),
      }));
    } catch (error) {
      console.error("Error searching conditions:", error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError("Failed to search conditions");
    }
  }

  static async getConditionDetails(
    id: string
  ): Promise<ConditionResult | null> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/details?terms=${encodeURIComponent(id)}`
      );
      const data = await response.json();

      return {
        primary_name: data.primary_name,
        consumer_name: data.consumer_name || data.primary_name,
      };
    } catch (error) {
      console.error("Error fetching condition details:", error);
      return null;
    }
  }

  static determineUrgency(conditions: ConditionResult[]): {
    level: "low" | "moderate" | "high" | "emergency";
    reasoning: string[];
  } {
    const emergencyConditions = [
      "heart attack",
      "stroke",
      "seizure",
      "anaphylaxis",
      "severe bleeding",
      "chest pain",
      "difficulty breathing",
    ];

    const highUrgencyConditions = [
      "pneumonia",
      "appendicitis",
      "broken bone",
      "severe pain",
      "high fever",
      "severe dehydration",
    ];

    let level: "low" | "moderate" | "high" | "emergency" = "low";
    const reasoning: string[] = [];

    for (const condition of conditions) {
      const name = condition.consumer_name.toLowerCase();

      if (emergencyConditions.some((ec) => name.includes(ec))) {
        level = "emergency";
        reasoning.push(
          `${condition.consumer_name} requires immediate medical attention`
        );
      } else if (highUrgencyConditions.some((hc) => name.includes(hc))) {
        if (level !== "emergency") {
          level = "high";
        }
        reasoning.push(
          `${condition.consumer_name} may require urgent medical attention`
        );
      }
    }

    if (reasoning.length === 0) {
      reasoning.push(
        "Based on the symptoms, this appears to be a non-urgent condition"
      );
    }

    return { level, reasoning };
  }

  private static calculateSymptomSeverity(symptom: string): number {
    const emergencyKeywords = ["severe", "acute", "extreme", "critical"];
    const moderateKeywords = ["moderate", "mild", "persistent"];

    const symptomLower = symptom.toLowerCase();

    if (emergencyKeywords.some((keyword) => symptomLower.includes(keyword))) {
      return 1.0;
    }
    if (moderateKeywords.some((keyword) => symptomLower.includes(keyword))) {
      return 0.5;
    }
    return 0.25;
  }
}

export default NIHService;
