import React, { useContext, useState } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../components/context/context';
import Loader from '../../components/Loader/Loader';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { apiRequest } from '../../lib/apiClient';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const { BASE_URL } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!username || !email || !password){
      toast.warning("All fields are required!");
      return;
    }
    setLoading(true)
    try {
      await apiRequest(BASE_URL, "/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });
      toast.success("You have been registered successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Server error!");
    }
    finally{
      setLoading(false)
    }
  };

  if(loading){
    return <Loader/>
  }

  return (
    <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center p-6">
      <Card className="w-full max-w-[400px] animate-[fadeSlideIn_.45s_ease-out]">
        <CardContent className="p-8">
          <form onSubmit={handleRegister} className="grid gap-4">
            <h2 className="text-center text-2xl font-semibold tracking-tight">Create Account on <span className="text-[var(--text)]">Codask</span></h2>
            <p className="text-center text-sm text-[var(--text-muted)]">Join the collab space for devs.</p>
            <div className="grid gap-3 mt-2">
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            </div>
            <Button type="submit" className="w-full mt-2">Register</Button>
            <p className="text-center text-sm text-[var(--text-muted)] mt-4">
              Already have an account? <Link className="text-[var(--text)] font-medium underline underline-offset-4" to="/login">Login</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
