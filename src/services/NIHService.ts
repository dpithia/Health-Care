// services/NIHService.ts
import { ConditionResult, UrgencyResult } from "../types/medical";

class NIHService {
  private static BASE_URL =
    "https://clinicaltables.nlm.nih.gov/api/conditions/v3";

  static async getPotentialDiagnoses(
    symptoms: string[]
  ): Promise<ConditionResult[]> {
    if (symptoms.length === 0) {
      return [];
    }

    const query = symptoms.join(",");
    try {
      const response = await fetch(
        `${this.BASE_URL}/search?terms=${encodeURIComponent(
          query
        )}&df=primary_name,consumer_name`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch potential diagnoses");
      }

      const [total, terms, fields, items] = await response.json();

      return items.map((item: string[]) => ({
        primary_name: item[0],
        consumer_name: item[1] || item[0],
        severity: this.determineSeverity(item[0]),
        recommended_action: this.getRecommendedAction(item[0]),
      }));
    } catch (error) {
      console.error("Error fetching potential diagnoses:", error);
      throw error;
    }
  }

  static async determineUrgency(
    conditions: ConditionResult[]
  ): Promise<UrgencyResult> {
    const emergencyConditions = [
      "heart attack",
      "stroke",
      "severe",
      "emergency",
    ];
    const urgentConditions = ["infection", "fracture", "acute"];

    let level: UrgencyResult["level"] = "low";
    const reasoning: string[] = [];

    for (const condition of conditions) {
      const name = condition.primary_name.toLowerCase();

      if (emergencyConditions.some((term) => name.includes(term))) {
        level = "emergency";
        reasoning.push(
          `${condition.consumer_name} requires immediate medical attention`
        );
      } else if (urgentConditions.some((term) => name.includes(term))) {
        if (level !== "emergency") level = "high";
        reasoning.push(`${condition.consumer_name} may require urgent care`);
      }
    }

    if (conditions.length > 2 && level === "low") {
      level = "moderate";
      reasoning.push("Multiple symptoms may require medical evaluation");
    }

    if (reasoning.length === 0) {
      reasoning.push(
        "Based on the symptoms, this appears to be a non-urgent condition"
      );
    }

    return { level, reasoning };
  }

  private static determineSeverity(
    condition: string
  ): "low" | "moderate" | "high" {
    const emergencyConditions = [
      "heart attack",
      "stroke",
      "severe",
      "emergency",
    ];
    const moderateConditions = ["infection", "fracture", "acute"];

    condition = condition.toLowerCase();

    if (emergencyConditions.some((term) => condition.includes(term))) {
      return "high";
    } else if (moderateConditions.some((term) => condition.includes(term))) {
      return "moderate";
    }
    return "low";
  }

  private static getRecommendedAction(condition: string): string {
    const severity = this.determineSeverity(condition);
    switch (severity) {
      case "high":
        return "Seek immediate medical attention";
      case "moderate":
        return "Schedule an appointment with your healthcare provider soon";
      default:
        return "Monitor symptoms and rest";
    }
  }
}

export default NIHService;
