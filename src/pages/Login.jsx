import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import globalStyles from "../styles/globals.module.css";
import googleIcon from "../assets/googleIcon.png";
import githubIcon from "../assets/githubIcon.png";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [resetVisible, setResetVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else navigate("/");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) {
      setResetMessage({ type: "error", text: error.message });
    } else {
      setResetMessage({
        type: "success",
        text: t("login.resetSuccess"),
      });
      setResetEmail("");
    }
  };

  return (
    <div className={globalStyles.container} style={{ maxWidth: "400px" }}>
      <h2 className={globalStyles.title} style={{ textAlign: "center" }}>
        {t("login.title")}
      </h2>

      <div className={globalStyles.cardStatic}>
        <form onSubmit={handleLogin}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            {t("login.email")}
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
            {t("login.password")}
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

          <button
            type="submit"
            className={globalStyles.buttonPrimary}
            style={{ marginTop: "1rem", width: "100%" }}
          >
            {t("login.login")}
          </button>

          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div className={globalStyles.authButtons}>
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
          </div>

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
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          {t("login.noAccount")}{" "}
          <Link
            to="/signup"
            style={{ color: "#97dffc", textDecoration: "underline" }}
          >
            {t("login.signup")}
          </Link>
        </p>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            textAlign: "center",
            cursor: "pointer",
            color: "#97dffc",
            textDecoration: "underline",
          }}
          onClick={() => setResetVisible(!resetVisible)}
        >
          {t("login.forgotPassword")}
        </p>

        {resetVisible && (
          <form onSubmit={handleResetPassword} style={{ marginTop: "1rem" }}>
            <input
              type="email"
              placeholder={t("login.enterEmail")}
              className={globalStyles.questionInput}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className={globalStyles.buttonPrimary}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {t("login.sendReset")}
            </button>

            {resetMessage && (
              <p
                style={{
                  marginTop: "0.75rem",
                  color: resetMessage.type === "error" ? "#ff6666" : "#00cc88",
                  fontWeight: "bold",
                }}
              >
                {resetMessage.type === "error" ? "❌" : "✅"}{" "}
                {resetMessage.text}
              </p>
            )}
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}
