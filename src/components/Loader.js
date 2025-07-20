import styles from '../assets/style/Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}>
        {[...Array(7)].map((_, i) => (
          <div key={i} className={styles.loaderSquare}></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;