// services/DiagnosisService.ts
import { ConditionResult, SymptomMatch } from "../types/medical";

class DiagnosisService {
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
      // Fetch initial conditions with expanded fields
      const response = await fetch(
        `${this.BASE_URL}/search?terms=${encodeURIComponent(
          query
        )}&df=primary_name,consumer_name,description,symptoms,severity,info_url`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch potential diagnoses");
      }

      const [total, terms, fields, items] = await response.json();

      // Process and enhance the results
      const results = items.map((item: any[]) => {
        const condition: ConditionResult = {
          primary_name: item[0],
          consumer_name: item[1] || item[0],
          description: item[2] || undefined,
          symptoms: item[3] ? this.parseSymptoms(item[3]) : undefined,
          severity: this.determineSeverity(item[0], symptoms),
          recommended_action: this.getRecommendedAction(item[0], symptoms),
          info_link: item[5] || undefined,
        };
        return condition;
      });

      // Sort by relevance and add match scores
      const scoredResults = this.rankAndScoreResults(results, symptoms);
      return scoredResults.slice(0, 5); // Return top 5 matches
    } catch (error) {
      console.error("Error fetching potential diagnoses:", error);
      throw error;
    }
  }

  private static parseSymptoms(symptomsData: string): string[] {
    // Convert API symptom data into readable format
    try {
      return symptomsData.split(",").map((s) => s.trim());
    } catch {
      return [];
    }
  }

  private static determineSeverity(
    condition: string,
    symptoms: string[]
  ): "low" | "moderate" | "high" {
    // Determine severity based on condition and symptoms
    const emergencyConditions = [
      "heart attack",
      "stroke",
      "severe",
      "emergency",
    ];
    const moderateConditions = ["infection", "fracture", "sprain"];

    condition = condition.toLowerCase();

    if (emergencyConditions.some((ec) => condition.includes(ec))) {
      return "high";
    } else if (moderateConditions.some((mc) => condition.includes(mc))) {
      return "moderate";
    }
    return "low";
  }

  private static getRecommendedAction(
    condition: string,
    symptoms: string[]
  ): string {
    const severity = this.determineSeverity(condition, symptoms);

    switch (severity) {
      case "high":
        return "Seek immediate medical attention";
      case "moderate":
        return "Schedule an appointment with your healthcare provider";
      default:
        return "Monitor symptoms and consult a healthcare provider if they worsen";
    }
  }

  private static rankAndScoreResults(
    conditions: ConditionResult[],
    symptoms: string[]
  ): ConditionResult[] {
    return conditions.sort((a, b) => {
      const scoreA = this.calculateMatchScore(a, symptoms);
      const scoreB = this.calculateMatchScore(b, symptoms);
      return scoreB - scoreA;
    });
  }

  private static calculateMatchScore(
    condition: ConditionResult,
    symptoms: string[]
  ): number {
    let score = 0;
    const conditionText =
      `${condition.primary_name} ${condition.consumer_name}`.toLowerCase();

    symptoms.forEach((symptom) => {
      if (conditionText.includes(symptom.toLowerCase())) {
        score += 1;
      }
      // Add bonus points for severity
      if (condition.severity === "high") score += 0.5;
      if (
        condition.symptoms?.some((s) =>
          s.toLowerCase().includes(symptom.toLowerCase())
        )
      ) {
        score += 0.5;
      }
    });

    return score;
  }
}

export default DiagnosisService;
