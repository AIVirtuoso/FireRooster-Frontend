import styles from "./authLayout.module.scss";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authHeader}>
        Company logo
      </div>
      {children}
    </div>
  );
}
