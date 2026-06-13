import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Cpu,
  Flame,
  Globe,
  Rocket,
  Sparkles,
  Terminal,
  Trophy,
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";

function CodeWindow() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-fg-muted">hello.c</span>
      </div>

      <div className="space-y-1 overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <div>
          <span className="text-streak">#include</span>{" "}
          <span className="text-success-300">{"<stdio.h>"}</span>
        </div>
        <div>&nbsp;</div>
        <div>
          <span className="text-brand-300">int</span>{" "}
          <span className="text-accent-300">main</span>
          <span className="text-fg-muted">(</span>
          <span className="text-brand-300">void</span>
          <span className="text-fg-muted">) {"{"}</span>
        </div>
        <div className="pl-4">
          <span className="text-accent-300">printf</span>
          <span className="text-fg-muted">(</span>
          <span className="text-success-300">{'"Hello, C!\\n"'}</span>
          <span className="text-fg-muted">);</span>
        </div>
        <div className="pl-4">
          <span className="text-brand-300">return</span>{" "}
          <span className="text-streak">0</span>
          <span className="text-fg-muted">;</span>
        </div>
        <div>
          <span className="text-fg-muted">{"}"}</span>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/30 px-4 py-3 font-mono text-xs leading-relaxed">
        <div className="text-fg-muted">$ gcc hello.c &amp;&amp; ./a.out</div>
        <div className="text-success-300">Hello, C!</div>
      </div>
    </div>
  );
}

function Tile({ icon: Icon, title, className = "", delay = 0, children }) {
  return (
    <div
      className={`animate-fade-up group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-900 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/10 ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-brand-500/15 text-accent-300">
        {Icon && <Icon className="size-5" aria-hidden="true" />}
      </div>
      <h3 className="mb-1.5 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-fg-muted">{children}</p>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto max-w-5xl px-4 pb-16">
      {/* Hero */}
      <section className="relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 -z-10 size-96 rounded-full bg-brand-500/25 blur-3xl"
        />

        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-fg-muted">
            <Sparkles className="size-3.5 text-accent-300" aria-hidden="true" />
            {t("home.badge")}
          </span>

          <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl">
            {t("home.heroTitle")}
          </h1>

          <p className="mt-4 max-w-md text-lg leading-relaxed text-fg-muted">
            {t("home.heroSubtitle")}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button icon={Rocket} onClick={() => navigate("/lessons")}>
              {t("home.ctaPrimary")}
            </Button>
            <Button variant="secondary" icon={Terminal} onClick={() => navigate("/practice")}>
              {t("home.ctaSecondary")}
            </Button>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
          <CodeWindow />
        </div>
      </section>

      {/* Bento features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile
          icon={Cpu}
          title={t("home.tile1Title")}
          className="sm:col-span-2"
          delay={0}
        >
          {t("home.tile1Text")}
          <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-xs leading-relaxed">
            <div className="text-fg-muted">$ gcc main.c &amp;&amp; ./a.out</div>
            <div className="text-success-300">Sum = 42</div>
          </div>
        </Tile>

        <Tile
          icon={Trophy}
          title={t("home.tile2Title")}
          className="lg:row-span-2"
          delay={80}
        >
          {t("home.tile2Text")}
          <div className="mt-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="streak" icon={Flame}>
                5
              </Badge>
              <Badge variant="pending">Lv 4</Badge>
              <Badge variant="muted">120 XP</Badge>
            </div>
            <ProgressBar value={70} label="XP progress" />
          </div>
        </Tile>

        <Tile icon={BookOpen} title={t("home.tile3Title")} delay={160}>
          {t("home.tile3Text")}
        </Tile>

        <Tile icon={Globe} title={t("home.tile4Title")} delay={240}>
          {t("home.tile4Text")}
        </Tile>
      </section>
    </div>
  );
}
