import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Timer = () => {
  const location = useLocation();
  const { subject, pomodoroSessions } = location.state || {};

  const [currentSession, setCurrentSession] = useState(1);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const toggleTimer = () => {
    setIsActive((prevState) => !prevState);
  };

  const skipSession = () => {
    if (isBreak) {
      setIsBreak(false);
      if (currentSession < pomodoroSessions) {
        setTimeLeft(25 * 60);
        setCurrentSession((prev) => prev + 1);
      } else {
        setTimeLeft(0);
        setSessionCompleted(true);
      }
    } else {
      setIsBreak(true);
      setTimeLeft(5 * 60);
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && !sessionCompleted) {
      if (isBreak) {
        if (currentSession < pomodoroSessions) {
          setIsBreak(false);
          setTimeLeft(25 * 60);
          setCurrentSession((prev) => prev + 1);
          alert("Break over! Time to study again.");
        } else {
          setSessionCompleted(true);
        }
      } else {
        setIsBreak(true);
        setTimeLeft(5 * 60);
        alert("Time for a break!");
      }
    }
  }, [timeLeft, isBreak, currentSession, pomodoroSessions, sessionCompleted]);

  useEffect(() => {
    let interval = null;

    if (isActive && !sessionCompleted) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, sessionCompleted]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.timerBox}>
        <h1 style={styles.subject}>{subject}</h1>
        <h2 style={styles.mode}>{sessionCompleted ? "Session Completed!" : isBreak ? "Break Time" : "Study Time"}</h2>
        <div style={styles.time}>{sessionCompleted ? "00:00" : formatTime(timeLeft)}</div>

        {!sessionCompleted && (
          <div style={styles.buttons}>
            <button onClick={toggleTimer} style={styles.button}>
              {isActive ? "Pause" : "Start"}
            </button>
            <button onClick={skipSession} style={styles.button}>
              Skip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right,rgb(130, 162, 195), #cfdef3)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  timerBox: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "3rem",
    borderRadius: "30px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  },
  subject: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "1rem",
  },
  mode: {
    fontSize: "1.5rem",
    color: "#4e89ff",
    marginBottom: "1rem",
  },
  time: {
    fontSize: "5rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    color: "#222",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#4e89ff",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Timer;
