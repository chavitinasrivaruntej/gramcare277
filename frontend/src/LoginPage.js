import { useState, useEffect } from "react";
import { Building2, Stethoscope, AlertCircle, Loader2 } from "lucide-react";
import { loginHealthCenter } from "./lib/auth";

function LoginPage({ onLoginSuccess }) {
  const [selectedSide, setSelectedSide] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Health Center form state
  const [centerId, setCenterId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Doctor form state (unchanged — wire to Supabase later if needed)
  const [doctorId, setDoctorId] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

  useEffect(() => {
    document.title = "GramCare";
  }, []);

  const handleSideClick = (side) => {
    setSelectedSide(side);
    setError("");
    setTimeout(() => setShowForm(true), 800);
  };

  const handleBack = () => {
    setShowForm(false);
    setError("");
    setCenterId("");
    setPin("");
    setDoctorId("");
    setDoctorPassword("");
    setTimeout(() => setSelectedSide(null), 300);
  };

  // ── Health Center login — validates against Supabase ──────────
  const handleCenterLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { success, user, error: authError } = await loginHealthCenter(centerId, pin);

    setLoading(false);

    if (!success) {
      setError(authError || "Login failed. Please try again.");
      return;
    }

    // Pass role + user info to parent
    onLoginSuccess("center", user);
  };

  // ── Doctor login — keeping existing flow (extend later) ───────
  const handleDoctorLogin = (e) => {
    e.preventDefault();
    onLoginSuccess("doctor");
  };

  return (
    <div className="App">
      <div className="split-container">
        {/* ── Health Center Side ── */}
        <div
          data-testid="health-center-side"
          className={`split-side health-center ${selectedSide === "center" ? "expanded" : ""
            } ${selectedSide && selectedSide !== "center" ? "collapsed" : ""}`}
          onClick={() => !selectedSide && handleSideClick("center")}
        >
          {!selectedSide && (
            <div className="side-content" data-testid="health-center-content">
              <Building2 size={120} strokeWidth={1.5} />
              <h2 className="side-title">Health Center</h2>
              <button data-testid="register-vitals-btn" className="action-btn">
                Register &amp; Vitals
              </button>
            </div>
          )}

          {selectedSide === "center" && showForm && (
            <div className="login-form-container fade-in">
              <div className="logo-section">
                <img
                  src="https://customer-assets.emergentagent.com/job_4243ba49-ccb4-4dfd-99e8-10b7c9fa86fb/artifacts/e6izvxsc_image-removebg-preview%20%2823%29.png"
                  alt="GramCare Logo"
                  className="center-logo"
                />
              </div>
              <form data-testid="health-center-login-form" onSubmit={handleCenterLogin}>
                <h2 className="form-title">Health Center Login</h2>

                {/* Error message */}
                {error && (
                  <div className="login-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="center-id">Center ID</label>
                  <input
                    data-testid="center-id-input"
                    id="center-id"
                    type="text"
                    placeholder="e.g. HC001"
                    value={centerId}
                    onChange={(e) => setCenterId(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="center-pin">PIN</label>
                  <input
                    data-testid="center-pin-input"
                    id="center-pin"
                    type="password"
                    placeholder="Enter your PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  data-testid="center-enter-btn"
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                      <Loader2 size={16} className="spin" /> Verifying…
                    </span>
                  ) : (
                    "Enter"
                  )}
                </button>
                <button
                  data-testid="center-back-btn"
                  type="button"
                  className="back-btn"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Back
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── Doctor Side ── */}
        <div
          data-testid="doctor-side"
          className={`split-side doctor ${selectedSide === "doctor" ? "expanded" : ""
            } ${selectedSide && selectedSide !== "doctor" ? "collapsed" : ""}`}
          onClick={() => !selectedSide && handleSideClick("doctor")}
        >
          {!selectedSide && (
            <div className="side-content" data-testid="doctor-content">
              <Stethoscope size={120} strokeWidth={1.5} />
              <h2 className="side-title">Doctor</h2>
              <button data-testid="start-consultations-btn" className="action-btn">
                Start Consultations
              </button>
            </div>
          )}

          {selectedSide === "doctor" && showForm && (
            <div className="login-form-container fade-in">
              <div className="logo-section">
                <img
                  src="https://customer-assets.emergentagent.com/job_4243ba49-ccb4-4dfd-99e8-10b7c9fa86fb/artifacts/e6izvxsc_image-removebg-preview%20%2823%29.png"
                  alt="GramCare Logo"
                  className="center-logo"
                />
              </div>
              <form data-testid="doctor-login-form" onSubmit={handleDoctorLogin}>
                <h2 className="form-title">Doctor Login</h2>
                <div className="input-group">
                  <label htmlFor="doctor-id">Doctor ID</label>
                  <input
                    data-testid="doctor-id-input"
                    id="doctor-id"
                    type="text"
                    placeholder="Enter your Doctor ID"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="doctor-password">Password</label>
                  <input
                    data-testid="doctor-password-input"
                    id="doctor-password"
                    type="password"
                    placeholder="Enter your Password"
                    value={doctorPassword}
                    onChange={(e) => setDoctorPassword(e.target.value)}
                    required
                  />
                </div>
                <button data-testid="doctor-login-btn" type="submit" className="submit-btn">
                  Login
                </button>
                <button
                  data-testid="doctor-back-btn"
                  type="button"
                  className="back-btn"
                  onClick={handleBack}
                >
                  Back
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Central Logo */}
        <div
          className={`central-logo ${selectedSide === "center" ? "move-right" : ""} ${selectedSide === "doctor" ? "move-left" : ""
            }`}
          data-testid="central-logo"
        >
          <img
            src="https://customer-assets.emergentagent.com/job_4243ba49-ccb4-4dfd-99e8-10b7c9fa86fb/artifacts/e6izvxsc_image-removebg-preview%20%2823%29.png"
            alt="GramCare Logo"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
