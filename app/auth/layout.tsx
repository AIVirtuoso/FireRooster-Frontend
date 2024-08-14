import styles from "./authLayout.module.scss";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authHeader}>
        <img src={'/logo.png'}></img>
      </div>
      {children}
    </div>
  );
}
