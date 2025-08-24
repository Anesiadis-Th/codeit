import styles from "../styles/globals.module.css";
import InfoCard from "../components/Card";
import Footer from "../components/Footer";
import compiler from "../assets/compiler.png";
import rocket from "../assets/rocket.png";
import brain from "../assets/brain.svg";
import star from "../assets/star.png";
import mascot from "../assets/mascot.png";
import { Typewriter } from "react-simple-typewriter";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>CodeIT: {t("home.learnC")}</h1>
        <p className={styles.subtitle}>
          <Typewriter
            words={[
              "100% Free.",
              "Beginner-friendly.",
              "No installation required.",
            ]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </p>

        <div className={styles.heroMascot}>
          <img
            src={mascot}
            alt="CodeIT Mascot"
            className={styles.heroMascotImage}
          />
        </div>

        <Link to="/lessons">
          <button className={styles.buttonPrimary}>
            <img src={rocket} alt="Rocket" className={styles.inlineIcon} />
            {t("home.startLearning")}
          </button>
        </Link>
      </div>

      <InfoCard
        title={t("home.whatIsTitle")}
        icon={
          <img src={compiler} alt="compiler" className={styles.inlineIcon} />
        }
        delay="0.2s"
      >
        <p>{t("home.whatIsText")}</p>
      </InfoCard>

      <InfoCard
        title={t("home.featuresTitle")}
        icon={<img src={brain} alt="Brain" className={styles.inlineIcon} />}
        delay="0.6s"
      >
        <ul>
          <li>{t("home.feature1")}</li>
          <li>{t("home.feature2")}</li>
          <li>{t("home.feature3")}</li>
          <li>{t("home.feature4")}</li>
        </ul>
      </InfoCard>

      <InfoCard
        title={t("home.progressTitle")}
        icon={<img src={star} alt="Star" className={styles.inlineIcon} />}
        delay="0.2s"
      >
        <ul>
          <li>{t("home.progress1")}</li>
          <li>{t("home.progress2")}</li>
          <li>{t("home.progress3")}</li>
          <li>{t("home.progress4")}</li>
        </ul>
      </InfoCard>

      <Footer />
    </div>
  );
}
