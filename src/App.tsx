
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DietPlan from "./pages/DietPlan";
import CreateDietPlan from "./pages/CreateDietPlan";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Fees from "./pages/Fees";
import NewFee from "./pages/NewFee";
import MemberRegistration from "./components/MemberRegistration";
import TrainerRegistration from "./components/TrainerRegistration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/diet-plan" element={<DietPlan />} />
                <Route path="/create-diet-plan/:memberId" element={<CreateDietPlan />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/fees" element={<Fees />} />
                <Route path="/new-fee" element={<NewFee />} />
                <Route path="/new-member" element={<MemberRegistration />} />
                <Route path="/register-trainer" element={<TrainerRegistration />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
