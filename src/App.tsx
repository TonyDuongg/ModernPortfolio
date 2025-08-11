import React, { useEffect, useMemo, useRef, useState, PropsWithChildren } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Lottie from "lottie-react";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Download,
  ChevronDown,
  ChevronUp,
  Rocket,
  Sparkles,
  Moon,
  Sun,
  Briefcase,
  GraduationCap,
  Code2,
  Menu,
  X,
  Handshake,
  PhoneCall,
  Globe2,
  ArrowRight,
  Star
} from "lucide-react";

// ============================================================
// Portfolio Template (TypeScript) — v2 Upgrades
// - Modern animated gradient background + noise overlay
// - Bigger icons for better legibility
// - Projects: advanced filters (role, difficulty, year) + sorting (Most starred)
// - Auto‑fetch GitHub projects (pinned via serverless API or top starred fallback)
// - Lottie micro‑interactions (hero icon + project hover)
// ============================================================

type SectionId = "home" | "about" | "skills" | "projects" | "experience" | "contact";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" }
];

// ---------------- Skills demo data ----------------
const skillsData = [
  { subject: "Frontend", A: 92 },
  { subject: "Backend", A: 78 },
  { subject: "Mobile", A: 70 },
  { subject: "DevOps", A: 60 },
  { subject: "UI/UX", A: 82 },
  { subject: "Data", A: 55 }
];

// ---------------- Projects model ----------------
type Difficulty = "Easy" | "Medium" | "Hard";

type Project = {
  title: string;
  desc: string;
  tags: string[];
  link: string;
  role: "Owner" | "Contributor" | "Student" | "Freelance";
  year: number;
  stars?: number;
  source?: "local" | "github";
};

const projectsSeed: Project[] = [
  { title: "E‑commerce Mini", desc: "Catalog, cart, checkout — polished UX and solid state management.", tags: ["Next.js", "Stripe", "Tailwind"], link: "#", role: "Student", year: 2024, stars: 0, source: "local" },
  { title: "Quiz Platform", desc: "Timed quizzes, leaderboard, and beautiful transitions.", tags: ["React", "Firebase", "Framer Motion"], link: "#", role: "Owner", year: 2023, stars: 0, source: "local" },
  { title: "Analytics Dashboard", desc: "Role-based admin with charts, filters, and exports.", tags: ["React", "Node", "Postgres"], link: "#", role: "Contributor", year: 2024, stars: 0, source: "local" },
  { title: "Portfolio v2", desc: "This very template — accessible, fast, and creative.", tags: ["React", "Tailwind", "Recharts"], link: "#", role: "Owner", year: 2025, stars: 0, source: "local" },
];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window === "undefined"
      ? "light"
      : (localStorage.getItem("theme") as "light" | "dark") ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

function useScrollSpy(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId>(ids[0]);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id);
          });
        },
        { rootMargin: "-50% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

const Section = ({ id, children, className = "" }: PropsWithChildren<{ id: SectionId; className?: string }>) => (
  <section id={id} className={`scroll-mt-24 py-20 md:py-28 ${className}`}>{children}</section>
);

const Glass = ({ className = "", children }: PropsWithChildren<{ className?: string }>) => (
  <div className={"backdrop-blur-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-xl " + className}>
    {children}
  </div>
);

const Badge = ({ children }: PropsWithChildren) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide border-zinc-300/60 dark:border-zinc-700/60">
    {children}
  </span>
);

// Simple inline Vietnam flag (SVG) so không cần thư viện ngoài
function VNFlag({ className = "h-4 w-6 rounded-[2px] ring-1 ring-black/10 dark:ring-white/10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={className}
      role="img"
      aria-label="Vietnam flag"
      focusable="false"
    >
      <path fill="#da251d" d="M0 0h640v480H0z" />
      <path
        fill="#ff0"
        d="m320 120 35.3 108.6h114.7l-92.8 67.4 35.3 108.6-92.5-67.9-92.5 67.9 35.3-108.6-92.8-67.4h114.7z"
      />
    </svg>
  );
}

