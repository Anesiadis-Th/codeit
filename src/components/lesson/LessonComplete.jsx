import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { PartyPopper } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import codyCelebrate from "../../assets/cody_celebrate.png";

export default function LessonComplete({ isGuest, hasSkipped }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [width, height] = useWindowSize();

  const message = isGuest
    ? t("lesson.guestMessage")
    : hasSkipped
      ? t("lesson.skippedNoXP")
      : t("lesson.signedInCongrats");

  return (
    <>
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

      <Card variant="static" animated>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex-1 space-y-3">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
              <PartyPopper className="size-6 shrink-0 text-accent-300" aria-hidden="true" />
              {t("lesson.completed")}
            </h3>

            <p className="leading-relaxed whitespace-pre-line">{message}</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => navigate("/lessons")}>
                {t("lesson.backToLessons")}
              </Button>
              {!isGuest && (
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                  {t("lesson.goToDashboard")}
                </Button>
              )}
              {isGuest && (
                <Button variant="secondary" onClick={() => navigate("/signup")}>
                  {t("header.signup")}
                </Button>
              )}
            </div>
          </div>

          <img
            src={codyCelebrate}
            alt=""
            aria-hidden="true"
            className="w-24 sm:w-28"
          />
        </div>
      </Card>
    </>
  );
}
