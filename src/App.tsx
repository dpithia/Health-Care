import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { SymptomProvider } from "./context/SymptomContext";
import React from "react";
import routes from "tempo-routes";
import { useRoutes } from "react-router-dom";

// Lazy load components
const Home = React.lazy(() => import("./components/Home.tsx"));

function App() {
  console.log("App rendering");

  return (
    <ErrorBoundary>
      <SymptomProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B4570]" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          </Suspense>
        </BrowserRouter>
      </SymptomProvider>
    </ErrorBoundary>
  );
}

export default App;
