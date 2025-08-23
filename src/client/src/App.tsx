import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Portfolio from "./pages/portfolio";
import NotFound from "./pages/not-found";
import "./index.css"; // Import main CSS
import "./portfolio.css"; // Import portfolio-specific CSS

// Custom hook to use hash for routing
const useHashLocation = () => {
  const [hash, setHash] = React.useState(
    typeof window !== "undefined" ? window.location.hash.replace("#", "") || "/" : "/"
  );

  React.useEffect(() => {
    // Update hash when location changes
    const handleHashChange = () => {
      setHash(window.location.hash.replace("#", "") || "/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Return hash location and a function to update it
  return [
    hash,
    (to) => {
      window.location.hash = to;
    }
  ];
};

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Portfolio} />
        <Route path="/resumevibe" component={Portfolio} />
        <Route path="*" component={Portfolio} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
