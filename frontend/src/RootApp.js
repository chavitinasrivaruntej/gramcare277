import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import App from "./App";
import DoctorApp from "./DoctorApp";

function RootApp() {
  const [userRole, setUserRole] = useState(null); // "center", "doctor", or null
  const [isLoading, setIsLoading] = useState(true);

  // Restore user role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setUserRole(savedRole);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    // Store in localStorage for persistence
    localStorage.setItem("userRole", role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem("userRole");
  };

  // Show loading state briefly
  if (isLoading) {
    return null; // or a loading spinner
  }

  // Show login if no user role
  if (!userRole) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show appropriate portal based on role
  if (userRole === "doctor") {
    return <DoctorApp onLogout={handleLogout} />;
  }

  return <App onLogout={handleLogout} />;
}

export default RootApp;
