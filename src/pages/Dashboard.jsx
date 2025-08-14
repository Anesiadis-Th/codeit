import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getUserStats } from "../lib/statsService";
import { fetchUserProgress } from "../lib/progressService";
import { fetchAllLessons } from "../lib/lessonService";
import { useNavigate } from "react-router-dom";
import styles from "../styles/globals.module.css";
import Footer from "../components/Footer";
import Controller from "../assets/controller.png";
import tickIcon from "../assets/tick.png";
import clockIcon from "../assets/clock.png";
import cody_coding from "../assets/cody_coding.png";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const userStats = await getUserStats();
        const allLessonsRaw = await fetchAllLessons();

        const raw = (i18n.language || "en").toLowerCase();
        const lang = raw.startsWith("gr") || raw.startsWith("el") ? "gr" : "en";

        const allLessons = allLessonsRaw.map((lesson) => ({
          ...lesson,
          title:
            lang === "gr"
              ? lesson.title_gr || lesson.title_en
              : lesson.title_en || lesson.title_gr,
        }));

        const userProgress = await fetchUserProgress();
        const progressMap = {};
        userProgress.forEach((p) => {
          progressMap[p.lesson_id] = p.completed;
        });

        setStats(userStats);
        setLessons(allLessons);
        setProgress(progressMap);
      }
    };

    init();
  }, [i18n.language]);

  if (!user || !stats) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const completedLessons = lessons.filter((l) => progress[l.id]);
  const totalXP = stats.xp;

  const getXPForLevel = (lvl) => 20 + (lvl - 1) * 30;

  let level = 1;
  let remainingXP = totalXP;
  let xpNeeded = getXPForLevel(level);

  while (remainingXP >= xpNeeded) {
    remainingXP -= xpNeeded;
    level += 1;
    xpNeeded = getXPForLevel(level);
  }

  const xpToNext = xpNeeded - remainingXP;
  const percentToNextLevel = ((xpNeeded - xpToNext) / xpNeeded) * 100;
  const nextLesson = lessons.find((l) => !progress[l.id]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <img
          src={Controller}
          alt="Controller"
          className={styles.inlineIconLarge}
        />
        {t("dashboard.title")}
      </h1>

      <div
        className={`${styles.card} ${styles.cardAnimated}`}
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Faded mascot */}
        <img src={cody_coding} alt="Mascot" className={styles.cardMascot} />

        <p>
          👋 {t("dashboard.welcome")}, <strong>{user.email}</strong>
        </p>
        <p>
          🔥 Streak:{" "}
          <strong>
            {stats.streak} {t("dashboard.days")}
          </strong>
        </p>
        <p>
          🎯 {t("dashboard.level")}: <strong>{level}</strong>
        </p>
        <p>
          📈 {t("dashboard.xp")}: <strong>{totalXP}</strong> (
          {t("dashboard.xpToNext", { xp: xpToNext })})
        </p>

        <div className={styles.progressBar}>
          <div
            className={`${styles.progress} ${styles.progressDynamic}`}
            style={{ width: `${percentToNextLevel}%` }}
          />
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardAnimated}`}>
        <h2>{t("dashboard.yourLessons")}</h2>
        <ul className={styles.lessonList}>
          {lessons.map((lesson) => (
            <li key={lesson.id} className={styles.lessonItem}>
              <span>{lesson.title}</span>
              <span>
                {progress[lesson.id] ? (
                  <img
                    src={tickIcon}
                    alt="Completed"
                    className={styles.statusIcon}
                  />
                ) : (
                  <img
                    src={clockIcon}
                    alt="Completed"
                    className={styles.statusIcon}
                  />
                )}
              </span>
            </li>
          ))}
        </ul>
        <p>
          ✅ {completedLessons.length}/{lessons.length}{" "}
          {t("dashboard.completed")} (
          {Math.round((completedLessons.length / lessons.length) * 100)}%)
        </p>
      </div>

      {nextLesson && (
        <div className={`${styles.card} ${styles.cardAnimated}`}>
          <h2>▶️ {t("dashboard.continueLearning")}</h2>
          <p>
            {t("dashboard.nextUp")}: <strong>{nextLesson.title}</strong>
          </p>
          <button
            className={styles.buttonPrimary}
            onClick={() => navigate(`/lessons/${nextLesson.id}`)}
          >
            {t("dashboard.goToLesson")}
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}
