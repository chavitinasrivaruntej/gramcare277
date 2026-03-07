import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import App from "./App";
import DoctorApp from "./DoctorApp";

function RootApp() {
  const [userRole, setUserRole] = useState(null); // "center", "doctor", or null
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user session from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const savedUser = localStorage.getItem("currentUser");
    if (savedRole) {
      setUserRole(savedRole);
      setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
    }
    setIsLoading(false);
  }, []);

  // user object comes from Supabase (health center), or is null (doctor)
  const handleLoginSuccess = (role, user = null) => {
    setUserRole(role);
    setCurrentUser(user);
    localStorage.setItem("userRole", role);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
  };

  if (isLoading) return null;

  if (!userRole) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (userRole === "doctor") {
    return <DoctorApp onLogout={handleLogout} />;
  }

  return <App onLogout={handleLogout} currentUser={currentUser} />;
}

export default RootApp;
