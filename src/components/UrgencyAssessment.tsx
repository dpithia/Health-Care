import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

type UrgencyLevel = "low" | "moderate" | "high" | "emergency";

interface UrgencyAssessmentProps {
  symptoms: string[];
  onCheckUrgency: () => void;
  urgencyLevel: UrgencyLevel;
  reasoning?: string[];
  isLoading?: boolean;
}

const getUrgencyConfig = (level: UrgencyLevel) => {
  const configs = {
    low: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle,
      title: "Low Urgency",
      defaultMessage: "Your symptoms suggest non-urgent care is appropriate.",
    },
    moderate: {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: AlertTriangle,
      title: "Moderate Urgency",
      defaultMessage: "Consider scheduling a medical consultation soon.",
    },
    high: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: AlertCircle,
      title: "High Urgency",
      defaultMessage: "Seek immediate medical attention.",
    },
    emergency: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: AlertCircle,
      title: "Emergency",
      defaultMessage: "Seek immediate medical attention.",
    },
  };
  return configs[level];
};

const UrgencyAssessment = ({
  symptoms,
  onCheckUrgency,
  urgencyLevel,
  reasoning = [],
  isLoading = false,
}: UrgencyAssessmentProps) => {
  const config = getUrgencyConfig(urgencyLevel);
  const Icon = config.icon;

  const urgencyColors = {
    low: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    emergency: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onCheckUrgency}
        disabled={symptoms.length === 0 || isLoading}
        className={`w-full p-4 rounded-xl ${
          symptoms.length === 0
            ? "bg-gray-100 text-gray-400"
            : "bg-[#2B4570] text-white hover:bg-[#2B4570]/90"
        } transition-colors duration-200`}
      >
        {isLoading ? "Assessing..." : "Check Urgency"}
      </button>

      {urgencyLevel && (
        <div className={`p-4 rounded-xl ${urgencyColors[urgencyLevel]}`}>
          <h3 className="font-semibold mb-2">
            Urgency Level: {urgencyLevel.toUpperCase()}
          </h3>
          {reasoning && reasoning.length > 0 && (
            <ul className="list-disc list-inside space-y-1">
              {reasoning.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UrgencyAssessment;
