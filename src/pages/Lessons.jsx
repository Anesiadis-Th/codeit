import { useEffect, useState } from "react";
import { fetchUserProgress } from "../lib/progressService";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import globalStyles from "../styles/globals.module.css";
import Footer from "../components/Footer";
import Book from "../assets/book.png";

const sectionMap = {
  welcome: "👋 Welcome to C!",
  "getting-started": "🚀 Getting Started with C",
  "control-flow": "🔍 Control Flow",
  "loops-c": "🔄 Loops in C",
  "functions-c": "🔧 Functions in C",
  "arrays-c": "📊 Arrays in C",
  "pointers-c": "📌 Pointers in C",
  default: "📘 Other Lessons",
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
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      let progressMap = {};

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && user.app_metadata?.provider !== "anonymous") {
          const userProgress = await fetchUserProgress();
          userProgress.forEach((item) => {
            progressMap[item.lesson_id] = item.completed;
          });
        }
      } catch (err) {
        console.warn("Guest user — skipping progress fetch:", err.message);
      }

      const { data: allLessons, error } = await supabase
        .from("lessons")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error.message);
        return;
      }

      setProgress(progressMap);
      setLessons(allLessons);
      setLoading(false);
    };

    init();
  }, []);

  const grouped = lessons.reduce((acc, lesson) => {
    const section = lesson.section_id || "default";
    if (!acc[section]) acc[section] = [];
    acc[section].push(lesson);
    return acc;
  }, {});

  const orderedSections = sectionOrder
    .filter((sectionId) => grouped[sectionId])
    .map((sectionId) => [sectionId, grouped[sectionId]]);

  const handleLessonNavigation = (lesson) => {
    navigate(`/lessons/${lesson.id}`);
  };

  if (loading) {
    return <div className={globalStyles.spinner}></div>;
  }

  return (
    <div className={globalStyles.container}>
      <h1 className={globalStyles.title}>
        <img src={Book} alt="Book" className={globalStyles.inlineIconLarge} />
        Your Lessons
      </h1>

      {orderedSections.map(([sectionId, sectionLessons]) => (
        <div
          key={sectionId}
          className={`${globalStyles.card} ${globalStyles.cardAnimated}`}
        >
          <h3
            onClick={() =>
              setOpenSection((prev) => (prev === sectionId ? null : sectionId))
            }
            className={`${globalStyles.accordionHeader} ${
              openSection === sectionId ? globalStyles.open : ""
            }`}
          >
            <span>{sectionMap[sectionId] || sectionId}</span>
            <span className={globalStyles.accordionIcon}>▶</span>
          </h3>

          <div
            className={`${globalStyles.accordionContent} ${
              openSection === sectionId
                ? globalStyles.open
                : globalStyles.closed
            }`}
          >
            {sectionLessons.map((lesson) => {
              const hasProgress = progress[lesson.id] !== undefined;
              const isCompleted = progress[lesson.id] === true;

              return (
                <div key={lesson.id} className={globalStyles.lessonItem}>
                  <h4 className={globalStyles.lessonTitle}>{lesson.title}</h4>

                  <p className={globalStyles.lessonStatus}>
                    {hasProgress
                      ? isCompleted
                        ? "✅ Completed"
                        : "🕐 In Progress"
                      : " Uncompleted"}
                  </p>

                  <button
                    className={globalStyles.buttonPrimary}
                    onClick={() => handleLessonNavigation(lesson)}
                  >
                    {hasProgress && isCompleted
                      ? "Review Lesson"
                      : "Start Lesson"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Footer />
    </div>
  );
}
