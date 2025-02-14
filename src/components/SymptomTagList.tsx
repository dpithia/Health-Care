import React from "react";
import { X } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface Symptom {
  id: string;
  name: string;
}

interface SymptomTagListProps {
  symptoms?: Symptom[];
  onRemove?: (id: string) => void;
}

const SymptomTagList = ({
  symptoms = [
    { id: "1", name: "Headache" },
    { id: "2", name: "Fever" },
    { id: "3", name: "Cough" },
  ],
  onRemove = () => {},
}: SymptomTagListProps) => {
  return (
    <div className="w-full bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-blue-500/10 border border-white/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
      <ScrollArea className="w-full">
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom) => (
            <Badge
              key={symptom.id}
              variant="secondary"
              className="px-4 py-2 text-sm flex items-center gap-2 bg-gradient-to-r from-[#2B4570]/10 to-[#A6E1E7]/20 text-[#2B4570] hover:from-[#2B4570]/20 hover:to-[#A6E1E7]/30 transition-all duration-300 rounded-xl border border-[#2B4570]/20 hover:scale-105 hover:shadow-md hover:shadow-blue-500/10 animate-fade-in"
            >
              {symptom.name}
              <button
                onClick={() => onRemove(symptom.id)}
                className="hover:bg-[#0066CC] hover:text-white rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${symptom.name}`}
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SymptomTagList;