// =============== Beautiful animated background ===============
function DynamicBackground() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* star/particle layer */}
      <ParticlesCanvas />

      {/* aurora/conic gradient layer */}
      <div className="absolute left-1/2 -top-1/3 h-[160%] w-[160%] -translate-x-1/2 rounded-full
        bg-[conic-gradient(from_0deg,rgba(99,102,241,.28),rgba(236,72,153,.28),rgba(34,211,238,.28),rgba(99,102,241,.28))]
        blur-2xl opacity-70 animate-[spin_40s_linear_infinite]" />

      {/* soft gradient blobs (with motion) */}
      <motion.div
        className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,.35),transparent)]"
        animate={reduce ? {} : { x: [0, 40, -20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,.28),transparent)]"
        animate={reduce ? {} : { x: [0, -30, 20, 0], y: [0, 30, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,.25),transparent)]"
        animate={reduce ? {} : { x: [0, 20, -10, 0], y: [0, 15, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* subtle noise */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.4\'/></svg>')]" />
    </div>
  );
}

function ParticlesCanvas() {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.scale(DPR, DPR);
    }

    const N = 60;
    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number };
    let ps: P[] = [];

    function reset() {
      ps = new Array(N).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.25 - Math.random() * 0.35,
        a: 0.3 + Math.random() * 0.5,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      raf = requestAnimationFrame(step);
    }

    const ro = new ResizeObserver(() => { resize(); reset(); });
    ro.observe(canvas);
    resize(); reset(); step();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

function AnimatedUnderline({ active }: { active: boolean }) {
  return (
    <motion.span
      layoutId="nav-underline"
      className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400"
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ opacity: active ? 1 : 0 }}
    />
  );
}

