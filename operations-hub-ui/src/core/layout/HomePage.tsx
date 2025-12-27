import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Operations Hub Demo</h1>

      <p style={styles.text}>
        Operations Hub is a lightweight internal tool designed to help small and
        medium-sized businesses manage their operational processes in a clear,
        structured, and reliable way.
      </p>

      <p style={styles.text}>
        This demo showcases a foundational architecture for internal systems:
        a modular backend, a typed API, and a simple frontend client built for
        maintainability and scalability.
      </p>

      <p style={styles.text}>
        The goal is not to replace large enterprise platforms, but to provide
        focused, cost-effective solutions tailored to real business workflows.
      </p>

      <Link to="/users" style={styles.button}>
        Go to Users Management
      </Link>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "60px auto",
    padding: "0 20px",
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.6,
  },
  title: {
    fontSize: "32px",
    marginBottom: "24px",
  },
  text: {
    fontSize: "16px",
    marginBottom: "16px",
    color: "#333",
  },
  button: {
    display: "inline-block",
    marginTop: "24px",
    padding: "12px 20px",
    backgroundColor: "#1e293b",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: 500,
  },
};

export default HomePage;
