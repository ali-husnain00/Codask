import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import {
  Activity,
  BarChart3,
  Braces,
  CheckCircle2,
  Code2,
  Clock3,
  FolderTree,
  GitBranch,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  TerminalSquare,
  Users,
  Workflow,
} from "lucide-react";

const metrics = [
  { label: "Projects Managed", value: "24K+" },
  { label: "Tasks Completed", value: "180K+" },
  { label: "Messages Exchanged", value: "2.4M+" },
  { label: "Active Dev Sessions", value: "11K+" },
];

const trustTeams = [
  "ArcForge Labs",
  "PulseStack",
  "ByteRoute",
  "Northline Systems",
  "Kernel Studio",
];

const features = [
  {
    icon: Users,
    title: "Realtime Collaboration",
    desc: "Work in the same project with active user presence and instant updates.",
  },
  {
    icon: TerminalSquare,
    title: "Live Code Syncing",
    desc: "Keep your editor in sync with teammates without manual refresh or pull loops.",
  },
  {
    icon: MessageSquareText,
    title: "Team Chat",
    desc: "Discuss blockers and decisions in context while you code.",
  },
  {
    icon: BarChart3,
    title: "Task Progress Tracking",
    desc: "Assign ownership, update statuses, and see project execution health.",
  },
  {
    icon: FolderTree,
    title: "File Organization",
    desc: "Create and manage project files with language-specific workflows.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    desc: "JWT-protected app flows for private team workspaces.",
  },
  {
    icon: Activity,
    title: "Active Presence Indicators",
    desc: "See who is online, typing, and actively collaborating on your project.",
  },
  {
    icon: Workflow,
    title: "Developer Workflow Hub",
    desc: "Code, communicate, and track delivery in one focused environment.",
  },
];

const workflowSteps = [
  { title: "Create Project", desc: "Start a workspace with language-aware file setup." },
  { title: "Invite Team", desc: "Bring teammates in with role-aware collaboration." },
  { title: "Collaborate Live", desc: "Ship code together with chat and active presence." },
  { title: "Track Progress", desc: "Use tasks and completion states to monitor delivery." },
  { title: "Ship Faster", desc: "Reduce context switching and release with confidence." },
];

