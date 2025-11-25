"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  startTransition,
  memo,
  useId,
} from "react";
import {
  BarChart3,
  FileText,
  Users,
  Archive,
  Settings,
  User as UserIcon,
  LogOut,
  Menu,
  ChevronDown,
  CloudUpload,
  Eye,
  Download,
  Trash2,
  Plus,
  ArrowDownToLine,
  Search,
  Command,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

/** ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------ */
type PageId = "dashboard" | "invoices" | "clients" | "reports" | "settings";

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

interface StatCard {
  value: number;
  label: string;
  color: string;
  bg: string;
  trend?: number;
  icon?: React.ComponentType<any>;
}

interface Activity {
  id: string;
  type: "success" | "warning" | "error" | "info";
  message: string;
  time: string;
}

/** ------------------------------------------------------------
 * Utilities (no-throw localStorage with schema)
 * ------------------------------------------------------------ */
const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const val = JSON.parse(raw);
      if (typeof fallback === "boolean" && typeof val === "boolean") return val as T;
      if (typeof fallback === "string" && typeof val === "string") return val as T;
      if (Array.isArray(fallback) && Array.isArray(val)) return val as T;
      return fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, val: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* ignore quota/security errors */
    }
  },
};

/** ------------------------------------------------------------
 * Spring Animation Hook (Physics-based)
 * ------------------------------------------------------------ */
function useSpring(target: number, config = { tension: 170, friction: 26 }) {
  const [current, setCurrent] = useState(target);
  const velocity = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.064); // cap at 64ms
      lastTime = time;

      const spring = config.tension * (target - current);
      const damper = config.friction * velocity.current;
      const acceleration = spring - damper;

      velocity.current += acceleration * dt;
      const next = current + velocity.current * dt;

      setCurrent(next);

      // Continue if not settled
      if (Math.abs(velocity.current) > 0.01 || Math.abs(target - next) > 0.01) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, current, config.tension, config.friction]);

  return current;
}

/** ------------------------------------------------------------
 * Stagger Animation Hook
 * ------------------------------------------------------------ */
function useStaggeredMount(count: number, delay = 50) {
  const [mounted, setMounted] = useState<number[]>([]);

  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setMounted((prev) => [...prev, i]);
        }, i * delay)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [count, delay]);

  return mounted;
}


/** ------------------------------------------------------------
 * Micro router synced to URL hash
 * ------------------------------------------------------------ */
