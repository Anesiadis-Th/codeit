import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLessonById } from "../lib/lessonService";
import { completeLesson } from "../lib/progressService";
import { awardXP } from "../lib/statsService";
import { runCCode } from "../lib/judge0Service";
import { supabase } from "../lib/supabaseClient";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/themes/prism-tomorrow.css";
import globalStyles from "../styles/globals.module.css";
import Footer from "../components/Footer";
import tick from "../assets/tick.png";
import xIcon from "../assets/x.png";
import lightbulb from "../assets/lightbulb.png";
import codyCelebrate from "../assets/cody_celebrate.png";

import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import editorStyles from "../styles/editor.module.css";
import { useTranslation } from "react-i18next";

export default function LessonScreen() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [steps, setSteps] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [completed, setCompleted] = useState(false);

  const [code, setCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const [showHint, setShowHint] = useState(false);

  const [width, height] = useWindowSize();

  useEffect(() => {
    const loadLesson = async () => {
      const lessonData = await fetchLessonById(lessonId);
      setLesson(lessonData);
      setSteps(lessonData.steps || []);
    };

    loadLesson();
  }, [lessonId, i18n.language]); // refetches when language changes

  useEffect(() => {
    const init = async () => {
      const lessonData = await fetchLessonById(lessonId);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const isGuest = !user || user.app_metadata?.provider === "anonymous";

      setLesson({ ...lessonData, isGuest });

      const normalizedSteps = lessonData.steps.map((step) =>
        step.type === "code_task" ? { ...step, type: "code" } : step
      );

      setSteps(normalizedSteps);

      const firstCodeStep = normalizedSteps.find(
        (step) => step.type === "code"
      );
      if (firstCodeStep) {
        setCode(firstCodeStep.starterCode);
      }
    };

    init();
  }, [lessonId]);

  useEffect(() => {
    setShowHint(false);
    setCodeOutput("");
    setCodeError("");
    setIsCorrect(null);
  }, [questionIndex]);

  useEffect(() => {
    if (
      isCorrect === false &&
      steps.length > 0 &&
      questionIndex >= 0 &&
      questionIndex < steps.length &&
      steps[questionIndex].type !== "code"
    ) {
      const timer = setTimeout(() => setIsCorrect(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, steps, questionIndex]);

  if (!lesson || !Array.isArray(steps) || steps.length === 0) {
    return (
      <div className={globalStyles.loaderWrapper}>
        <div className={globalStyles.loader}></div>
      </div>
    );
  }

  const currentStep = steps[questionIndex];
  const progress = ((questionIndex + 1) / steps.length) * 100;

  const handleRunCode = async () => {
    setIsRunning(true);
    setCodeOutput("");
    setCodeError("");
    setIsCorrect(null);

    try {
      const result = await runCCode(code);
      const actual = result.stdout.trim();
      const expected = currentStep.expectedOutput.trim();

      setCodeOutput(actual);

      if (result.stderr) {
        setCodeError(result.stderr);
      } else {
        const correct = actual === expected;
        setIsCorrect(correct);
      }
    } catch (err) {
      setCodeError("Execution error: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    let correct = false;

    if (currentStep.type === "multiple-choice") {
      correct = selected === currentStep.answer;
    } else if (
      currentStep.type === "short-answer" ||
      currentStep.type === "fill-in-the-blank"
    ) {
      correct =
        inputAnswer.trim().toLowerCase() ===
        currentStep.answer.trim().toLowerCase();
    } else if (currentStep.type === "code") {
      const actual = codeOutput.trim();
      const expected = currentStep.expectedOutput.trim();
      correct = actual === expected;
    }

    setIsCorrect(correct);

    if (correct) {
      if (questionIndex === steps.length - 1) {
        setCompleted(true);

        setTimeout(() => navigate("/lessons"), 9000);

        await completeLesson(lesson.id);
        await awardXP(10);
      } else {
        setTimeout(() => {
          setSelected(null);
          setInputAnswer("");
          setIsCorrect(null);
          setShowHint(false);
          setQuestionIndex((prev) => {
            const nextIndex = prev + 1;
            if (steps[nextIndex]?.type === "code") {
              setCode(steps[nextIndex].starterCode);
            }
            return nextIndex;
          });
        }, 1000);
      }
    }
  };

  return (
    <div className={globalStyles.container}>
      <h2 className={globalStyles.title}>{lesson.title}</h2>

      {completed && (
        <Confetti width={width} height={height} numberOfPieces={300} />
      )}

      {lesson.intro && questionIndex === 0 && (
        <div className={globalStyles.introCard}>
          <p>{lesson.intro}</p>
        </div>
      )}

      {!completed && (
        <div className={globalStyles.cardStatic}>
          {lesson.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}

      {!completed && (
        <div
          className={`${globalStyles.cardStatic} ${
            isCorrect === false ? globalStyles.shake : ""
          } ${isCorrect === true ? globalStyles.pulseSuccess : ""}`}
        >
          <div className={globalStyles.progressWrapper}>
            <p className={globalStyles.progressText}>
              {progress.toFixed(0)}% complete
            </p>
            <div className={globalStyles.progressBar}>
              <div
                className={globalStyles.progress}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h3>
            {t("lesson.question", {
              current: questionIndex + 1,
              total: steps.length,
            })}
          </h3>

          {currentStep.type !== "code" && <p>{currentStep.question}</p>}
          {currentStep.type === "code" && currentStep.description && (
            <p style={{ fontStyle: "italic", marginBottom: "0.5rem" }}>
              {currentStep.description}
            </p>
          )}

          {currentStep.help && (
            <div style={{ marginTop: "0.5rem" }}>
              <button
                className={globalStyles.hintButton}
                onClick={() => setShowHint((prev) => !prev)}
              >
                {showHint ? t("lesson.hideHint") : t("lesson.needHelp")}
              </button>
              <div
                className={`${globalStyles.hintBox} ${
                  showHint ? globalStyles.hintBoxVisible : ""
                }`}
              >
                <img
                  src={lightbulb}
                  alt="Hint"
                  className={globalStyles.inlineHintIcon}
                />

                {currentStep.help}
              </div>
            </div>
          )}

          <form className={globalStyles.radioForm}>
            {currentStep.type === "multiple-choice" &&
              Array.isArray(currentStep.options) &&
              currentStep.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`${globalStyles.radioLabel} ${
                    selected === idx ? globalStyles.radioLabelChecked : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz"
                    value={idx}
                    className={globalStyles.radioInput}
                    checked={selected === idx}
                    onChange={() => setSelected(idx)}
                  />
                  <span className={globalStyles.truncate}>{opt}</span>
                </label>
              ))}
          </form>

          {(currentStep.type === "short-answer" ||
            currentStep.type === "fill-in-the-blank") && (
            <input
              type="text"
              className={globalStyles.questionInput}
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              placeholder="Type your answer"
            />
          )}

          {currentStep.type === "code" && (
            <>
              <p style={{ fontWeight: "bold" }}>{t("lesson.expectedOutput")}</p>
              <pre className={globalStyles.expectedOutput}>
                {currentStep.expectedOutput}
              </pre>

              <Editor
                value={code}
                onValueChange={setCode}
                highlight={(code) =>
                  Prism.highlight(code, Prism.languages.c, "c")
                }
                padding={16}
                className={editorStyles.editorBox}
              />

              <button
                className={globalStyles.buttonRun}
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? t("lesson.running") : t("lesson.runCode")}
              </button>

              {codeOutput && (
                <pre className={globalStyles.codeOutput}>
                  {t("lesson.output")}: {codeOutput}
                </pre>
              )}

              {codeError && (
                <pre className={globalStyles.codeError}>
                  <img
                    src={xIcon}
                    alt="Error"
                    className={globalStyles.statusIcon}
                  />
                  {codeError}
                </pre>
              )}

              {isCorrect === true && (
                <p className={editorStyles.successMessage}>
                  <img
                    src={tick}
                    alt="Correct"
                    className={globalStyles.statusIcon}
                  />
                  {t("lesson.codeOutputCorrect")}
                </p>
              )}

              {isCorrect === false && (
                <p className={editorStyles.errorMessage}>
                  <img
                    src={xIcon}
                    alt="Wrong"
                    className={globalStyles.statusIcon}
                  />
                  {t("lesson.codeOutputIncorrect")}
                </p>
              )}
            </>
          )}

          <button
            className={globalStyles.buttonPrimary}
            onClick={handleSubmit}
            disabled={
              (currentStep.type === "multiple-choice" && selected === null) ||
              ((currentStep.type === "short-answer" ||
                currentStep.type === "fill-in-the-blank") &&
                inputAnswer.trim() === "") ||
              (currentStep.type === "code" && (isRunning || !codeOutput))
            }
          >
            {t("lesson.submit")}
          </button>

          {isCorrect !== null && currentStep.type !== "code" && (
            <p
              className={
                isCorrect
                  ? editorStyles.successMessage
                  : editorStyles.errorMessage
              }
            >
              <img
                src={isCorrect ? tick : xIcon}
                alt={isCorrect ? "Correct" : "Wrong"}
                className={globalStyles.statusIcon}
              />
              {t(isCorrect ? "lesson.answerCorrect" : "lesson.answerWrong")}
            </p>
          )}
        </div>
      )}

      {completed && (
        <div
          className={`${globalStyles.cardStatic} ${globalStyles.cardCelebrateWrapper}`}
        >
          <div className={globalStyles.cardCelebrateText}>
            <h3>🎉 {t("lesson.completed")}</h3>
            {lesson.isGuest ? (
              <p>{t("lesson.guestMessage")}</p>
            ) : (
              <p>{t("lesson.signedInCongrats")}</p>
            )}
            <p>{t("lesson.redirecting")}</p>
          </div>

          <img
            src={codyCelebrate}
            alt="Celebrating Robot"
            className={globalStyles.cardCelebrateImage}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
