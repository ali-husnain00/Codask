import React, { useContext, useState } from 'react';
import './Register.css';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../components/context/context';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { BASE_URL } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });

      if (res.ok) {
        toast.success("You have been registered successfully!");
        navigate("/login");
      } else {
        const errorText = await res.text();
        toast.error(errorText || "An error occurred while registering!");
      }
    } catch (error) {
      toast.error("Server error!");
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Create Account on <span>Codask</span></h2>
        <p className="subtext">Join the collab space for devs.</p>

        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />

        <button type="submit">Register</button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
