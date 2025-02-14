import React, { useEffect, useState } from "react";
import SymptomSearch from "./SymptomSearch";
import SymptomTagList from "./SymptomTagList";
import UrgencyAssessment from "./UrgencyAssessment";
import PotentialDiagnoses from "./PotentialDiagnoses";
import { useSymptoms } from "../context/SymptomContext";
import NIHService from "../services/NIHService";

interface UrgencyResult {
  level: "low" | "moderate" | "high" | "emergency";
  reasoning: string[];
}

const Home = () => {
  const { state, dispatch } = useSymptoms();
  const [urgencyResult, setUrgencyResult] = useState<UrgencyResult | null>(
    null
  );

  const handleSymptomSelect = async (symptomName: string) => {
    dispatch({ type: "ADD_SYMPTOM", payload: symptomName });
    // Trigger assessment with updated symptoms
    handleCheckUrgency([...state.currentSymptoms, symptomName]);
  };

  const handleSymptomRemove = (id: string) => {
    dispatch({ type: "REMOVE_SYMPTOM", payload: id });
    // Re-assess after removal
    const updatedSymptoms = state.currentSymptoms.filter((s) => s !== id);
    handleCheckUrgency(updatedSymptoms);
  };

  const handleCheckUrgency = async (symptoms: string[]) => {
    if (symptoms.length === 0) {
      setUrgencyResult(null);
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const result = await NIHService.determineUrgency(
        symptoms.map((name) => ({ primary_name: name, consumer_name: name }))
      );
      setUrgencyResult(result);
    } catch (error) {
      console.error("Assessment failed:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to assess symptom urgency",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  console.log("Home rendering, current symptoms:", state.currentSymptoms);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B4570]/5 to-[#A6E1E7]/5 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iIzJCNDU3MCIgb3BhY2l0eT0iMC4xIiBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
      <div className="max-w-2xl mx-auto space-y-10 relative">
        <div className="text-center mb-16 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B4570]/20 via-[#A6E1E7]/20 to-[#2B4570]/20 blur-3xl -z-10 animate-pulse" />
          <h1 className="text-4xl font-bold text-[#2B4570] mb-4 tracking-tight">
            Symptom Assessment
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your symptoms below for an initial assessment
          </p>
        </div>

        <SymptomSearch
          onSymptomSelect={handleSymptomSelect}
          placeholder="Type to search symptoms..."
        />

        <SymptomTagList
          symptoms={state.currentSymptoms.map((name) => ({
            id: name,
            name: name,
          }))}
          onRemove={handleSymptomRemove}
        />

        <UrgencyAssessment
          symptoms={state.currentSymptoms}
          onCheckUrgency={() => handleCheckUrgency(state.currentSymptoms)}
          urgencyLevel={urgencyResult?.level || "low"}
          reasoning={urgencyResult?.reasoning}
          isLoading={state.isLoading}
        />

        <PotentialDiagnoses symptoms={state.currentSymptoms} />
      </div>
    </div>
  );
};

export default Home;
