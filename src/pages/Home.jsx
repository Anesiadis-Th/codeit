import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { useTranslation } from "react-i18next";
import { Brain, Cpu, Rocket, Star } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import mascot from "../assets/mascot.png";

function CardTitle({ icon: Icon, children }) {
  return (
    <h2 className="mb-3 flex items-center gap-2.5 text-xl font-semibold text-white">
      {Icon && <Icon className="size-5 shrink-0 text-accent-300" aria-hidden="true" />}
      {children}
    </h2>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8">
      <section className="relative px-4 py-14 text-center sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-150 max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#613dc1_0%,transparent_70%)] opacity-15"
        />

        <h1 className="text-gradient animate-fade-up text-4xl font-bold sm:text-5xl">
          CodeIT: {t("home.learnC")}
        </h1>

        <p
          className="animate-fade-up mt-5 text-lg text-fg-muted"
          style={{ animationDelay: "150ms" }}
        >
          <Typewriter
            words={[
              t("home.typewriter1"),
              t("home.typewriter2"),
              t("home.typewriter3"),
            ]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </p>

        <img
          src={mascot}
          alt="CodeIT Mascot"
          className="animate-float mx-auto mt-8 w-24 drop-shadow-[0_0_8px_#613dc1]"
        />

        <div className="mt-8">
          <Button icon={Rocket} onClick={() => navigate("/lessons")}>
            {t("home.startLearning")}
          </Button>
        </div>
      </section>

      <div className="space-y-6">
        <Card animated delay={150}>
          <CardTitle icon={Cpu}>{t("home.whatIsTitle")}</CardTitle>
          <p className="leading-relaxed text-fg-muted">{t("home.whatIsText")}</p>
        </Card>

        <Card animated delay={300}>
          <CardTitle icon={Brain}>{t("home.featuresTitle")}</CardTitle>
          <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-fg-muted">
            <li>{t("home.feature1")}</li>
            <li>{t("home.feature2")}</li>
            <li>{t("home.feature3")}</li>
            <li>{t("home.feature4")}</li>
          </ul>
        </Card>

        <Card animated delay={450}>
          <CardTitle icon={Star}>{t("home.progressTitle")}</CardTitle>
          <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-fg-muted">
            <li>{t("home.progress1")}</li>
            <li>{t("home.progress2")}</li>
            <li>{t("home.progress3")}</li>
            <li>{t("home.progress4")}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
