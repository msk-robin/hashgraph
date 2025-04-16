import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, useState } from "react";
import { HederaProvider } from "./contexts/HederaContext";
import LoadingSpinner from "./components/LoadingSpinner";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import About from "./pages/About";
import History from "./pages/History";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";

function App() {
  const [globalError, setGlobalError] = useState(null);

  return (
    <BrowserRouter>
      <HederaProvider>
        <MainLayout>
          {globalError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <div className="flex justify-between items-center">
                <p>{globalError}</p>
                <button
                  onClick={() => setGlobalError(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route
                path="/"
                element={<Dashboard onError={setGlobalError} />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
              <Route path="/history" element={<History />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </HederaProvider>
    </BrowserRouter>
  );
}

export default App;
