import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DiagnosisService from "../services/DiagnosisService";
import { ConditionResult } from "../types/medical";

interface DiagnosisProps {
  symptoms: string[];
}

const PotentialDiagnoses: React.FC<DiagnosisProps> = ({ symptoms }) => {
  const [diagnoses, setDiagnoses] = useState<ConditionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

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
        setDiagnoses(results);
      } catch (err) {
        setError("Failed to fetch potential diagnoses");
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [symptoms]);

  const getSeverityColor = (severity: string = "low") => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50";
      case "moderate":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-green-600 bg-green-50";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#2B4570] flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Potential Diagnoses
        </h2>
        {loading && <Loader2 className="w-5 h-5 text-[#2B4570] animate-spin" />}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-600 mb-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {diagnoses.length > 0 ? (
        <div className="space-y-4">
          {diagnoses.map((diagnosis, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/50 border border-[#2B4570]/10 hover:border-[#2B4570]/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#2B4570]">
                      {diagnosis.consumer_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getSeverityColor(
                        diagnosis.severity
                      )}`}
                    >
                      {diagnosis.severity?.charAt(0).toUpperCase() +
                        diagnosis.severity?.slice(1)}{" "}
                      Priority
                    </span>
                  </div>

                  {diagnosis.consumer_name !== diagnosis.primary_name && (
                    <p className="text-sm text-gray-500 mt-1">
                      Medical term: {diagnosis.primary_name}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      setExpandedCard(expandedCard === index ? null : index)
                    }
                    className="mt-2 text-sm text-[#2B4570] flex items-center gap-1 hover:underline"
                  >
                    {expandedCard === index ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show more
                      </>
                    )}
                  </button>
                </div>
              </div>

              {expandedCard === index && (
                <div className="mt-4 space-y-3 border-t border-gray-200 pt-3">
                  {diagnosis.description && (
                    <p className="text-sm text-gray-600">
                      {diagnosis.description}
                    </p>
                  )}

                  {diagnosis.recommended_action && (
                    <div className="text-sm">
                      <span className="font-medium text-[#2B4570]">
                        Recommended Action:{" "}
                      </span>
                      <span className="text-gray-600">
                        {diagnosis.recommended_action}
                      </span>
                    </div>
                  )}

                  {diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-[#2B4570]">
                        Common Symptoms:{" "}
                      </span>
                      <span className="text-gray-600">
                        {diagnosis.symptoms.join(", ")}
                      </span>
                    </div>
                  )}

                  {diagnosis.info_link && (
                    <a
                      href={diagnosis.info_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline block"
                    >
                      Learn more about this condition
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-8 text-gray-500">
            No potential diagnoses found based on current symptoms.
          </div>
        )
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-gray-600 flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-medium block mb-1">Important Notice:</strong>
          This is not a definitive medical diagnosis. These conditions are
          potential matches based on your symptoms. Always consult with a
          qualified healthcare professional for proper medical evaluation and
          advice.
        </div>
      </div>
    </div>
  );
};

export default PotentialDiagnoses;
