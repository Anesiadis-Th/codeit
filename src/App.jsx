import { supabase } from "./lib/supabaseClient";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Lessons from "./pages/Lessons";
import LessonScreen from "./pages/LessonScreen";
import Header from "./components/Header";
import { useEffect } from "react";
import { initUserStats } from "./lib/statsService";
import Practice from "./pages/Practice";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  // Check if user is logged in and initialize stats if necessary
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If no session, sign in as guest
      if (!session) {
        await supabase.auth.signInAnonymously();
      } else {
        await initUserStats();
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          initUserStats();
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/lessons/:lessonId" element={<LessonScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
