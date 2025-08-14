import { useEffect, useState } from "react";
import { fetchUserProgress } from "../lib/progressService";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import globalStyles from "../styles/globals.module.css";
import Footer from "../components/Footer";
import Book from "../assets/book.png";
import tickIcon from "../assets/tick.png";
import { useTranslation } from "react-i18next";
import cody_hello from "../assets/cody_hello.png";

const Lessons = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();
  const getLang = () => {
    const raw = (i18n.language || "en").toLowerCase();
    if (raw.startsWith("gr") || raw.startsWith("el")) return "gr";
    return "en";
  };

  const sectionMap = {
    welcome: `👋 ${t("lessons.sectionWelcome")}`,
    "getting-started": `🚀 ${t("lessons.sectionGettingStarted")}`,
    "control-flow": `🔍 ${t("lessons.sectionControlFlow")}`,
    "loops-c": `🔄 ${t("lessons.sectionLoops")}`,
    "functions-c": `🔧 ${t("lessons.sectionFunctions")}`,
    "arrays-c": `📊 ${t("lessons.sectionArrays")}`,
    "pointers-c": `📌 ${t("lessons.sectionPointers")}`,
    default: `📘 ${t("lessons.sectionOther")}`,
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

      // ✅ select both columns; don't interpolate a dynamic column name
      const { data: allLessons, error } = await supabase
        .from("lessons")
        .select("id, section_id, title_en, title_gr")
        .order("order", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error.message);
        return;
      }

      const lang = getLang();
      const localizedLessons = allLessons.map((lesson) => ({
        ...lesson,
        title: lang === "gr" ? lesson.title_gr : lesson.title_en,
      }));

      setProgress(progressMap);
      setLessons(localizedLessons);
      setLoading(false);
    };

    init();
  }, [i18n.language]);

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
        {t("lessons.pageTitle")}
      </h1>

      {orderedSections.map(([sectionId, sectionLessons], index) => (
        <div key={sectionId} className={globalStyles.cardWithMascotWrapper}>
          {index === 0 && (
            <img
              src={cody_hello}
              alt="Welcome mascot"
              className={globalStyles.cardBehindMascot}
            />
          )}

          <div className={`${globalStyles.card} ${globalStyles.cardAnimated}`}>
            <h3
              onClick={() =>
                setOpenSection((prev) =>
                  prev === sectionId ? null : sectionId
                )
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
                      {hasProgress ? (
                        isCompleted ? (
                          <>
                            <img
                              src={tickIcon}
                              alt="Completed"
                              className={globalStyles.statusIcon}
                            />
                            {t("lessons.completed")}
                          </>
                        ) : (
                          "🕐 " + t("lessons.inProgress")
                        )
                      ) : (
                        t("lessons.notStarted")
                      )}
                    </p>

                    <button
                      className={globalStyles.buttonPrimary}
                      onClick={() => handleLessonNavigation(lesson)}
                    >
                      {hasProgress && isCompleted
                        ? t("lessons.review")
                        : t("lessons.start")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <Footer />
    </div>
  );
};

export default Lessons;
