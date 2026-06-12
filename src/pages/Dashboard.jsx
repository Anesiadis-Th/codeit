import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Clock, Flame, Gamepad2, Target, TrendingUp } from "lucide-react";
import { fetchUserProgress } from "../lib/progressService";
import { fetchAllLessons } from "../lib/lessonService";
import { computeLevel } from "../lib/levels";
import { useAuth } from "../hooks/useAuth";
import { useUserStats } from "../hooks/useUserStats";
import { useLang } from "../hooks/useLang";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import Skeleton from "../components/ui/Skeleton";
import cody_coding from "../assets/cody_coding.png";

function StatRow({ icon: Icon, label, children }) {
  return (
    <p className="flex items-center gap-2.5">
      {Icon && <Icon className="size-4.5 shrink-0 text-accent-300" aria-hidden="true" />}
      {label}: <strong>{children}</strong>
    </p>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { stats } = useUserStats();
  const { localize } = useLang();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const [allLessons, userProgress] = await Promise.all([
          fetchAllLessons(),
          fetchUserProgress(),
        ]);

        if (!isMounted) return;

        setLessons(
          allLessons.map((lesson) => ({
            ...lesson,
            title: localize(lesson, "title"),
          }))
        );

        const progressMap = {};
        (userProgress || []).forEach((p) => {
          progressMap[p.lesson_id] = p.completed;
        });
        setProgress(progressMap);
      } catch (err) {
        console.error("Error loading dashboard:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [localize]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const completedLessons = lessons.filter((l) => progress[l.id]);
  const totalXP = stats?.xp ?? 0;
  const { level, xpToNext, percentToNextLevel } = computeLevel(totalXP);
  const completedPercent = lessons.length
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;
  const nextLesson = lessons.find((l) => !progress[l.id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="animate-fade-up my-6 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
        <Gamepad2 className="size-9 shrink-0 text-accent-300" aria-hidden="true" />
        <span className="text-gradient">{t("dashboard.title")}</span>
      </h1>

      <div className="space-y-6">
        <Card animated mascot={cody_coding}>
          <div className="relative z-10 space-y-2.5 leading-relaxed">
            <p>
              {t("dashboard.welcome")}, <strong>{user?.email}</strong>
            </p>
            <StatRow icon={Flame} label={t("dashboard.streak")}>
              {stats ? stats.streak : "—"}
            </StatRow>
            <StatRow icon={Target} label={t("dashboard.level")}>
              {level}
            </StatRow>
            <StatRow icon={TrendingUp} label={t("dashboard.xp")}>
              {totalXP}
            </StatRow>
            <p className="text-sm text-fg-muted">
              {t("dashboard.xpToNext", { xp: xpToNext })}
            </p>
            <ProgressBar
              value={percentToNextLevel}
              label={t("dashboard.xp")}
              className="mt-3"
            />
          </div>
        </Card>

        <Card animated delay={150}>
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t("dashboard.yourLessons")}
          </h2>
          <ul className="space-y-2">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface-800 px-4 py-3 transition hover:bg-surface-700"
              >
                <span className="font-medium">{lesson.title}</span>
                {progress[lesson.id] ? (
                  <Badge variant="success" icon={CheckCircle2}>
                    {t("lessons.completed")}
                  </Badge>
                ) : (
                  <Badge variant="muted" icon={Clock}>
                    {t("lessons.notStarted")}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-fg-muted">
            {completedLessons.length}/{lessons.length} {t("dashboard.completed")} (
            {completedPercent}%)
          </p>
        </Card>

        {nextLesson && (
          <Card animated delay={300}>
            <h2 className="mb-2 text-xl font-semibold text-white">
              {t("dashboard.continueLearning")}
            </h2>
            <p className="mb-4 leading-relaxed">
              {t("dashboard.nextUp")}: <strong>{nextLesson.title}</strong>
            </p>
            <Button onClick={() => navigate(`/lessons/${nextLesson.id}`)}>
              {t("dashboard.goToLesson")}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
