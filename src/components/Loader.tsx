import styles from '../Loader.module.css';
import { LoaderProps } from '../types/type';

const Loader: React.FC<LoaderProps> = ({ isFadingOut }) => {
  return (
    <div className={`${styles.loaderContainer} ${isFadingOut ? styles.hidden : ''}`}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
