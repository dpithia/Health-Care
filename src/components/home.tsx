import React, { useState } from "react";
import SymptomSearch from "./SymptomSearch";
import SymptomTagList from "./SymptomTagList";
import UrgencyAssessment from "./UrgencyAssessment";

interface Symptom {
  id: string;
  name: string;
}

const Home = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { id: "1", name: "Headache" },
    { id: "2", name: "Fever" },
  ]);

  const handleSymptomSelect = (symptomName: string) => {
    const newSymptom = {
      id: Date.now().toString(),
      name: symptomName,
    };
    setSymptoms([...symptoms, newSymptom]);
  };

  const handleSymptomRemove = (id: string) => {
    setSymptoms(symptoms.filter((symptom) => symptom.id !== id));
  };

  const handleCheckUrgency = () => {
    // Placeholder for urgency check functionality
    console.log("Checking urgency for symptoms:", symptoms);
  };

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

        <SymptomTagList symptoms={symptoms} onRemove={handleSymptomRemove} />

        <UrgencyAssessment
          symptoms={symptoms.map((s) => s.name)}
          onCheckUrgency={handleCheckUrgency}
          urgencyLevel="low"
        />
      </div>
    </div>
  );
};

export default Home;
