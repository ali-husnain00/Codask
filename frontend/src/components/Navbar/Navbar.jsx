import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../context/context";
import { toast } from "sonner";
import useDeviceType from "../../hooks/useDeviceType.js";
import { Button } from "../ui/button.jsx";
import { apiRequest } from "../../lib/apiClient.js";
import { Code2, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, BASE_URL, getLoggedInUser } = useContext(Context);
  const { isMobile, isTablet } = useDeviceType();
  const isCompact = isMobile || isTablet;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest(BASE_URL, "/logout", { method: "POST" });
      toast.success("Logout successful!");
      getLoggedInUser();
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "An error occured while logging out!");
    }
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  };

  const isAppView = ["/dashboard", "/editor", "/projectDetail"].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <header
      className={`sticky top-0 z-[120] flex h-[64px] w-full items-center justify-between gap-4 border-b px-4 md:px-8 transition-all ${
        scrolled
          ? "border-[var(--border)] bg-[#0A0D12]/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex items-center gap-8">
        <Link to="/">
          <div className="inline-flex items-center gap-2 font-semibold tracking-tight text-[var(--text)]">
            <Code2 size={24} className="text-[var(--text)]" />
            <span className="text-lg">Codask</span>
          </div>
        </Link>
        
        {!isCompact && !isAppView && (
          <nav className="flex items-center gap-2">
            <Button variant="ghost" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]" onClick={() => scrollToSection("features")}>Features</Button>
            <Button variant="ghost" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]" onClick={() => scrollToSection("workflow")}>Workflow</Button>
            <Button variant="ghost" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]" onClick={() => scrollToSection("pricing")}>Pricing</Button>
            <Button variant="ghost" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]" onClick={() => scrollToSection("about")}>About</Button>
          </nav>
        )}
      </div>

      {isCompact ? (
        <Button
          variant="outline"
          className="h-10 w-10 p-0"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {!isAppView && (
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>
                Get Started
              </Button>
            </>
          )}
        </div>
      )}

      {isCompact && mobileOpen && (
        <div className="absolute left-4 right-4 top-20 grid gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl backdrop-blur-md">
          {!isAppView && (
            <>
              <Button variant="ghost" className="justify-start" onClick={() => scrollToSection("features")}>Features</Button>
              <Button variant="ghost" className="justify-start" onClick={() => scrollToSection("workflow")}>Workflow</Button>
              <Button variant="ghost" className="justify-start" onClick={() => scrollToSection("pricing")}>Pricing</Button>
              <Button variant="ghost" className="justify-start" onClick={() => scrollToSection("about")}>About</Button>
            </>
          )}
          {user ? (
             <>
               <Button variant="ghost" className="justify-start" onClick={() => navigate("/dashboard")}>Dashboard</Button>
               <Button variant="ghost" className="justify-start text-[var(--danger)]" onClick={handleLogout}>Logout</Button>
             </>
          ) : (
            <>
              <Button variant="ghost" className="justify-start" onClick={() => navigate("/login")}>Login</Button>
              <Button className="justify-start" onClick={() => navigate("/register")}>Get Started</Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;