import Layout from "../components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h1 style={{ marginBottom: "30px" }}>Welcome to SoundSteps 👣</h1>

      <div style={styles.newsContainer}>
        <div style={styles.card}>News Block</div>
        <div style={styles.card}>News Block</div>
        <div style={styles.card}>News Block</div>
      </div>

      <div style={styles.progressSection}>
        <h2>Progress</h2>
        <div style={styles.progressContainer}>
          <div style={styles.chart}>
            Progress Chart
          </div>
          <div style={styles.stats}>
            Statistics Panel
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  newsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  progressSection: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
  },
  progressContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  chart: {
    flex: 2,
    backgroundColor: "#F4A30020",
    padding: "40px",
    borderRadius: "12px",
  },
  stats: {
    flex: 1,
    backgroundColor: "#7AC94320",
    padding: "40px",
    borderRadius: "12px",
  },
};
