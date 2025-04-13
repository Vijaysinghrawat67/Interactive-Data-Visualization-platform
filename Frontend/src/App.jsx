import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Layout Components
import Layout from "@/components/layout/Layout";

// Pages
const LandingPage = React.lazy(() => import("@/pages/LandingPage.jsx"));
const LoginPage = React.lazy(() => import("@/pages/Login.jsx"));
const RegisterPage = React.lazy(() => import("@/pages/Register.jsx"));

function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
