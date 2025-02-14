import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useSymptoms } from "../context/SymptomContext";
import NIHService from "../services/NIHService";
import { ConditionResult } from "../types/medical";

interface SymptomSearchProps {
  onSymptomSelect: (symptom: string) => void;
  placeholder?: string;
}

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Fatigue",
  "Nausea",
  "Shortness of breath",
  "Chest pain",
  "Back pain",
  "Sore throat",
  "Dizziness",
];

const SymptomSearch = ({
  onSymptomSelect,
  placeholder = "Search symptoms...",
}: SymptomSearchProps) => {
  const { state, dispatch } = useSymptoms();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<ConditionResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onSymptomSelect(currentValue);
    setOpen(false);
  };

  useEffect(() => {
    const searchSymptoms = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await NIHService.searchConditions(value);
        setSuggestions(results);
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to search symptoms" });
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchSymptoms, 300);
    return () => clearTimeout(debounceTimer);
  }, [value, dispatch]);

  return (
    <div className="w-full max-w-[600px] bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-blue-500/10 border border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] group">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full relative">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 h-12 text-base border-[#2B4570] focus:ring-2 focus:ring-[#2B4570] rounded-xl bg-white/50 backdrop-blur-xl transition-all duration-300 focus:bg-white/90 group-hover:bg-white/70 placeholder:text-[#2B4570]/50 animate-fade-in"
            ></Input>
            <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
            {value && (
              <Button
                variant="ghost"
                className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setValue("")}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search symptoms..." />
            <CommandList>
              <CommandEmpty>No symptoms found.</CommandEmpty>
              <CommandGroup heading="Common Symptoms">
                {commonSymptoms.map((symptom) => (
                  <CommandItem
                    key={symptom}
                    value={symptom}
                    onSelect={handleSelect}
                    className="cursor-pointer hover:bg-[#F5F8FA]"
                  >
                    {symptom}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SymptomSearch;
