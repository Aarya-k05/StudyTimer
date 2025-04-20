import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      if (user) {
        const sessionsRef = collection(db, "users", user.uid, "sessions");
        const snapshot = await getDocs(sessionsRef);
        const sessionsList = snapshot.docs.map((doc) => doc.data());
        setSessions(sessionsList);
      }
    };

    fetchSessions();
  }, [user]);

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!subject || (hours === "" && minutes === "")) return;

    const totalDuration = parseInt(hours || 0) * 60 + parseInt(minutes || 0);
    const pomodoroSessions = Math.floor(totalDuration / 30);

    try {
      const sessionsRef = collection(db, "users", user.uid, "sessions");
      await addDoc(sessionsRef, {
        subject,
        duration: totalDuration,
        pomodoroSessions,
        startTime: new Date()
      });

      navigate("/timer", { state: { subject, pomodoroSessions } });

      setSubject("");
      setHours("");
      setMinutes("");

      const snapshot = await getDocs(sessionsRef);
      const sessionsList = snapshot.docs.map((doc) => doc.data());
      setSessions(sessionsList);
    } catch (error) {
      console.error("Error adding session:", error.message);
    }
  };

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.appTitle}>FocusFlow</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.sessionBox}>
        <h2 style={styles.subHeading}>Start a New Session</h2>
        <form onSubmit={handleAddSession} style={styles.form}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputContainer}>
            <input
              type="number"
              placeholder="Hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              style={styles.inputSmall}
              min="0"
            />
            <input
              type="number"
              placeholder="Minutes"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              style={styles.inputSmall}
              min="0"
            />
          </div>
          <button type="submit" style={styles.button}>Start Session</button>
        </form>
      </div>

      <h2 style={styles.subHeading}>Your Sessions</h2>
      <div style={styles.sessionsContainer}>
        {sessions.map((session, index) => (
          <div key={index} style={styles.sessionCard}>
            <h3 style={styles.sessionSubject}>{session.subject}</h3>
            <p style={styles.sessionDetails}>
              <strong>Duration:</strong> {formatDuration(session.duration)}<br />
              <strong>Start Time:</strong> {new Date(session.startTime.seconds * 1000).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    background: "linear-gradient(to right, #ddeaf6, #eaf2ff)",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "800px",
    marginBottom: "2rem"
  },
  appTitle: {
    fontSize: "2rem",
    color: "#1f2e4a",
    fontWeight: "bold"
  },
  logoutButton: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#ff4d4f",
    color: "white",
    fontSize: "1rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  },
  sessionBox: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
    width: "100%",
    maxWidth: "500px"
  },
  subHeading: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "1.5rem",
    fontWeight: "500",
    textAlign: "center"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  inputContainer: {
    display: "flex",
    gap: "1rem"
  },
  input: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    flex: 1
  },
  inputSmall: {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    width: "50%"
  },
  button: {
    padding: "0.8rem 1.2rem",
    backgroundColor: "#4e89ff",
    color: "white",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.3s"
  },
  sessionsContainer: {
    width: "100%",
    maxWidth: "800px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem"
  },
  sessionCard: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    textAlign: "left"
  },
  sessionSubject: {
    fontSize: "1.3rem",
    color: "#333",
    marginBottom: "0.5rem",
    fontWeight: "600"
  },
  sessionDetails: {
    color: "#555",
    fontSize: "1rem"
  }
};

export default Dashboard;
