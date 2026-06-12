import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  GitBranch,
  GraduationCap,
  Hand,
  Pin,
  Repeat,
  Rocket,
  Wrench,
} from "lucide-react";
import { fetchUserProgress } from "../lib/progressService";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { useLang } from "../hooks/useLang";
import Accordion from "../components/ui/Accordion";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import cody_hello from "../assets/cody_hello.png";
import cody_wonder from "../assets/cody_wonder.png";

const sectionIcons = {
  welcome: Hand,
  "getting-started": Rocket,
  "control-flow": GitBranch,
  "loops-c": Repeat,
  "functions-c": Wrench,
  "arrays-c": BarChart3,
  "pointers-c": Pin,
  default: BookOpen,
};

const sectionOrder = [
  "welcome",
  "getting-started",
  "control-flow",
  "loops-c",
  "functions-c",
  "arrays-c",
  "pointers-c",
  "default",
];

export default function Lessons() {
  const { t } = useTranslation();
  const { isGuest } = useAuth();
  const { localize } = useLang();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const [openSection, setOpenSection] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const sectionLabels = {
    welcome: t("lessons.sectionWelcome"),
    "getting-started": t("lessons.sectionGettingStarted"),
    "control-flow": t("lessons.sectionControlFlow"),
    "loops-c": t("lessons.sectionLoops"),
    "functions-c": t("lessons.sectionFunctions"),
    "arrays-c": t("lessons.sectionArrays"),
    "pointers-c": t("lessons.sectionPointers"),
    default: t("lessons.sectionOther"),
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);
      setError(false);

      const progressMap = {};
      if (!isGuest) {
        try {
          const userProgress = await fetchUserProgress();
          userProgress.forEach((item) => {
            progressMap[item.lesson_id] = item.completed;
          });
        } catch (err) {
          console.warn("Skipping progress fetch:", err.message);
        }
      }

      const { data: allLessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("id, section_id, title_en, title_gr")
        .order("order", { ascending: true });

      if (!isMounted) return;

      if (lessonsError) {
        console.error("Error fetching lessons:", lessonsError.message);
        setError(true);
        setLoading(false);
        return;
      }

      setProgress(progressMap);
      setLessons(
        allLessons.map((lesson) => ({
          ...lesson,
          title: localize(lesson, "title"),
        }))
      );
      setLoading(false);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [isGuest, localize, reloadKey]);

  const grouped = lessons.reduce((acc, lesson) => {
    const section = lesson.section_id || "default";
    if (!acc[section]) acc[section] = [];
    acc[section].push(lesson);
    return acc;
  }, {});

  const orderedSections = sectionOrder
    .filter((sectionId) => grouped[sectionId])
    .map((sectionId) => [sectionId, grouped[sectionId]]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="animate-fade-up my-6 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
        <GraduationCap className="size-9 shrink-0 text-accent-300" aria-hidden="true" />
        <span className="text-gradient">{t("lessons.pageTitle")}</span>
      </h1>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {!loading && error && (
        <EmptyState
          image={cody_wonder}
          title={t("lessons.loadError")}
          description={t("common.error")}
          action={
            <Button onClick={() => setReloadKey((key) => key + 1)}>
              {t("common.retry")}
            </Button>
          }
        />
      )}

      {!loading && !error && (
        <div className="mt-12 space-y-4">
          {orderedSections.map(([sectionId, sectionLessons], index) => (
            <div key={sectionId} className="relative">
              {index === 0 && (
                <img
                  src={cody_hello}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-12 right-4 w-16 select-none sm:-top-16 sm:w-22"
                />
              )}

              <div className="animate-fade-up relative">
                <Accordion
                  open={openSection === sectionId}
                  onToggle={() =>
                    setOpenSection((prev) => (prev === sectionId ? null : sectionId))
                  }
                  title={sectionLabels[sectionId] || sectionId}
                  icon={sectionIcons[sectionId] || BookOpen}
                >
                  <ul className="space-y-2 pt-3 pb-1">
                    {sectionLessons.map((lesson) => {
                      const hasProgress = progress[lesson.id] !== undefined;
                      const isCompleted = progress[lesson.id] === true;

                      return (
                        <li
                          key={lesson.id}
                          className="flex flex-col gap-3 rounded-xl bg-surface-800 p-4 transition hover:bg-surface-700 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <h4 className="font-semibold">{lesson.title}</h4>
                            <div className="mt-1.5">
                              {hasProgress ? (
                                isCompleted ? (
                                  <Badge variant="success" icon={CheckCircle2}>
                                    {t("lessons.completed")}
                                  </Badge>
                                ) : (
                                  <Badge variant="pending" icon={Clock}>
                                    {t("lessons.inProgress")}
                                  </Badge>
                                )
                              ) : (
                                <Badge variant="muted">
                                  {t("lessons.notStarted")}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => navigate(`/lessons/${lesson.id}`)}
                            className="w-full sm:w-auto"
                          >
                            {hasProgress && isCompleted
                              ? t("lessons.review")
                              : t("lessons.start")}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
