import React from "react";
import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet /> {/* This will render the current page */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
