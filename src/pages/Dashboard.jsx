import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getUserStats } from "../lib/statsService";
import { fetchUserProgress } from "../lib/progressService";
import { fetchAllLessons } from "../lib/lessonService";
import { useNavigate } from "react-router-dom";
import styles from "../styles/globals.module.css";
import Footer from "../components/Footer";
import Controller from "../assets/controller.png";

export default function Dashboard() {
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
        const allLessons = await fetchAllLessons();
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
  }, []);

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
        Your Dashboard
      </h1>

      <div className={`${styles.card} ${styles.cardAnimated}`}>
        <p>
          👋 Welcome, <strong>{user.email}</strong>
        </p>
        <p>
          🔥 Streak: <strong>{stats.streak} day(s)</strong>
        </p>
        <p>
          🎯 Level: <strong>{level}</strong>
        </p>
        <p>
          📈 XP: <strong>{totalXP}</strong> (Need {xpToNext} XP to level up)
        </p>

        <div className={styles.progressBar}>
          <div
            className={`${styles.progress} ${styles.progressDynamic}`}
            style={{ width: `${percentToNextLevel}%` }}
          />
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardAnimated}`}>
        <h2>Your Lessons</h2>
        <ul className={styles.lessonList}>
          {lessons.map((lesson) => (
            <li key={lesson.id} className={styles.lessonItem}>
              <span>{lesson.title}</span>
              <span>{progress[lesson.id] ? "✅" : "🕐"}</span>
            </li>
          ))}
        </ul>
        <p>
          ✅ {completedLessons.length}/{lessons.length} completed (
          {Math.round((completedLessons.length / lessons.length) * 100)}%)
        </p>
      </div>

      {nextLesson && (
        <div className={`${styles.card} ${styles.cardAnimated}`}>
          <h2>▶️ Continue Learning</h2>
          <p>
            Next up: <strong>{nextLesson.title}</strong>
          </p>
          <button
            className={styles.buttonPrimary}
            onClick={() => navigate(`/lessons/${nextLesson.id}`)}
          >
            Go to Lesson
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}
