import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import globalStyles from "../styles/globals.module.css";
import Footer from "../components/Footer";
import googleIcon from "../assets/googleIcon.png";
import githubIcon from "../assets/githubIcon.png";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setSuccess(false);
    } else {
      setSuccess(true);
      // No redirect anymore
    }
  };

  return (
    <div className={globalStyles.container} style={{ maxWidth: "400px" }}>
      <h2 className={globalStyles.title} style={{ textAlign: "center" }}>
        Create Your Account
      </h2>

      <div className={globalStyles.cardStatic}>
        <form onSubmit={handleSignup}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className={globalStyles.questionInput}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className={globalStyles.questionInput}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label
            htmlFor="confirm"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            className={globalStyles.questionInput}
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={globalStyles.buttonPrimary}
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Sign Up
          </button>

          {error && (
            <p
              style={{
                color: "#ff6666",
                marginTop: "1rem",
                fontWeight: "bold",
              }}
            >
              ❌ {error}
            </p>
          )}

          {success && (
            <div
              style={{
                backgroundColor: "#e0ffe0",
                color: "#003300",
                padding: "1rem",
                borderRadius: "8px",
                marginTop: "1rem",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              ✅ Signup successful!
              <br />
              Please check your email to confirm your account.
              <br />
              Once confirmed, you can log in and start learning!
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <Link to="/login">
                  <button className={globalStyles.buttonPrimary}>
                    Go to Login
                  </button>
                </Link>
              </div>
            </div>
          )}
        </form>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() =>
              supabase.auth.signInWithOAuth({ provider: "google" })
            }
            className={`${globalStyles.buttonOAuth} ${globalStyles.buttonOAuthGoogle}`}
          >
            <img
              src={googleIcon}
              alt="Google"
              style={{ width: "20px", height: "20px" }}
            />
            Google
          </button>

          <button
            type="button"
            onClick={() =>
              supabase.auth.signInWithOAuth({ provider: "github" })
            }
            className={`${globalStyles.buttonOAuth} ${globalStyles.buttonOAuthGitHub}`}
          >
            <img
              src={githubIcon}
              alt="GitHub"
              style={{ width: "20px", height: "20px" }}
            />
            GitHub
          </button>
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#97dffc", textDecoration: "underline" }}
          >
            Log in
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