// =============== Header (appears on scroll) ===============
function Header({ active, theme, setTheme }: { active: SectionId; theme: "light" | "dark"; setTheme: (t: "light" | "dark") => void }) {
  const [mobile, setMobile] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed top-4 left-1/2 z-50 w-[min(1100px,92vw)] -translate-x-1/2 transition-all duration-300 ${show ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-6 pointer-events-none"}`}>
      <Glass className="px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <a href="#home" className="group inline-flex items-center gap-2" aria-label="Go to home">
            <img
              src="/avatar.png"
              alt="TonyDeveloper avatar"
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/20 dark:ring-zinc-800/60 shadow-md"
            />
            <div className="font-semibold tracking-tight">
              <span className="hidden sm:inline">TonyDeveloper</span>
              <span className="sm:hidden">TD</span>
              <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">Portfolio</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1 relative">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active === s.id
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
              >
                <span className="relative">
                  {s.label}
                  <AnimatedUnderline active={active === s.id} />
                </span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300/70 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/40"
              aria-label="Toggle theme"
              title="Toggle theme (press +)"
            >
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-300/70 dark:border-zinc-700/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/40"
              onClick={() => setMobile((v) => !v)}
              aria-expanded={mobile}
              aria-label="Toggle navigation"
            >
              {mobile ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobile && (
          <div className="mt-3 grid gap-1 md:hidden">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setMobile(false)}
                className={`px-3 py-2 text-sm rounded-lg ${active === s.id
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                  }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </Glass>
    </header>
  );
}

// =============== Hero with micro‑interaction ===============
function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollY, [0, 200], [1, reduce ? 1 : 0]);
  return (
    <Section id="home" className="relative pt-20 md:pt-28">
      <div className="relative z-10 text-center">
        <motion.div style={{ y, opacity }}>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 dark:from-white dark:via-zinc-200 dark:to-white bg-clip-text text-transparent"
          >
            Creative Developer
          </motion.h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
            I craft delightful web & mobile experiences with performance,
            accessibility, and innovation at the core.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-medium text-white
             bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 shadow-lg transition-all duration-300
             hover:shadow-[0_14px_50px_rgba(99,102,241,.45)] hover:-translate-y-0.5 hover:scale-[1.04]
             before:absolute before:inset-0 before:rounded-2xl before:bg-white/20 before:opacity-0
             before:transition-opacity group-hover:before:opacity-10"
            >
              View Projects <ArrowRight size={20} className="transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-2xl border px-6 py-3 border-white/25 text-white/90
             transition-all duration-300 hover:bg-white/10 hover:text-white
             hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,255,255,.15)]"
            >
              Contact Me <PhoneCall size={20} />
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 text-zinc-300">
            <a href="https://github.com/TonyDuongg" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white transition"><Github size={22} /></a>
            <a href="https://www.linkedin.com/in/tonyduongg" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition"><Linkedin size={22} /></a>
            <a href="mailto:nguyenhaiduong052005@gmail.com" aria-label="Email" className="hover:text-white transition"><Mail size={22} /></a>
          </div>
        </motion.div>

        <div className="mt-10 flex items-center justify-center text-zinc-400">
          <ChevronDown className="animate-bounce" size={22} />
        </div>
      </div>
    </Section>
  );
}

function About() {
  return (
    <Section id="about">
      <div className="mx-auto grid w-[min(1100px,92vw)] grid-cols-1 gap-6 md:grid-cols-3">
        <Glass className="md:col-span-2 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">About Me</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300">
            I am a developer who enjoys building intuitive interfaces and robust systems.
            I love blending motion, design systems, and clean code to create memorable products.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {"Front-end • React • Next.js • TypeScript • Tailwind • Node.js • Figma • Accessibility".split(" • ").map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 px-5 py-2.5 text-white font-medium shadow transition-all duration-300 hover:shadow-[0_12px_40px_rgba(99,102,241,.35)] hover:scale-[1.03] hover:-translate-y-0.5">
              <Download size={18} /> Download CV
            </a>
            <a href="#projects" className="group inline-flex items-center gap-2 rounded-2xl border border-zinc-300/70 px-5 py-2.5 text-zinc-800 dark:text-zinc-100 dark:border-zinc-700/60 transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-[1.02] hover:-translate-y-0.5">
              <Sparkles size={18} /> See work
            </a>
          </div>
        </Glass>
        <Glass className="p-6 md:p-8">
          <h3 className="text-xl font-semibold tracking-tight">Quick Facts</h3>
          <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-300">
            <li className="flex items-center gap-2"><VNFlag /> Based in: VietNam</li>
            <li className="flex items-center gap-2"><Code2 size={18} /> Favorite stack: React + Node</li>
            <li className="flex items-center gap-2"><Handshake size={18} /> Open to: Internships & Freelance</li>
          </ul>
        </Glass>
      </div>
    </Section>
  );
}

// =============== Skills (lazy Recharts remains) ===============
function LazyRadar() {
  const [lib, setLib] = useState<any>(null);
  useEffect(() => {
    import("recharts").then((m) => setLib(m));
  }, []);
  if (!lib)
    return <div className="h-72 w-full rounded-xl animate-pulse bg-zinc-200/40 dark:bg-zinc-800/40" />;
  const { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } = lib;
  return (
    <div className="mt-6 h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={skillsData} outerRadius={90}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
          <Radar dataKey="A" stroke="currentColor" fill="currentColor" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Skills() {
  return (
    <Section id="skills">
      <div className="mx-auto w-[min(1100px,92vw)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Glass className="p-6 md:p-8 md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Skills Radar</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">A quick snapshot of my strengths.</p>
            <LazyRadar />
          </Glass>
          <Glass className="p-6 md:p-8">
            <h3 className="text-xl font-semibold tracking-tight">Core Principles</h3>
            <ul className="mt-3 space-y-2 text-zinc-600 dark:text-zinc-300">
              <li>Accessibility-first</li>
              <li>Performance and DX</li>
              <li>Clean architecture</li>
              <li>Meaningful animations</li>
            </ul>
          </Glass>
        </div>
      </div>
    </Section>
  );
}

// =============== GitHub integration ===============
async function fetchGithubPinned(username: string): Promise<Project[]> {
  try {
    // Use serverless function if available (keeps token secret)
    const r = await fetch(`/api/github-pinned?user=${encodeURIComponent(username)}`);
    if (r.ok) {
      const json = await r.json();
      return json.items.map((it: any) => ({
        title: it.name,
        desc: it.description || "",
        tags: it.topics?.length ? it.topics : [it.language].filter(Boolean),
        link: it.url,
        role: "Owner",
        year: Number(new Date(it.createdAt).getFullYear()),
        stars: it.stars || it.stargazerCount || 0,
        source: "github",
      }));
    }
  } catch { }
  return [];
}

async function fetchGithubTopStarred(username: string): Promise<Project[]> {
  try {
    const r = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!r.ok) return [];
    const arr = await r.json();
    return arr
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((it: any) => ({
        title: it.name,
        desc: it.description || "",
        tags: [it.language].filter(Boolean),
        link: it.html_url,
        role: "Owner",
        year: Number(new Date(it.created_at).getFullYear()),
        stars: it.stargazers_count || 0,
        source: "github",
      }));
  } catch {
    return [];
  }
}

function difficultyFromStars(stars = 0): Difficulty {
  if (stars >= 200) return "Hard";
  if (stars >= 50) return "Medium";
  return "Easy";
}

// =============== Projects with advanced filters ===============
function Projects() {
  const GH_USER = (import.meta as any).env?.VITE_GH_USERNAME as string | undefined;

  const [localProjects] = useState<Project[]>(projectsSeed);
  const [ghProjects, setGhProjects] = useState<Project[]>([]);
  const [useGithub, setUseGithub] = useState<boolean>(Boolean(GH_USER));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!GH_USER) return;
      let items = await fetchGithubPinned(GH_USER);
      if (!items.length) items = await fetchGithubTopStarred(GH_USER);
      if (!cancelled) setGhProjects(items);
    }
    load();
    return () => { cancelled = true; };
  }, [GH_USER]);

  const all = useMemo(() => {
    const merged = [...localProjects, ...(useGithub ? ghProjects : [])];
    return merged.map(p => ({ ...p, difficulty: difficultyFromStars(p.stars) as Difficulty }));
  }, [localProjects, ghProjects, useGithub]);

  const years = useMemo(() => Array.from(new Set(all.map(p => p.year))).sort((a, b) => b - a), [all]);
  const roles: Project["role"][] = ["Owner", "Contributor", "Student", "Freelance"];
  const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

  // filters
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"All" | Project["role"]>("All");
  const [year, setYear] = useState<number | "All">("All");
  const [diff, setDiff] = useState<"All" | Difficulty>("All");
  const [sort, setSort] = useState<"Newest" | "Oldest" | "Most starred" | "A-Z">("Most starred");

  const filtered = all
    .filter(p => (role === "All" || p.role === role))
    .filter(p => (year === "All" || p.year === year))
    .filter(p => (diff === "All" || (difficultyFromStars(p.stars) === diff)))
    .filter(p => (p.title + p.desc + p.tags.join(" ")).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      switch (sort) {
        case "Newest": return b.year - a.year;
        case "Oldest": return a.year - b.year;
        case "A-Z": return a.title.localeCompare(b.title);
        default: return (b.stars || 0) - (a.stars || 0);
      }
    });

  return (
    <Section id="projects">
      <div className="mx-auto w-[min(1100px,92vw)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Selected Projects</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">Advanced filters + GitHub auto import.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="accent-indigo-500" checked={useGithub} onChange={(e) => setUseGithub(e.target.checked)} />
              <span>Include GitHub</span>
            </label>
            <a href="https://github.com/TonyDuongg" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 border-zinc-300/70 dark:border-zinc-700/60 transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,.18)]">
              View GitHub <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-6">
          <input
            aria-label="Search projects"
            className="md:col-span-2 w-full rounded-xl border border-zinc-300/70 bg-white/70 px-3 py-2 outline-none placeholder:text-zinc-400 dark:border-zinc-700/60 dark:bg-zinc-900/70"
            placeholder="Search title, tech, description…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select label="Role" value={role} onChange={(v) => setRole(v as any)} options={["All", ...roles]} />
          <Select label="Difficulty" value={diff} onChange={(v) => setDiff(v as any)} options={["All", ...difficulties]} />
          <Select label="Year" value={year} onChange={(v) => setYear(v === "All" ? "All" : Number(v))} options={["All", ...years]} />
          <Select label="Sort" value={sort} onChange={(v) => setSort(v as any)} options={["Most starred", "Newest", "Oldest", "A-Z"]} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((p, i) => (
            <motion.a
              key={`${p.title}-${i}`}
              href={p.link}
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative"
            >
              <Glass className="p-6 md:p-8 overflow-hidden ring-1 ring-transparent transition-all duration-300 group-hover:ring-indigo-400/30 group-hover:shadow-xl">
                {/* sparkle lottie on hover (optional) */}
                <div className="pointer-events-none absolute right-4 top-4 h-10 w-10 opacity-0 transition group-hover:opacity-100">
                  <LottieLoader src="/lottie/sparkle.json" className="h-10 w-10" />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{p.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {p.stars ? (<><Star size={16} className="text-yellow-500" /> {p.stars}</>) : null}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="rounded-lg border px-2 py-1 border-zinc-300/70 dark:border-zinc-700/60">{p.role}</span>
                  <span className="rounded-lg border px-2 py-1 border-zinc-300/70 dark:border-zinc-700/60">{p.year}</span>
                  {p.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <motion.div aria-hidden className="mt-6 h-36 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 grid place-items-center text-zinc-500" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
                  Live preview area
                </motion.div>
              </Glass>
            </motion.a>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-zinc-500">No projects match your filters.</div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: any; onChange: (v: string) => void; options: Array<string | number> }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-zinc-300/70 bg-white/70 px-3 py-2 text-sm dark:border-zinc-700/60 dark:bg-zinc-900/70">
      <span className="min-w-[72px] text-zinc-500">{label}</span>
      <select value={value as any} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent outline-none">
        {options.map((o) => (
          <option key={String(o)} value={o as any}>
            {String(o)}
          </option>
        ))}
      </select>
    </label>
  );
}

function Experience() {
  const items = [
    { icon: <Briefcase size={20} />, title: "Freelancer", org: "From App Freelance (Upwork,...etc)", time: "2024 – 2025", desc: "Built UI components, improved Lighthouse score by 25%." },
    { icon: <GraduationCap size={20} />, title: "Software Engineer", org: "FPT University", time: "2023 – 2027", desc: "Focused on web engineering, HCI, and software design." },
  ];
  return (
    <Section id="experience">
      <div className="mx-auto w-[min(1100px,92vw)]">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Experience & Education</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <Glass key={i} className="p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                  {it.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{it.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">{it.org} • {it.time}</p>
                </div>
              </div>
              <p className="mt-3 text-zinc-600 dark:text-zinc-300">{it.desc}</p>
            </Glass>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact">
      <div className="mx-auto w-[min(900px,92vw)]">
        <Glass className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Contact</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">Have a question or a project in mind? Let's talk.</p>
          <form
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const data: any = Object.fromEntries(new FormData(form) as any);
              if (data._gotcha) { alert("Spam detected."); return; }
              try {
                const res = await fetch("https://formspree.io/f/xpwlkyvr", {
                  method: "POST",
                  headers: { Accept: "application/json", "Content-Type": "application/json" },
                  body: JSON.stringify({ name: data.name, email: data.email, message: data.message })
                });
                const json = await res.json().catch(() => null);
                if (res.ok) { alert("Cảm ơn bạn! Mình sẽ phản hồi sớm."); form.reset(); }
                else { console.error("Formspree error:", res.status, json); alert(`Gửi thất bại (${res.status}). ${json?.errors?.[0]?.message ?? ""}`); }
              } catch (err) { console.error(err); alert("Có lỗi mạng. Thử lại giúp mình nhé."); }
            }}
          >
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Name</label>
              <input name="name" required className="mt-1 w-full rounded-xl border border-zinc-300/70 bg-white/70 p-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700/60 dark:bg-zinc-900/70" placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Email</label>
              <input type="email" name="email" required className="mt-1 w-full rounded-xl border border-zinc-300/70 bg-white/70 p-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700/60 dark:bg-zinc-900/70" placeholder="you@example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-zinc-600 dark:text-zinc-400">Message</label>
              <textarea name="message" required rows={4} className="mt-1 w-full rounded-xl border border-zinc-300/70 bg-white/70 p-3 outline-none placeholder:text-zinc-400 dark:border-zinc-700/60 dark:bg-zinc-900/70" placeholder="Tell me about your idea..." />
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              <p className="text-xs text-zinc-500">Press <kbd className="rounded bg-zinc-200 px-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">k</kbd> to open command palette.</p>
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-white shadow-lg transition hover:shadow-xl dark:bg-white dark:text-zinc-900 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/40">
                Send <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </Glass>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
      <div className="mx-auto w-[min(1100px,92vw)]">
        <p>© {new Date().getFullYear()} TonyDeveloper. Built with React, Tailwind, and a sprinkle of motion.</p>
      </div>
    </footer>
  );
}

function HeadMeta() {
  useEffect(() => {
    document.title = "TonyDeveloper — Portfolio";
    const meta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!m) { m = document.createElement("meta"); m.setAttribute("name", name); document.head.appendChild(m); }
      m.setAttribute("content", content);
    };
    const prop = (property: string, content: string) => {
      let m = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!m) { m = document.createElement("meta"); m.setAttribute("property", property); document.head.appendChild(m); }
      m.setAttribute("content", content);
    };
    meta("description", "Portfolio of TonyDeveloper — React, Node, TypeScript.");
    meta("theme-color", "#0b0b0e");
    prop("og:title", "TonyDeveloper — Portfolio");
    prop("og:description", "Creative developer crafting fast, accessible apps.");
    prop("og:type", "website");
    prop("og:image", "/api/og?title=TonyDeveloper");
    prop("twitter:card", "summary_large_image");
    prop("twitter:title", "TonyDeveloper — Portfolio");
    prop("twitter:description", "Creative developer crafting fast, accessible apps.");
    prop("twitter:image", "/api/og?title=TonyDeveloper");
  }, []);
  return null;
}

export default function PortfolioTemplate() {
  const { theme, setTheme } = useTheme();
  const active = useScrollSpy(SECTIONS.map((s) => s.id));
  const paletteRef = useRef<HTMLDivElement | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  // Top scroll progress & back-to-top
  const [pct, setPct] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max ? (h.scrollTop / max) * 100 : 0);
      setShowTop(h.scrollTop > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "+") { e.preventDefault(); setTheme(theme === "dark" ? "light" : "dark"); }
      if (e.key === "k") { e.preventDefault(); setPaletteOpen((v) => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme, setTheme]);

  const paletteItems = useMemo(() => SECTIONS.map((s) => ({ id: s.id, label: s.label })), []);
  const filteredPalette = paletteItems.filter((i) => i.label.toLowerCase().includes(paletteQuery.toLowerCase()));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0e] text-zinc-100 antialiased">

      {/* Scroll progress bar */}
      <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400" style={{ width: `${pct}%` }} />
      </div>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-[60] inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white backdrop-blur shadow-lg ring-1 ring-white/10 hover:bg-white/20"
          aria-label="Back to top"
        >
          <ChevronUp size={22} />
        </button>
      )}

      <HeadMeta />
      <DynamicBackground />
      <Header active={active} theme={theme} setTheme={setTheme} />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />

      {paletteOpen && (
        <div
          ref={paletteRef}
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === paletteRef.current) setPaletteOpen(false); }}
        >
          <div className="w-[min(700px,95vw)] rounded-2xl bg-white p-4 shadow-2xl dark:bg-zinc-900">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-300/70 bg-white px-3 py-2 dark:border-zinc-700/60 dark:bg-zinc-900">
              <SearchIcon />
              <input
                autoFocus
                className="w-full bg-transparent outline-none placeholder:text-zinc-400"
                placeholder="Type to jump to a section…"
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") setPaletteOpen(false); }}
              />
              <kbd className="rounded bg-zinc-200 px-1 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">esc</kbd>
            </div>
            <ul className="mt-2 max-h-[50vh] overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              {filteredPalette.map((it) => (
                <li key={it.id}>
                  <button
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => { document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth" }); setPaletteOpen(false); }}
                  >
                    <span>{it.label}</span>
                    <ArrowRight size={14} />
                  </button>
                </li>
              ))}
              {filteredPalette.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-zinc-500">No matches. Try Home, Projects, Contact…</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-500">
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function LottieLoader({
  src,
  className,
  fallback,
}: { src: string; className?: string; fallback?: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    fetch(src)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => { if (mounted) { setData(j); setOk(true); } })
      .catch(() => setOk(false));
    return () => { mounted = false; };
  }, [src]);

  if (!ok || !data) return fallback ? <>{fallback}</> : null;
  return <Lottie animationData={data} loop autoplay className={className} />;
}
