import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HederaProvider } from "./contexts/HederaContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

console.log("Rendering application...");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <HederaProvider>
        <App />
      </HederaProvider>
    </ErrorBoundary>
  </StrictMode>
);