function useHashRoute(defaultPage: PageId = "dashboard") {
  const parse = (): PageId => {
    const id = (location.hash.replace(/^#/, "") || defaultPage) as PageId;
    return (["dashboard", "invoices", "clients", "reports", "settings"] as const).includes(id)
      ? id
      : defaultPage;
  };

  const [page, setPage] = useState<PageId>(() => parse());

  useLayoutEffect(() => {
    const onHash = () => setPage(parse());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((next: PageId) => {
    startTransition(() => {
      if (location.hash !== `#${next}`) location.hash = `#${next}`;
    });
  }, []);

  return { page, navigate };
}

/** ------------------------------------------------------------
 * Event bus
 * ------------------------------------------------------------ */
const bus = {
  emit(name: string, detail?: any) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  },
  on(name: string, cb: (e: CustomEvent) => void) {
    const handler = cb as EventListener;
    window.addEventListener(name, handler as any);
    return () => window.removeEventListener(name, handler as any);
  },
};

/** ------------------------------------------------------------
 * Lazy page (code-split)
 * ------------------------------------------------------------ */
const Invoices = lazy(() => import("./Invoices"));

/** ------------------------------------------------------------
 * Static data with trends & icons
 * ------------------------------------------------------------ */
const STATS: StatCard[] = [
  { value: 18, label: "Accepted by FTA", color: "text-emerald-700", bg: "bg-gradient-to-br from-emerald-50 to-emerald-100", trend: 12, icon: CheckCircle },
  { value: 6, label: "Pending Validation", color: "text-amber-700", bg: "bg-gradient-to-br from-amber-50 to-amber-100", trend: -3, icon: Clock },
  { value: 4, label: "Failed / Rejected", color: "text-rose-700", bg: "bg-gradient-to-br from-rose-50 to-rose-100", trend: -8, icon: XCircle },
  { value: 23, label: "Submitted to ASP", color: "text-blue-700", bg: "bg-gradient-to-br from-blue-50 to-blue-100", trend: 15, icon: CloudUpload },
  { value: 57, label: "Archived", color: "text-purple-700", bg: "bg-gradient-to-br from-purple-50 to-purple-100", trend: 5, icon: Archive },
] as const;

const LATEST = [
  { name: "x34-0M sML", time: "02:49 PM", date: "20 August", status: "success" as const },
  { name: "xlsx.xlsx", time: "01:36 PM", date: "20 August", status: "processing" as const },
  { name: "xlsx.xlsx", time: "12:05 PM", date: "20 August", status: "success" as const },
] as const;

/** ------------------------------------------------------------
 * Menu with icons
 * ------------------------------------------------------------ */
const MENU = [
  { icon: BarChart3, label: "Dashboard", id: "dashboard", shortcut: "g → d" },
  { icon: FileText, label: "Invoices", id: "invoices", shortcut: "g → i" },
  { icon: Users, label: "Clients", id: "clients", shortcut: "g → c" },
  { icon: Archive, label: "Reports", id: "reports", shortcut: "g → r" },
  { icon: Settings, label: "Settings", id: "settings", shortcut: "g → s" },
] as const satisfies ReadonlyArray<{ icon: any; label: string; id: PageId; shortcut: string }>;

/** ------------------------------------------------------------
 * Command Palette Component
 * ------------------------------------------------------------ */
const CommandPalette = memo(({ isOpen, onClose, navigate }: any) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MENU.filter(
      (m) => m.label.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
    );
  }, [search]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-top-8 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for pages, commands..."
            className="flex-1 outline-none text-lg bg-transparent"
          />
          <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No results found</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="text-xs text-slate-500 font-mono">{item.shortcut}</div>
                  </div>
                  <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                    ⏎
                  </kbd>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});

CommandPalette.displayName = "CommandPalette";

/** ------------------------------------------------------------
 * Activity Feed Component
 * ------------------------------------------------------------ */
const ActivityFeed = memo(() => {
  const [activities, setActivities] = useState<Activity[]>([
    { id: "1", type: "success", message: "Invoice #1234 accepted by FTA", time: "2m ago" },
    { id: "2", type: "info", message: "New client registration: TechCorp Inc", time: "5m ago" },
    { id: "3", type: "warning", message: "Invoice #1235 pending validation", time: "12m ago" },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const messages = [
      { type: "success" as const, message: "Invoice processed successfully" },
      { type: "info" as const, message: "New document uploaded" },
      { type: "warning" as const, message: "Validation in progress" },
      { type: "success" as const, message: "Payment confirmed" },
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setActivities((prev) => [
        {
          id: Date.now().toString(),
          type: msg.type,
          message: msg.message,
          time: "Just now",
        },
        ...prev.slice(0, 9),
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-900">Live Activity</h3>
        <div className="flex-1" />
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        {activities.map((activity, idx) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all animate-in fade-in slide-in-from-left-4"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="mt-0.5">{getIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 font-medium">{activity.message}</p>
              <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ActivityFeed.displayName = "ActivityFeed";

/** ------------------------------------------------------------
 * Animated Stat Card with 3D Transform
 * ------------------------------------------------------------ */
const StatCard = memo(
  ({ stat, index, onClick }: { stat: StatCard; index: number; onClick: () => void }) => {
    const [hover, setHover] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const animatedValue = useSpring(stat.value, { tension: 120, friction: 14 });
    const Icon = stat.icon || BarChart3;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x, y });
    };

    return (
      <div
        className={`${stat.bg} rounded-2xl p-6 border border-slate-200/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-in fade-in slide-in-from-bottom-4`}
        style={{
          animationDelay: `${index * 100}ms`,
          transform: hover
            ? `perspective(1000px) rotateX(${-mousePos.y * 10}deg) rotateY(${mousePos.x * 10}deg) translateZ(20px)`
            : "none",
          transition: "transform 0.1s ease-out",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          setMousePos({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shadow-lg`}>
            <Icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          {stat.trend !== undefined && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                stat.trend > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {stat.trend > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(stat.trend)}%
            </div>
          )}
        </div>

        <div className={`text-4xl font-black ${stat.color} mb-2 tabular-nums`}>
          {Math.round(animatedValue)}
        </div>
        <div className="text-sm font-semibold text-slate-600">{stat.label}</div>

        {hover && (
          <div className="mt-4 pt-4 border-t border-slate-300/50 text-xs text-slate-500 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4" />
            Click for details
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

/** ------------------------------------------------------------
 * Glassmorphic Quick Action Button
 * ------------------------------------------------------------ */
const QuickActionButton = memo(
  ({
    icon: Icon,
    title,
    subtitle,
    gradient,
    onClick,
  }: {
    icon: any;
    title: string;
    subtitle: string;
    gradient: string;
    onClick: () => void;
  }) => {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleClick = (e: React.MouseEvent) => {
      onClick();
      // Particle burst effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x,
        y,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
    };

    return (
      <button
        onClick={handleClick}
        className="relative flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-xl rounded-2xl hover:bg-white border-2 border-slate-200 hover:border-slate-300 group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        />

        <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
          <Icon className="w-10 h-10 text-white" />
        </div>

        <div className="text-center relative z-10">
          <div className="font-bold text-slate-900 text-lg mb-1">{title}</div>
          <div className="text-xs text-slate-600">{subtitle}</div>
        </div>

        {particles.map((p, i) => (
          <div
            key={p.id}
            className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping"
            style={{
              left: p.x,
              top: p.y,
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </button>
    );
  }
);

QuickActionButton.displayName = "QuickActionButton";

/** ------------------------------------------------------------
 * Perf probe (dev-only)
 * ------------------------------------------------------------ */
function mark(name: string) {
  if (process.env.NODE_ENV === "production") return () => {};
  const t0 = performance.now();
  return () => console.info(`[perf] ${name}: ${(performance.now() - t0).toFixed(2)}ms`);
}

/** ------------------------------------------------------------
 * Shell Component - THE LEGENDARY DASHBOARD
 * ------------------------------------------------------------ */
export default function Shell({ user, onLogout }: DashboardProps) {
  const { page, navigate } = useHashRoute("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() =>
    storage.get("if.sidebarCollapsed", false)
  );
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState<string>("Past 7 days");
  const [selectedBusiness, setSelectedBusiness] = useState<string>("Select Business");
  const [showShortcutHint, setShowShortcutHint] = useState(true);

  const mountedCards = useStaggeredMount(STATS.length, 80);

  useEffect(() => storage.set("if.sidebarCollapsed", sidebarCollapsed), [sidebarCollapsed]);

  // Keyboard shortcuts with command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Command palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((v) => !v);
        return;
      }

      // ESC to close command palette
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
        return;
      }

      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      // Focus search with /
      if (e.key === "/") {
        e.preventDefault();
        bus.emit("if.focus-search");
      }

      // Navigation shortcuts: g + key
      if (e.key.toLowerCase() === "g") {
        let buffer = "";
        const onNext = (ev: KeyboardEvent) => {
          buffer += ev.key.toLowerCase();
          if (buffer === "d") navigate("dashboard");
          if (buffer === "i") navigate("invoices");
          if (buffer === "c") navigate("clients");
          if (buffer === "r") navigate("reports");
          if (buffer === "s") navigate("settings");
          window.removeEventListener("keydown", onNext);
        };
        window.addEventListener("keydown", onNext, { once: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // Hide shortcut hint after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowShortcutHint(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const active = useMemo(() => MENU.find((m) => m.id === page), [page]);

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Keyboard Shortcut Hint */}
      {showShortcutHint && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl p-4 shadow-lg animate-in slide-in-from-top-4 fade-in">
          <div className="flex items-center gap-3">
            <Command className="w-5 h-5" />
            <span className="font-semibold">Pro Tip:</span>
            <span className="text-sm">
              Press{" "}
              <kbd className="px-2 py-1 bg-white/20 rounded font-mono text-xs">⌘ K</kbd> to
              open command palette
            </span>
            <button
              onClick={() => setShowShortcutHint(false)}
              className="ml-auto text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          type="button"
          onClick={() =>
            setTimePeriod((p) => (p === "Past 7 days" ? "Past 30 days" : "Past 7 days"))
          }
          className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
        >
          <Clock className="w-5 h-5 text-slate-600 group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-slate-700">{timePeriod}</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>

        <button
          type="button"
          onClick={() =>
            setSelectedBusiness((b) =>
              b === "Select Business" ? "TechCorp Industries" : "Select Business"
            )
          }
          className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <span className="font-bold text-slate-700">{selectedBusiness}</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Stats Grid with 3D Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {STATS.map((stat, i) =>
          mountedCards.includes(i) ? (
            <StatCard
              key={i}
              stat={stat}
              index={i}
              onClick={() => navigate("invoices")}
            />
          ) : (
            <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
          )
        )}
      </div>

      {/* Quick Actions & Activity Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-200 p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h3 className="text-2xl font-black text-slate-900">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <QuickActionButton
              icon={CloudUpload}
              title="Upload"
              subtitle="Import & validate"
              gradient="from-teal-500 to-emerald-600"
              onClick={() => navigate("invoices")}
            />
            <QuickActionButton
              icon={Plus}
              title="Create"
              subtitle="New document"
              gradient="from-blue-500 to-purple-600"
              onClick={() => navigate("invoices")}
            />
          </div>

          <div className="flex items-center justify-center pt-4">
            <button
              type="button"
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowDownToLine className="w-5 h-5" />
              Download Templates
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </div>

      {/* Processing Progress & Latest Uploads */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Processing Progress
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-700">Monthly Limit</span>
                <span className="text-lg font-black text-slate-900">23/100</span>
              </div>
              <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out animate-in slide-in-from-left"
                  style={{ width: "23%" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-600">18</div>
                <div className="text-xs text-slate-600 font-semibold">Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-amber-600">6</div>
                <div className="text-xs text-slate-600 font-semibold">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-rose-600">4</div>
                <div className="text-xs text-slate-600 font-semibold">Failed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Uploads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Latest Uploads
          </h3>

          <div className="space-y-3">
            {LATEST.map((u, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-300 hover:scale-102 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 mb-1">{u.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {u.time} • {u.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const stop = mark("render");

  return (
    <>
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        navigate={navigate}
      />

      <div className="flex h-dvh bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 text-slate-900">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarCollapsed ? "w-20" : "w-72"
          } bg-white/80 backdrop-blur-xl border-r border-slate-200 transition-all duration-500 ease-out flex flex-col shadow-2xl`}
          aria-label="Main navigation"
        >
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src="/Finvise_Logo2.png"
                alt="InvoiceFlow"
                className={`object-contain transition-all duration-300 ${
                  sidebarCollapsed ? "w-12 h-12" : "w-12 h-12"
                }`}
              />
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Finvise
              </span>
            )}
          </div>

          <nav className="flex-1 p-3 overflow-y-auto space-y-2">
            {MENU.map((item, idx) => {
              const Icon = item.icon;
              const isActive = page === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                      : "text-slate-700 hover:bg-slate-100 hover:scale-102"
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
                  )}
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 transition-transform ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <span className="text-sm font-bold">{item.label}</span>
                      {!isActive && (
                        <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 font-mono">
                          {item.shortcut}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300 hover:scale-102 group"
            >
              <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              {!sidebarCollapsed && <span className="text-sm font-bold">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 py-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarCollapsed((v) => !v)}
                  className="hover:bg-white/20 p-3 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-black flex items-center gap-3">
                  {active?.label ?? "Dashboard"}
                  {page === "dashboard" && (
                    <span className="text-xs font-semibold px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full animate-pulse">
                      LIVE
                    </span>
                  )}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Command className="w-4 h-4" />
                  <span className="text-sm font-semibold">⌘K</span>
                </button>

                <div className="hidden md:block text-right">
                  <div className="text-sm font-bold">{user.name || "User"}</div>
                  <div className="text-xs opacity-80">{user.email}</div>
                </div>

                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                  <UserIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-8">
            {page === "dashboard" && renderDashboard()}

            {page === "invoices" && (
              <Suspense
                fallback={
                  <div className="grid gap-6">
                    <div className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
                    <div className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
                  </div>
                }
              >
                <Invoices onFocusRequestEvent="if.focus-search" />
              </Suspense>
            )}

            {page !== "dashboard" && page !== "invoices" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-slate-200">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                    {active && <active.icon className="w-12 h-12 text-white" />}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-3">
                    {active?.label ?? "Page"}
                  </h2>
                  <p className="text-slate-600 mb-6">
                    This page is under construction. Check back soon!
                  </p>
                  <button
                    onClick={() => navigate("dashboard")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </main>
          </div>
        {(stop(), null)}
      </div>


      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }

        .scrollbar-track-slate-100::-webkit-scrollbar-track {
          background-color: #f1f5f9;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-left-4 {
          from {
            transform: translateX(-1rem);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-top-4 {
          from {
            transform: translateY(-1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-top-8 {
          from {
            transform: translateY(-2rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-in {
          animation-duration: 0.5s;
          animation-fill-mode: both;
        }

        .fade-in {
          animation-name: fade-in;
        }

        .slide-in-from-bottom-4 {
          animation-name: slide-in-from-bottom-4;
        }

        .slide-in-from-left-4 {
          animation-name: slide-in-from-left-4;
        }

        .slide-in-from-top-4 {
          animation-name: slide-in-from-top-4;
        }

        .slide-in-from-top-8 {
          animation-name: slide-in-from-top-8;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
}