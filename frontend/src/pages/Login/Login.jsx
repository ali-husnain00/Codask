import React, { useContext, useState } from 'react';
import './Login.css';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../components/context/context';
import Loader from '../../components/Loader/Loader';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {BASE_URL, getLoggedInUser} = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) =>{
    e.preventDefault();
    if(!email || !password){
      toast.warning("All fields are required!")
      return;
    }
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/login`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email,password}),
        credentials:"include"
      })
      if(res.ok){
        await getLoggedInUser();
        toast.success("Login successful!");
        setTimeout(() =>{
          navigate("/dashboard")
        },100)
      }
      else{
        toast.error("An error occured while login!")
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  if(loading){
    return <Loader/>
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Welcome to <span>Codask</span></h2>
        <p className="subtext">Login to collaborate and build smarter.</p>
        <input type="email" value={email} onChange={(e) =>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) =>setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
