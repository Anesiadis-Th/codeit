import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "../components/ui/Card";
import Field from "../components/ui/Field";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import googleIcon from "../assets/googleIcon.png";
import githubIcon from "../assets/githubIcon.png";

export default function Signup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("signup.passwordsDontMatch"));
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setSuccess(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h2 className="text-gradient animate-fade-up mb-6 text-center text-3xl font-bold">
        {t("signup.title")}
      </h2>

      <Card variant="static" animated delay={100}>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <Field label={t("signup.email")} htmlFor="email">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label={t("signup.password")} htmlFor="password">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Field label={t("signup.confirmPassword")} htmlFor="confirm">
            <Input
              id="confirm"
              type="password"
              placeholder={t("signup.confirmPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" fullWidth className="mt-2">
            {t("signup.submit")}
          </Button>

          {error && <Alert variant="error">{error}</Alert>}

          {success && (
            <Alert variant="success">
              {t("signup.success")}
              <div className="mt-3">
                <Link to="/login">
                  <Button size="sm">{t("signup.goToLogin")}</Button>
                </Link>
              </div>
            </Alert>
          )}
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
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

        <p className="mt-6 text-center text-sm">
          {t("signup.haveAccount")}{" "}
          <Link to="/login" className="text-accent-300 underline transition hover:brightness-110">
            {t("signup.login")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
