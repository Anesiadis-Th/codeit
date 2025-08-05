// src/components/Footer.jsx
import styles from "../styles/footer.module.css";
import github from "../assets/github.svg";
import linkedin from "../assets/linkedin.png";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Built with 💜 by Theocharis Anesiadis · CodeIT © 2025</p>

      <div style={{ marginTop: "0.5rem" }}>
        <a
          href="https://github.com/Anesiadis-Th"
          target="_blank"
          rel="noreferrer"
          style={{ marginRight: "0.5rem" }}
        >
          <img
            src={github}
            alt=""
            aria-hidden="true"
            style={{
              width: "18px",
              height: "18px",
              verticalAlign: "middle",
              marginRight: "0.3rem",
            }}
          />
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/anesiadis-theocharis/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={linkedin}
            alt=""
            aria-hidden="true"
            style={{
              width: "18px",
              height: "18px",
              verticalAlign: "middle",
              marginRight: "0.3rem",
            }}
          />
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
