import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import NotFound from "@/pages/not-found";

// Page Imports
import Dashboard from "@/pages/Dashboard";
import Episodes from "@/pages/Episodes";
import EpisodeDetails from "@/pages/EpisodeDetails";
import Team from "@/pages/Team";
import Assets from "@/pages/Assets";

function Router() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Sidebar />
      <main className="flex-1 ml-64 relative z-0">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/episodes" component={Episodes} />
          <Route path="/episodes/:id" component={EpisodeDetails} />
          <Route path="/team" component={Team} />
          <Route path="/assets" component={Assets} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
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
