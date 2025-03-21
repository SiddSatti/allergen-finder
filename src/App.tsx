
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DietaryRestrictions from "./pages/DietaryRestrictions";
import FoodParameters from "./pages/FoodParameters";
import FoodSuggestion from "./pages/FoodSuggestion";
import FoodDetails from "./pages/FoodDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dietary-restrictions" element={<DietaryRestrictions />} />
          <Route path="/food-parameters" element={<FoodParameters />} />
          <Route path="/food-suggestion" element={<FoodSuggestion />} />
          <Route path="/food-details/:id" element={<FoodDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
