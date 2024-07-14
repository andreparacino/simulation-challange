import styles from "./index.module.scss";

const Loader = () => {
  return (
    <div className={styles.Loader}>
      <div className={styles["Loader-circle"]}>
        <svg viewBox="0 0 80 80">
          <circle id="test" cx="40" cy="40" r="32" />
        </svg>
      </div>
    </div>
  );
};

export default Loader;
