// context/SymptomContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface SymptomState {
  currentSymptoms: string[];
  isLoading: boolean;
  error: string | null;
}

type SymptomAction =
  | { type: "ADD_SYMPTOM"; payload: string }
  | { type: "REMOVE_SYMPTOM"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: SymptomState = {
  currentSymptoms: [],
  isLoading: false,
  error: null,
};

const SymptomContext = createContext<
  | {
      state: SymptomState;
      dispatch: React.Dispatch<SymptomAction>;
    }
  | undefined
>(undefined);

function symptomReducer(
  state: SymptomState,
  action: SymptomAction
): SymptomState {
  switch (action.type) {
    case "ADD_SYMPTOM":
      if (state.currentSymptoms.includes(action.payload)) {
        return state;
      }
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
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

export function SymptomProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(symptomReducer, initialState);

  return (
    <SymptomContext.Provider value={{ state, dispatch }}>
      {children}
    </SymptomContext.Provider>
  );
}

export function useSymptoms() {
  const context = useContext(SymptomContext);
  if (context === undefined) {
    throw new Error("useSymptoms must be used within a SymptomProvider");
  }
  return context;
}
