// src/components/Footer.jsx
import styles from "../styles/footer.module.css";
import github from "../assets/github.png";
import linkedin from "../assets/linkedin.png";
import { useTranslation } from "react-i18next";
import enIcon from "../assets/enIcon.png";
import grIcon from "../assets/grIcon.png";

export default function Footer() {
  const { i18n } = useTranslation(); 

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };
  return (
    <footer className={styles.footer}>
      <p>Built with 💜 by Theocharis Anesiadis · CodeIT © 2025</p>

      <div className={styles.socialLinks}>
        <a
          href="https://github.com/Anesiadis-Th"
          target="_blank"
          rel="noreferrer"
        >
          <img src={github} alt="GitHub" aria-hidden="true" />
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/anesiadis-theocharis/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={linkedin} alt="LinkedIn" aria-hidden="true" />
          LinkedIn
        </a>
      </div>

      <div className={styles.languageSwitcher}>
        <button
          onClick={() => changeLanguage("en")}
          aria-label="Switch to English"
        >
          <img src={enIcon} alt="English" />
        </button>

        <button
          onClick={() => changeLanguage("gr")}
          aria-label="Switch to Greek"
        >
          <img src={grIcon} alt="Greek" />
        </button>
      </div>
    </footer>
  );
}
