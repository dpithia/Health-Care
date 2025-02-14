import React, { useEffect, useState } from "react";
import DiagnosisService from "../services/DiagnosisService";
import { ConditionResult } from "../types/medical";

interface DiagnosisProps {
  symptoms: string[];
}

const PotentialDiagnoses: React.FC<DiagnosisProps> = ({ symptoms }) => {
  const [diagnoses, setDiagnoses] = useState<ConditionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (symptoms.length === 0) {
        setDiagnoses([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const results = await DiagnosisService.getPotentialDiagnoses(symptoms);
        setDiagnoses(results.slice(0, 5)); // Show top 5 diagnoses
      } catch (err) {
        setError("Failed to fetch potential diagnoses");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [symptoms]);

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20">
      <h2 className="text-xl font-bold mb-4">Potential Diagnoses</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {diagnoses.length > 0 ? (
        <ul className="list-disc list-inside">
          {diagnoses.map((diagnosis, index) => (
            <li key={index}>
              <strong>{diagnosis.primary_name}</strong> -{" "}
              {diagnosis.consumer_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No potential diagnoses found.</p>
      )}
    </div>
  );
};

export default PotentialDiagnoses;
