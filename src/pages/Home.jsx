import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Terminal } from "lucide-react";
import Button from "../components/ui/Button";
import { Underlined } from "../components/ui/PageHeading";
import cody_coding from "../assets/cody_coding.png";

const transcript = [
  { text: "$ cat hello.c", tone: "text-hint" },
  {
    code: [
      ["#include", "text-streak"],
      [" <stdio.h>", "text-success-300/70"],
    ],
  },
  { spacer: true },
  {
    code: [
      ["int", "text-brand-300"],
      [" main", "text-fg"],
      ["(", "text-fg-muted"],
      ["void", "text-brand-300"],
      [") {", "text-fg-muted"],
    ],
  },
  {
    indent: 1,
    code: [
      ["printf", "text-fg"],
      ["(", "text-fg-muted"],
      ['"Hello, C!\\n"', "text-success-300/70"],
      [");", "text-fg-muted"],
    ],
  },
  {
    indent: 1,
    code: [
      ["return", "text-brand-300"],
      [" 0", "text-streak"],
      [";", "text-fg-muted"],
    ],
  },
  { code: [["}", "text-fg-muted"]] },
  { spacer: true },
  { text: "$ gcc hello.c -o hello && ./hello", tone: "text-hint" },
  { text: "Hello, C!", tone: "text-success-300 font-medium" },
];

function Transcript() {
  return (
    <div className="overflow-x-auto rounded-md border border-border-soft bg-ink-900 p-5 font-mono text-[13px] leading-[1.7] sm:text-sm">
      {transcript.map((line, i) => {
        const delay = { animationDelay: `${180 + i * 90}ms` };

        if (line.spacer) {
          return <div key={i} className="h-4" aria-hidden="true" />;
        }

        return (
          <div
            key={i}
            style={delay}
            className={`animate-print whitespace-pre ${line.indent ? "pl-6" : ""} ${
              line.tone || ""
            }`}
          >
            {line.text ??
              line.code.map(([chunk, tone], j) => (
                <span key={j} className={tone}>
                  {chunk}
                </span>
              ))}
          </div>
        );
      })}
    </div>
  );
}

/* Labels are the same i18n keys the Lessons page uses, so the two stay
   in sync. Order matches the curriculum and the numbering depends on it. */
const path = [
  { key: "lessons.sectionWelcome", token: "main()" },
  { key: "lessons.sectionGettingStarted", token: "int x = 5;" },
  { key: "lessons.sectionControlFlow", token: "if / else" },
  { key: "lessons.sectionLoops", token: "for (;;)" },
  { key: "lessons.sectionFunctions", token: "int add(a, b)" },
  { key: "lessons.sectionArrays", token: "arr[i]" },
  { key: "lessons.sectionPointers", token: "int *p = &x;" },
];

function Path() {
  const { t } = useTranslation();

  return (
    <ol className="border-t border-border-soft">
      {path.map((step, i) => (
        <li
          key={step.key}
          className="flex items-baseline gap-4 border-b border-border-soft py-4 sm:gap-6"
        >
          <span className="locus w-6 shrink-0 tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="display flex-1 text-lg text-fg sm:text-xl">
            {t(step.key)}
          </span>
          <code className="font-mono text-xs text-brand-300 sm:text-sm">
            {step.token}
          </code>
        </li>
      ))}
    </ol>
  );
}

function Specimen({ label, children }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="label">{label}</p>
      <div className="flex-1 rounded-md border border-border-soft bg-surface-900 p-4">
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-1 sm:px-6">
      <section className="grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-16">
        <div>
          <p className="locus mb-4">
            hello.c:1:1: <span className="text-accent-300">note:</span>{" "}
            <span className="label text-fg-muted">{t("home.locus")}</span>
          </p>

          <h1 className="display pb-[0.42em] text-[2.6rem] text-fg sm:text-6xl">
            {t("home.heroLead")}{" "}
            <Underlined>
              <span className="text-accent-300">{t("home.heroEmphasis")}</span>
            </Underlined>
          </h1>

          <p className="mt-5 max-w-md leading-relaxed text-fg-muted">
            {t("home.heroSubtitle")}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Button icon={ArrowRight} onClick={() => navigate("/lessons")}>
              {t("home.ctaPrimary")}
            </Button>
            <Button
              variant="secondary"
              icon={Terminal}
              onClick={() => navigate("/practice")}
            >
              {t("home.ctaSecondary")}
            </Button>
          </div>
        </div>

        <Transcript />
      </section>

      <section className="py-10 sm:py-12">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="display text-2xl text-fg sm:text-3xl">
            {t("home.pathTitle")}
          </h2>
          <p className="label hidden sm:block">{t("home.pathNote")}</p>
        </div>
        <Path />
      </section>

      <section className="py-10 sm:py-12">
        <h2 className="display mb-8 text-2xl text-fg sm:text-3xl">
          {t("home.stepsTitle")}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Specimen label={t("home.typeChoice")}>
            <p className="mb-3 text-sm leading-relaxed text-fg">
              {t("home.choiceQuestion")}
            </p>
            <ul className="space-y-1.5 font-mono text-xs">
              <li className="rounded-sm border border-border-soft px-2.5 py-1.5 text-fg-muted">
                char
              </li>
              <li className="rounded-sm border border-success-300/50 bg-success-300/10 px-2.5 py-1.5 text-success-300">
                int
              </li>
              <li className="rounded-sm border border-border-soft px-2.5 py-1.5 text-fg-muted">
                float
              </li>
            </ul>
          </Specimen>

          <Specimen label={t("home.typeBlank")}>
            <p className="mb-3 text-sm leading-relaxed text-fg">
              {t("home.blankQuestion")}
            </p>
            <div className="rounded-sm bg-ink-900 p-3 font-mono text-xs leading-relaxed">
              <span className="text-fg">printf</span>
              <span className="text-fg-muted">(</span>
              <span className="text-success-300/70">&quot;%d&quot;</span>
              <span className="text-fg-muted">, </span>
              <span className="border-b-2 border-streak px-3 text-streak" />
              <span className="text-fg-muted">);</span>
            </div>
          </Specimen>

          <Specimen label={t("home.typeCode")}>
            <p className="mb-3 text-sm leading-relaxed text-fg">
              {t("home.codeQuestion")}
            </p>
            <div className="rounded-sm bg-ink-900 p-3 font-mono text-xs leading-relaxed">
              <div className="text-hint">$ ./a.out</div>
              <div className="text-success-300">1 2 3 4 5</div>
            </div>
          </Specimen>
        </div>
      </section>

      <section className="mt-4 flex flex-col items-center gap-8 border-t border-border-soft pt-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <img
            src={cody_coding}
            alt=""
            aria-hidden="true"
            className="w-20 shrink-0 select-none"
          />
          <div>
            <h2 className="display text-2xl text-fg">{t("home.closeTitle")}</h2>
            <p className="mt-1.5 text-sm text-fg-muted">
              {t("home.closeText")}
            </p>
          </div>
        </div>

        <Button icon={ArrowRight} onClick={() => navigate("/lessons")}>
          {t("home.ctaPrimary")}
        </Button>
      </section>
    </div>
  );
}
