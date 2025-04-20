import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add additional user information (name) to Firestore after registration
      await setDoc(doc(db, "users", user.uid), {
        name,
        email: user.email,
        uid: user.uid,
      });

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Could not register. Please check your details.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
        <p style={styles.linkText}>
          Already have an account? <Link to="/" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #e0eafc, #cfdef3)"
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center"
  },
  heading: {
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    color: "#333"
  },
  error: {
    color: "red",
    marginBottom: "1rem"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  button: {
    padding: "0.75rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4e89ff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s"
  },
  linkText: {
    marginTop: "1rem",
    fontSize: "0.9rem"
  },
  link: {
    color: "#4e89ff",
    textDecoration: "none"
  }
};

export default Register;
