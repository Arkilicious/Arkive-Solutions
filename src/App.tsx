
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import BrowseQuestionsPage from "./pages/BrowseQuestionsPage";
import CoursePage from "./pages/CoursePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ChatRoomsPage from "./pages/ChatRoomsPage";
import StudyBuddiesPage from "./pages/StudyBuddiesPage";
import CBTPage from "./pages/CBTPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/browse" element={<BrowseQuestionsPage />} />
                <Route path="/course/:courseId" element={<CoursePage />} />
                <Route path="/subscribe" element={<SubscriptionPage />} />
                <Route path="/chat" element={<ChatRoomsPage />} />
                <Route path="/study-buddies" element={<StudyBuddiesPage />} />
                <Route path="/cbt" element={<CBTPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
