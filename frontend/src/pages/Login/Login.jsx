import React, { useContext, useState } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../components/context/context';
import Loader from '../../components/Loader/Loader';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { apiRequest } from '../../lib/apiClient';

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
      await apiRequest(BASE_URL, "/login", {
        method:"POST",
        body: JSON.stringify({email,password}),
      });
      await getLoggedInUser();
      toast.success("Login successful!");
      navigate("/dashboard")
    } catch (error) {
      toast.error(error.message || "An error occured while login!")
    }
    finally{
      setLoading(false)
    }
  }

  if(loading){
    return <Loader/>
  }

  return (
    <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center p-6">
      <Card className="w-full max-w-[400px] animate-[fadeSlideIn_.45s_ease-out]">
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="grid gap-4">
            <h2 className="text-center text-2xl font-semibold tracking-tight">Welcome to <span className="text-[var(--text)]">Codask</span></h2>
            <p className="text-center text-sm text-[var(--text-muted)]">Login to collaborate and build smarter.</p>
            <div className="grid gap-3 mt-2">
              <Input type="email" value={email} onChange={(e) =>setEmail(e.target.value)} placeholder="Email" required />
              <Input type="password" value={password} onChange={(e) =>setPassword(e.target.value)} placeholder="Password" required />
            </div>
            <Button type="submit" className="w-full mt-2">Login</Button>
            <p className="text-center text-sm text-[var(--text-muted)] mt-4">
              Don't have an account? <Link className="text-[var(--text)] font-medium underline underline-offset-4" to="/register">Register</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
