import styles from "../styles/globals.module.css";

export default function InfoCard({ title, icon, children, delay = "0s" }) {
  return (
    <div
      className={`${styles.card} ${styles.cardAnimated}`}
      style={{ animationDelay: delay }}
    >
      <h2>
        {icon && <span style={{ marginRight: "0.5rem" }}>{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
}
