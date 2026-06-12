import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "../components/ui/Card";
import Field from "../components/ui/Field";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import googleIcon from "../assets/googleIcon.png";
import githubIcon from "../assets/githubIcon.png";

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
      setResetMessage({ type: "success", text: t("login.resetSuccess") });
      setResetEmail("");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h2 className="text-gradient animate-fade-up mb-6 text-center text-3xl font-bold">
        {t("login.title")}
      </h2>

      <Card variant="static" animated delay={100}>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Field label={t("login.email")} htmlFor="email">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label={t("login.password")} htmlFor="password">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" fullWidth className="mt-2">
            {t("login.login")}
          </Button>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="oauth-google"
              size="sm"
              className="min-w-35 flex-1"
              onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
            >
              <img src={googleIcon} alt="" aria-hidden="true" className="size-5" />
              Google
            </Button>

            <Button
              variant="oauth-github"
              size="sm"
              className="min-w-35 flex-1"
              onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
            >
              <img src={githubIcon} alt="" aria-hidden="true" className="size-5" />
              GitHub
            </Button>
          </div>

          {error && <Alert variant="error">{error}</Alert>}
        </form>

        <p className="mt-6 text-center text-sm">
          {t("login.noAccount")}{" "}
          <Link to="/signup" className="text-accent-300 underline transition hover:brightness-110">
            {t("login.signup")}
          </Link>
        </p>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setResetVisible((visible) => !visible)}
            className="cursor-pointer text-sm text-accent-300 underline transition hover:brightness-110"
          >
            {t("login.forgotPassword")}
          </button>
        </div>

        {resetVisible && (
          <form onSubmit={handleResetPassword} className="mt-4 flex flex-col gap-3">
            <Input
              type="email"
              placeholder={t("login.enterEmail")}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <Button type="submit" fullWidth>
              {t("login.sendReset")}
            </Button>
            {resetMessage && (
              <Alert variant={resetMessage.type === "error" ? "error" : "success"}>
                {resetMessage.text}
              </Alert>
            )}
          </form>
        )}
      </Card>
    </div>
  );
}
