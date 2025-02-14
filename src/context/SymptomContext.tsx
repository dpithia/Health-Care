import React, { createContext, useContext, useReducer } from "react";
import { SymptomRecord, HealthProfile } from "../types/medical";

interface SymptomState {
  currentSymptoms: string[];
  symptomHistory: SymptomRecord[];
  healthProfile: HealthProfile | null;
  isLoading: boolean;
  error: string | null;
}

type SymptomAction =
  | { type: "ADD_SYMPTOM"; payload: string }
  | { type: "REMOVE_SYMPTOM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SAVE_ASSESSMENT"; payload: SymptomRecord }
  | { type: "UPDATE_PROFILE"; payload: HealthProfile };

const SymptomContext = createContext<{
  state: SymptomState;
  dispatch: React.Dispatch<SymptomAction>;
} | null>(null);

const initialState: SymptomState = {
  currentSymptoms: [],
  symptomHistory: [],
  healthProfile: null,
  isLoading: false,
  error: null,
};

const symptomReducer = (
  state: SymptomState,
  action: SymptomAction
): SymptomState => {
  switch (action.type) {
    case "ADD_SYMPTOM":
      return {
        ...state,
        currentSymptoms: [...state.currentSymptoms, action.payload],
      };
    case "REMOVE_SYMPTOM":
      return {
        ...state,
        currentSymptoms: state.currentSymptoms.filter(
          (s) => s !== action.payload
        ),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SAVE_ASSESSMENT":
      return {
        ...state,
        symptomHistory: [...state.symptomHistory, action.payload],
      };
    case "UPDATE_PROFILE":
      return { ...state, healthProfile: action.payload };
    default:
      return state;
  }
};

export const SymptomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(symptomReducer, initialState);

  return (
    <SymptomContext.Provider value={{ state, dispatch }}>
      {children}
    </SymptomContext.Provider>
  );
};

export const useSymptoms = () => {
  const context = useContext(SymptomContext);
  if (!context) {
    throw new Error("useSymptoms must be used within a SymptomProvider");
  }
  return context;
};
