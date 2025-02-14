import { ConditionResult } from "../types/medical";

class DiagnosisService {
  private static BASE_URL =
    "https://clinicaltables.nlm.nih.gov/api/conditions/v3";

  static async getPotentialDiagnoses(
    symptoms: string[]
  ): Promise<ConditionResult[]> {
    if (symptoms.length === 0) {
      return [];
    }

    const query = symptoms.join(","); // Combine symptoms for the query
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
      }));
    } catch (error) {
      console.error("Error fetching potential diagnoses:", error);
      throw error;
    }
  }
}

export default DiagnosisService;
