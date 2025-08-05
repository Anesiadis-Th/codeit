import styles from "../styles/globals.module.css";
import InfoCard from "../components/Card";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import compiler from "../assets/compiler.png";
import rocket from "../assets/rocket.png";
import brain from "../assets/brain.svg";
import star from "../assets/star.png";
import mascot from "../assets/mascot.png";
import { Typewriter } from "react-simple-typewriter";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={`${styles.title} `}>CodeIT: Learn C the Fun Way</h1>
        <p className={styles.subtitle}>
          <Typewriter
            words={["Gamified.", "Beginner-friendly.", "100% in-browser."]}
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
            Start Learning
          </button>
        </Link>
      </div>

      <InfoCard
        title="What is CodeIT?"
        icon={
          <img src={compiler} alt="compiler" className={styles.inlineIcon} />
        }
        delay="0.2s"
      >
        <p>
          CodeIT is a gamified platform designed to teach C programming step by
          step. It's interactive, beginner-friendly, and fully in-browser — no
          setup needed.
        </p>
      </InfoCard>

      <InfoCard
        title="Features"
        icon={<img src={brain} alt="Brain" className={styles.inlineIcon} />}
        delay="0.6s"
      >
        <ul>
          <li>Write basic C programs with real code</li>
          <li>Understand variables, data types, and control flow</li>
          <li>Use loops, functions, and pointers effectively</li>
          <li>Apply logic through hands-on quizzes and challenges</li>
        </ul>
      </InfoCard>

      <InfoCard
        title="Progress & Rewards"
        icon={<img src={star} alt="Star" className={styles.inlineIcon} />}
        delay="0.2s"
      >
        <ul>
          <li>Earn XP, level up, and keep your streak alive</li>
          <li>Test your code instantly with a built-in C compiler</li>
          <li>Track your progress and unlock new lessons</li>
          <li>No stress — learn at your own pace, from any device</li>
        </ul>
      </InfoCard>

      <Footer />
    </div>
  );
}