const testimonials = [
  {
    quote:
      "Codask replaced three separate tools for our dev squad. Live collaboration and task tracking in one place is a huge win.",
    name: "Sana Khan",
    role: "Engineering Manager, ArcForge Labs",
  },
  {
    quote:
      "The realtime editor and project workflow feel built for developers, not generic project management users.",
    name: "Mark Lee",
    role: "Lead Backend Engineer, PulseStack",
  },
  {
    quote:
      "We cut planning noise and code review delays by moving our sprint execution into Codask.",
    name: "Aisha Noor",
    role: "Product Engineer, ByteRoute",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "For solo builders and trial teams",
    perks: ["Up to 3 projects", "Realtime editor", "Basic tasks", "Community support"],
  },
  {
    name: "Pro",
    price: "$19",
    subtitle: "For growing product teams",
    perks: ["Unlimited projects", "Advanced collaboration", "Priority support", "Usage insights"],
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    subtitle: "For engineering organizations",
    perks: ["Team roles and controls", "Centralized reporting", "Dedicated onboarding", "SLA support"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const section = document.getElementById(id);
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [location.hash]);

  return (
    <div className="relative min-h-screen" id="top">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_-10%,rgba(255,255,255,0.06),transparent_35%)]" />
      <section className="mx-auto grid max-w-[1200px] w-full px-6 grid-cols-1 items-stretch gap-8 pb-16 pt-24 lg:grid-cols-[1.15fr_1fr]">
        <motion.div className="grid gap-6 place-content-center" variants={fadeUp} initial="hidden" animate="show">
          <Badge className="w-fit">Built for modern developer teams</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--text)]">Ship collaborative software faster with Codask</h1>
          <p className="max-w-[60ch] text-lg text-[var(--text-muted)]">
            Codask unifies realtime coding, team communication, project operations, and
            task execution in one clean developer workspace.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Button onClick={() => navigate("/register")}>
              Start Free
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              View Product
            </Button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Card className="shadow-2xl shadow-black/50 border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <CardContent>
              <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
                <span className="h-2 w-2 rounded-full bg-[#f87171]"></span>
                <span className="h-2 w-2 rounded-full bg-[#fbbf24]"></span>
                <span className="h-2 w-2 rounded-full bg-[#34d399]"></span>
                <p className="ml-1.5 text-xs text-[var(--text-muted)]">codask/workspace.tsx</p>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_1fr]">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="mb-2 font-mono text-sm text-[var(--text)]">{`const activeUsers = ['Ali', 'Sana', 'Mark'];`}</p>
                  <p className="mb-2 font-mono text-sm text-[var(--text)]">{`socket.emit('codeChange', update);`}</p>
                  <p className="font-mono text-sm text-[var(--text)]">{`task.status = 'In Progress';`}</p>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-sm font-medium text-[var(--text-muted)]">Live Activity</p>
                  {["Sana typing...","Mark pushed update","Task #42 completed"].map((t) => (
                    <div key={t} className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--success)]" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      <section className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Trusted by fast-moving dev teams</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {trustTeams.map((team) => (
            <span key={team} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-muted)]">{team}</span>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent>
                <h3>{metric.value}</h3>
                <p>{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Features</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">A serious collaboration stack for engineering teams</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardContent>
                  <Icon className="mb-2.5 text-[var(--primary)]" size={18} />
                  <h3 className="mb-1.5 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{feature.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Workflow</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">How teams use Codask every sprint</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          {workflowSteps.map((step, index) => (
            <Card key={step.title}>
              <CardContent>
                <p className="mb-2 font-mono text-sm text-[var(--primary)]">0{index + 1}</p>
                <h3 className="mb-1.5 font-semibold">{step.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Live Collaboration</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">See project activity as your team works in realtime</h2>
        </div>
        <Card className="mt-10">
          <CardContent className="grid gap-6 md:grid-cols-2 p-6">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <h4 className="font-medium">Active Users</h4>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"><Users size={14} /> Ali</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"><Users size={14} /> Sana</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm"><Users size={14} /> Mark</span>
                </div>
                <p className="mt-4 text-sm text-[var(--text-muted)]">2 teammates editing · 1 teammate reviewing</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-5">
                <h4 className="font-medium">Live Feed</h4>
                <ul className="mt-4 grid gap-3">
                  <li className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><GitBranch size={14} /> feature/socket-presence updated</li>
                  <li className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Braces size={14} /> main.js synced across session</li>
                  <li className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><MessageSquareText size={14} /> Design review note posted</li>
                </ul>
              </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Task Management</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Track priorities, ownership, and delivery health</h2>
        </div>
        <Card className="mt-10">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Badge variant="outline">Project: Sprint 14</Badge>
              <p className="text-sm font-medium text-[var(--text-muted)]">Progress 72%</p>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-soft)] border border-[var(--border)]">
              <div className="h-full w-[72%] bg-[var(--text)]"></div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {["Pending", "In Progress", "Completed"].map((state, i) => (
                <div key={state} className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <h4 className="font-medium mb-1">{state}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{i === 0 ? "4 tasks" : i === 1 ? "6 tasks" : "12 tasks"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="about" className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Why Codask</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Not another generic PM tool</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardContent>
              <h3 className="mb-1.5 font-semibold">Built for developers first</h3>
              <p className="text-sm text-[var(--text-muted)]">Developer-native interface, code context, and realtime collaboration by default.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="mb-1.5 font-semibold">Coding + planning in one place</h3>
              <p className="text-sm text-[var(--text-muted)]">Reduce context switching between editor, chat, and project board tools.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="mb-1.5 font-semibold">Realtime execution workflow</h3>
              <p className="text-sm text-[var(--text-muted)]">From kickoff to merge-ready delivery, teams stay aligned in a single workspace.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Testimonials</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Teams using Codask ship with less friction</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name}>
              <CardContent>
                <p className="mb-3.5 text-sm text-[var(--text-muted)]">"{item.quote}"</p>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-[var(--text-muted)]">{item.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Pricing</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Simple plans for every team stage</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.highlight ? "border-[var(--text)]" : ""}>
              <CardContent>
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="my-2 text-4xl font-bold">
                  {plan.price}
                  <span className="ml-1.5 text-xs text-[var(--text-muted)]">/month</span>
                </p>
                <p className="text-sm text-[var(--text-muted)]">{plan.subtitle}</p>
                <ul className="my-4 grid gap-2">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <CheckCircle2 size={14} />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => navigate("/register")}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] w-full px-6 py-16 md:py-24 border-t border-[var(--border)]">
        <Card className="bg-[var(--surface-soft)]">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-medium tracking-wide uppercase text-[var(--text-muted)]">Start shipping faster</p>
                <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Bring coding, chat, and delivery into one developer workspace</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate("/register")}>
                  <Rocket size={16} />
                  Get Started
                </Button>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  <Clock3 size={16} />
                  Book Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-12 border-t border-[var(--border)] py-12">
        <div className="mx-auto grid max-w-[1200px] w-full px-6 grid-cols-1 gap-8 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 font-semibold tracking-tight">
              <Code2 size={24} className="text-[var(--text)]" />
              <span className="text-lg">Codask</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Realtime developer workspace for coding, communication, and project execution.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul className="mt-2 grid gap-2 text-sm text-[var(--text-muted)]">
              <li className="list-none">Features</li>
              <li className="list-none">Workflow</li>
              <li className="list-none">Pricing</li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul className="mt-2 grid gap-2 text-sm text-[var(--text-muted)]">
              <li className="list-none">About</li>
              <li className="list-none">Careers</li>
              <li className="list-none">Contact</li>
            </ul>
          </div>
          <div>
            <h4>Social</h4>
            <ul className="mt-2 grid gap-2 text-sm text-[var(--text-muted)]">
              <li className="list-none">GitHub</li>
              <li className="list-none">X</li>
              <li className="list-none">LinkedIn</li>
            </ul>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-[var(--text-muted)]">© {new Date().getFullYear()} Codask. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
