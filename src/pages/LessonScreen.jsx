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
import Icon from "../components/Icon";
import lightbulb from "../assets/lightbulb.png";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

export default function LessonScreen() {
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
            <p style={{ textAlign: "right", fontSize: "0.9rem", margin: 0 }}>
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
            Question {questionIndex + 1} of {steps.length}
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
                {showHint ? "Hide Hint" : "Need Help?"}
              </button>
              <div
                className={`${globalStyles.hintBox} ${
                  showHint ? globalStyles.hintBoxVisible : ""
                }`}
              >
                <img
                  src={lightbulb}
                  alt="Hint"
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "0.5rem",
                    verticalAlign: "middle",
                    display: "inline-block",
                  }}
                />
                {currentStep.help}

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
              <p style={{ fontWeight: "bold" }}>Expected Output:</p>
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
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 14,
                  backgroundColor: "#1a1a2e",
                  color: "#e0e0f5",
                  borderRadius: "8px",
                  border: "1px solid #444",
                  marginBottom: "1rem",
                  minHeight: "250px",
                  width: "100%", // ✅ Make it fluid
                  boxSizing: "border-box", // ✅ Avoid overflow
                  overflowX: "auto",
                }}
              />

              <button
                className={globalStyles.buttonRun}
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? "Running..." : "Run Code"}
              </button>

              {codeOutput && (
                <pre className={globalStyles.codeOutput}>
                  Output: {codeOutput}
                </pre>
              )}

              {codeError && (
                <pre className={globalStyles.codeError}>
                  <Icon
                    name="XCircle"
                    size={18}
                    color="#550000"
                    style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                  />
                  Error: {codeError}
                </pre>
              )}

              {isCorrect === true && (
                <p
                  style={{
                    color: "green",
                    marginTop: "1rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Icon name="CheckCircle" color="green" />
                  Output is correct!
                </p>
              )}

              {isCorrect === false && (
                <p
                  style={{
                    color: "red",
                    marginTop: "1rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Icon name="AlertTriangle" color="red" />
                  Output does not match expected result. Check your code again!
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
            Submit
          </button>

          {isCorrect !== null && currentStep.type !== "code" && (
            <p
              style={{
                color: isCorrect ? "green" : "red",
                marginTop: "1rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Icon
                name={isCorrect ? "CheckCircle" : "XCircle"}
                color={isCorrect ? "green" : "red"}
                size={18}
              />
              {isCorrect
                ? "Correct!"
                : "That’s not correct yet — review the options and try again!"}
            </p>
          )}
        </div>
      )}

      {completed && (
        <div className={globalStyles.cardStatic}>
          <h3>🎉 Lesson Complete!</h3>
          {lesson.isGuest ? (
            <>
              <p>Great job finishing the lesson!</p>
              <p>
                <strong>
                  Sign up to save your progress and earn XP next time! 🔓
                </strong>
              </p>
            </>
          ) : (
            <p>You've earned 10 XP and kept your streak alive! 🔥</p>
          )}
          <p>Redirecting back to lessons...</p>
        </div>
      )}

      <Footer />
    </div>
  );
}
