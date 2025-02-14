import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

type UrgencyLevel = "low" | "moderate" | "high";

interface UrgencyAssessmentProps {
  symptoms?: string[];
  urgencyLevel?: UrgencyLevel;
  message?: string;
  onCheckUrgency?: () => void;
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
  };
  return configs[level];
};

const UrgencyAssessment = ({
  symptoms = ["headache", "fatigue"],
  urgencyLevel = "low",
  message,
  onCheckUrgency = () => console.log("Checking urgency..."),
}: UrgencyAssessmentProps) => {
  const config = getUrgencyConfig(urgencyLevel);
  const Icon = config.icon;

  return (
    <div className="w-full max-w-2xl mx-auto p-8 space-y-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-500/10 border border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Symptom Assessment
        </h2>
        <Button
          onClick={onCheckUrgency}
          className="relative bg-gradient-to-r from-[#2B4570] to-[#A6E1E7] hover:opacity-90 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#2B4570] to-[#A6E1E7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
          <span className="relative z-10">Check Urgency</span>
        </Button>
      </div>

      {symptoms.length > 0 && (
        <Alert className={`${config.color} border`}>
          <Icon className="h-5 w-5" />
          <AlertTitle className="font-semibold">{config.title}</AlertTitle>
          <AlertDescription>
            {message || config.defaultMessage}
          </AlertDescription>
        </Alert>
      )}

      {urgencyLevel === "high" && (
        <Alert className="bg-[#DC3545] text-white border-none">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Emergency Alert</AlertTitle>
          <AlertDescription>
            Your symptoms indicate you should seek emergency care immediately.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UrgencyAssessment;
