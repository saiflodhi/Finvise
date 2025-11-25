"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useDeferredValue,
  useTransition,
  useCallback,
  memo,
} from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  Download,
  Eye,
  Archive,
  Trash2,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Edit2,
  Copy,
  Send,
  RefreshCw,
  TrendingUp,
  Calendar,
  Users,
  Tag,
  Zap,
  Grid3x3,
  List,
  BarChart3,
  Sparkles,
  FileDown,
  Columns,
  SortAsc,
  SortDesc,
  MousePointer2,
  Play,
  Pause,
} from "lucide-react";

/** ============================================================================
 * Types & Data Model
 * ============================================================================ */
export type FtaStatus = "Approved" | "Pending" | "Rejected" | "Validated";
export type RowStatus = "sent" | "validated" | "pending" | "rejected";
export type ViewMode = "table" | "kanban" | "analytics";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  customerName: string;
  amount: string;
  invoiceDate: string;
  status: RowStatus;
  ftaStatus: FtaStatus;
  validationScore: number;
  notes?: string;
  items?: number;
  tax?: string;
  total?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
}

interface CollaboratorCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

/** ============================================================================
 * Column DSL with sorting & filtering
 * ============================================================================ */
type ColDef = {
  id: keyof Invoice | "actions";
  header: string;
  width?: string;
  sortable?: boolean;
  cell?: (row: Invoice) => React.ReactNode;
};

const columns: ReadonlyArray<ColDef> = [
  { id: "invoiceNumber", header: "Invoice #", width: "14rem", sortable: true },
  {
    id: "client",
    header: "Client",
    width: "20rem",
    sortable: true,
    cell: (r) => (
      <div>
        <div className="font-semibold text-slate-900">{r.client}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          <Users className="w-3 h-3" />
          {r.customerName}
        </div>
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    width: "10rem",
    sortable: true,
    cell: (r) => (
      <div className="font-bold text-slate-900 tabular-nums">{r.amount}</div>
    ),
  },
  {
    id: "invoiceDate",
    header: "Date",
    width: "10rem",
    sortable: true,
    cell: (r) => (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Calendar className="w-3 h-3" />
        {r.invoiceDate}
      </div>
    ),
  },
  { id: "status", header: "Status", width: "10rem" },
  { id: "ftaStatus", header: "FTA Status", width: "12rem" },
  {
    id: "actions",
    header: "Actions",
    width: "10rem",
    cell: (r) => <RowActions row={r} />,
  },
] as const;


/** ============================================================================
 * Helpers
 * ============================================================================ */
export function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function badgeClasses(kind: RowStatus | FtaStatus) {
  const baseClasses = "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-200 hover:scale-105";
  
  switch (kind) {
    case "validated":
    case "Approved":
      return `${baseClasses} bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-300`;
    case "sent":
    case "Validated":
      return `${baseClasses} bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-300`;
    case "pending":
    case "Pending":
      return `${baseClasses} bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-300`;
    case "rejected":
    case "Rejected":
      return `${baseClasses} bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border-rose-300`;
    default:
      return `${baseClasses} bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border-slate-300`;
  }
}

function getStatusIcon(status: RowStatus | FtaStatus) {
  switch (status) {
    case "validated":
    case "Approved":
      return <CheckCircle2 className="w-3 h-3" />;
    case "sent":
    case "Validated":
      return <Send className="w-3 h-3" />;
    case "pending":
    case "Pending":
      return <Clock className="w-3 h-3" />;
    case "rejected":
    case "Rejected":
      return <AlertCircle className="w-3 h-3" />;
    default:
      return null;
  }
}

function validate(rows: Invoice[]): Invoice[] {
  return rows.filter(
    (r) =>
      r &&
      typeof r.id === "string" &&
      typeof r.invoiceNumber === "string" &&
      typeof r.client === "string" &&
      typeof r.customerName === "string" &&
      typeof r.amount === "string" &&
      typeof r.invoiceDate === "string" &&
      ["sent", "validated", "pending", "rejected"].includes(r.status) &&
      ["Approved", "Pending", "Rejected", "Validated"].includes(r.ftaStatus)
  );
}

function buildIndex(rows: Invoice[]) {
  return rows.map((r) => ({
    id: r.id,
    hay: (r.invoiceNumber + " " + r.client + " " + r.customerName + " " + r.amount).toLowerCase(),
  }));
}

// Fuzzy search implementation
function fuzzyMatch(hay: string, needle: string): boolean {
  if (!needle) return true;
  
  needle = needle.toLowerCase();
  let needleIdx = 0;
  
  for (let i = 0; i < hay.length && needleIdx < needle.length; i++) {
    if (hay[i] === needle[needleIdx]) needleIdx++;
  }
  
  return needleIdx === needle.length;
}

/** ============================================================================
 * Virtual Scrolling Hook (Performance for large lists)
 * ============================================================================ */
function useVirtualScroll<T>(items: T[], containerHeight: number, itemHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + 1
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const offsetY = visibleStart * itemHeight;
  const totalHeight = items.length * itemHeight;
  
  return {
    visibleItems,
    offsetY,
    totalHeight,
    setScrollTop,
    visibleStart,
    visibleEnd,
  };
}

/** ============================================================================
 * Animated Number Counter
 * ============================================================================ */
const AnimatedNumber = memo(({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (value - start) * easeOut);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{displayValue}</span>;
});

AnimatedNumber.displayName = "AnimatedNumber";

/** ============================================================================
 * Row Actions with Context Menu
 * ============================================================================ */
const RowActions = memo(({ row }: { row: Invoice }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const actions = [
    { icon: Eye, label: "View Details", color: "text-blue-600" },
    { icon: Edit2, label: "Edit", color: "text-slate-600" },
    { icon: Copy, label: "Duplicate", color: "text-slate-600" },
    { icon: Download, label: "Download", color: "text-emerald-600" },
    { icon: Archive, label: "Archive", color: "text-amber-600" },
    { icon: Trash2, label: "Delete", color: "text-rose-600" },
  ];
  
  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="View"
          aria-label={`View ${row.invoiceNumber}`}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          title="Download"
          aria-label={`Download ${row.invoiceNumber}`}
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          title="More actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-20 animate-in fade-in slide-in-from-top-2">
            {actions.map((action, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-2.5 ${action.color} hover:bg-slate-50 text-sm font-medium transition-colors`}
                onClick={() => setMenuOpen(false)}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

RowActions.displayName = "RowActions";

/** ============================================================================
 * Kanban Card Component
 * ============================================================================ */
const KanbanCard = memo(({ invoice }: { invoice: Invoice }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  return (
    <div
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className={`bg-white rounded-xl border-2 border-slate-200 p-4 mb-3 cursor-move transition-all duration-200 hover:shadow-lg hover:border-slate-300 ${
        isDragging ? "opacity-50 scale-95" : "hover:scale-102"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="font-bold text-slate-900">{invoice.invoiceNumber}</div>
        <span className={classNames("text-xs font-bold", badgeClasses(invoice.status))}>
          {getStatusIcon(invoice.status)}
          {invoice.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 font-medium">{invoice.client}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-900 font-bold">{invoice.amount}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" />
          {invoice.invoiceDate}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {invoice.validationScore}
          </div>
          <span className="text-xs text-slate-500">Score</span>
        </div>
        
        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

KanbanCard.displayName = "KanbanCard";

/** ============================================================================
 * Collaboration Cursor Component (simulated)
 * ============================================================================ */
const CollaborationCursor = memo(({ cursor }: { cursor: CollaboratorCursor }) => (
  <div
    className="fixed pointer-events-none z-50 transition-all duration-100"
    style={{ left: cursor.x, top: cursor.y }}
  >
    <MousePointer2
      className="w-5 h-5 -rotate-12"
      style={{ color: cursor.color }}
    />
    <div
      className="mt-1 px-2 py-1 rounded text-xs font-bold text-white shadow-lg"
      style={{ backgroundColor: cursor.color }}
    >
      {cursor.name}
    </div>
  </div>
));

CollaborationCursor.displayName = "CollaborationCursor";

/** ============================================================================
 * Main Component - THE LEGENDARY INVOICES
 * ============================================================================ */
export default function Invoices({
  onFocusRequestEvent = "if.focus-search",
}: {
  onFocusRequestEvent?: string;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RowStatus | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortBy, setSortBy] = useState<keyof Invoice | null>("invoiceDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorCursor[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const searchRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Focus search on "/" shortcut
  useEffect(() => {
    const handler = () => searchRef.current?.focus();
    window.addEventListener(onFocusRequestEvent, handler);
    return () => window.removeEventListener(onFocusRequestEvent, handler);
  }, [onFocusRequestEvent]);

  // Demo data with extended fields
  const rows = useMemo<Invoice[]>(
    () =>
      validate([
        {
          id: "1",
          invoiceNumber: "INV-2024-001",
          client: "Al Futtaim Group",
          customerName: "Ahmed Al Rashid",
          amount: "AED 12,500",
          invoiceDate: "2024-09-15",
          status: "validated",
          ftaStatus: "Approved",
          validationScore: 98,
          items: 5,
          tax: "AED 625",
          total: "AED 13,125",
          notes: "Quarterly services invoice",
          priority: "high",
          tags: ["urgent", "quarterly"],
        },
        {
          id: "2",
          invoiceNumber: "INV-2024-002",
          client: "Emirates NBD",
          customerName: "Fatima Hassan",
          amount: "AED 8,750",
          invoiceDate: "2024-09-14",
          status: "sent",
          ftaStatus: "Validated",
          validationScore: 95,
          items: 3,
          tax: "AED 437.50",
          total: "AED 9,187.50",
          notes: "Monthly consulting fees",
          priority: "medium",
          tags: ["recurring"],
        },
        {
          id: "3",
          invoiceNumber: "INV-2024-003",
          client: "Dubai Airports",
          customerName: "Mohammed Al Maktoum",
          amount: "AED 25,000",
          invoiceDate: "2024-09-13",
          status: "pending",
          ftaStatus: "Pending",
          validationScore: 87,
          items: 8,
          tax: "AED 1,250",
          total: "AED 26,250",
          notes: "Annual maintenance contract",
          priority: "high",
          tags: ["annual", "contract"],
        },
        {
          id: "4",
          invoiceNumber: "INV-2024-004",
          client: "Emaar Properties",
          customerName: "Layla Ahmed",
          amount: "AED 15,200",
          invoiceDate: "2024-09-12",
          status: "rejected",
          ftaStatus: "Rejected",
          validationScore: 45,
          items: 4,
          tax: "AED 760",
          total: "AED 15,960",
          notes: "Missing required documentation",
          priority: "low",
          tags: ["needs-review"],
        },
        {
          id: "5",
          invoiceNumber: "INV-2024-005",
          client: "DP World",
          customerName: "Omar Said",
          amount: "AED 18,900",
          invoiceDate: "2024-09-11",
          status: "validated",
          ftaStatus: "Approved",
          validationScore: 99,
          items: 6,
          tax: "AED 945",
          total: "AED 19,845",
          notes: "Logistics services rendered",
          priority: "medium",
          tags: ["logistics"],
        },
        {
          id: "6",
          invoiceNumber: "INV-2024-006",
          client: "Etisalat",
          customerName: "Aisha Rahman",
          amount: "AED 9,500",
          invoiceDate: "2024-09-10",
          status: "sent",
          ftaStatus: "Validated",
          validationScore: 92,
          items: 2,
          tax: "AED 475",
          total: "AED 9,975",
          notes: "Telecom infrastructure setup",
          priority: "medium",
          tags: ["tech"],
        },
        {
          id: "7",
          invoiceNumber: "INV-2024-007",
          client: "ADNOC",
          customerName: "Khalid Ibrahim",
          amount: "AED 32,000",
          invoiceDate: "2024-09-09",
          status: "pending",
          ftaStatus: "Pending",
          validationScore: 78,
          items: 12,
          tax: "AED 1,600",
          total: "AED 33,600",
          notes: "Equipment procurement",
          priority: "high",
          tags: ["procurement", "urgent"],
        },
        {
          id: "8",
          invoiceNumber: "INV-2024-008",
          client: "Majid Al Futtaim",
          customerName: "Noura Ali",
          amount: "AED 14,300",
          invoiceDate: "2024-09-08",
          status: "validated",
          ftaStatus: "Approved",
          validationScore: 96,
          items: 7,
          tax: "AED 715",
          total: "AED 15,015",
          notes: "Retail consulting services",
          priority: "low",
          tags: ["consulting"],
        },
      ]),
    []
  );

  // Build search index
  const searchIndex = useMemo(() => buildIndex(rows), [rows]);

  // Deferred search for performance
  const deferredSearch = useDeferredValue(search);

  // Filter & sort logic
  const filtered = useMemo(() => {
    let result = rows;

    // Status filter
    if (status !== "all") {
      result = result.filter((r) => r.status === status);
    }

    // Fuzzy search
    if (deferredSearch) {
      const searchLower = deferredSearch.toLowerCase();
      result = result.filter((r) => {
        const idx = searchIndex.find((si) => si.id === r.id);
        return idx && fuzzyMatch(idx.hay, searchLower);
      });
    }

    // Sort
    if (sortBy) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (typeof aVal === "string" && typeof bVal === "string") {
          const cmp = aVal.localeCompare(bVal);
          return sortDir === "asc" ? cmp : -cmp;
        }
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        return 0;
      });
    }

    return result;
  }, [rows, status, deferredSearch, searchIndex, sortBy, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const total = rows.length;
    const approved = rows.filter((r) => r.ftaStatus === "Approved").length;
    const pending = rows.filter((r) => r.ftaStatus === "Pending").length;
    const rejected = rows.filter((r) => r.ftaStatus === "Rejected").length;
    const validated = rows.filter((r) => r.ftaStatus === "Validated").length;
    
    const totalAmount = rows.reduce((sum, r) => {
      const amount = parseFloat(r.amount.replace(/[^\d.]/g, ""));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return { total, approved, pending, rejected, validated, totalAmount };
  }, [rows]);

  // Selection handlers
  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  }, [filtered, selected.size]);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Sort handler
  const handleSort = useCallback((col: keyof Invoice) => {
    if (sortBy === col) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  }, [sortBy]);

  // Bulk actions
  const handleBulkAction = useCallback((action: string) => {
    console.log(`Bulk action: ${action} on ${selected.size} items`);
    setSelected(new Set());
  }, [selected.size]);

  // Export to CSV
  const handleExport = useCallback(() => {
    const csv = [
      columns.map((c) => c.header).join(","),
      ...filtered.map((r) =>
        columns
          .map((c) => {
            const val = (r as any)[c.id];
            return typeof val === "string" ? `"${val}"` : val;
          })
          .join(",")
      ),
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }, [filtered]);

  return (
    <div className="space-y-6 relative">
      {/* Collaboration Cursors */}
      {collaborators.map((cursor) => (
        <CollaborationCursor key={cursor.id} cursor={cursor} />
      ))}

      {/* Header with Stats */}
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl border-2 border-slate-200 p-8 shadow-lg backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Invoice Management
              {isLiveMode && (
                <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full animate-pulse shadow-lg">
                  LIVE
                </span>
              )}
            </h2>
            <p className="text-slate-600 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Manage and track all your invoices in real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all flex items-center gap-2 font-semibold text-sm hover:scale-105"
            >
              {isLiveMode ? (
                <>
                  <Pause className="w-4 h-4" />
                  Live Mode
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Static Mode
                </>
              )}
            </button>
            
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-bold text-sm shadow-lg hover:scale-105"
            >
              <FileDown className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            icon={<FileText className="w-5 h-5 text-slate-600" />}
            value={<AnimatedNumber value={stats.total} />}
            label="Total Invoices"
            tone="slate"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            value={<AnimatedNumber value={stats.approved} />}
            label="Approved"
            tone="emerald"
          />
          <StatCard
            icon={<Send className="w-5 h-5 text-blue-600" />}
            value={<AnimatedNumber value={stats.validated} />}
            label="Validated"
            tone="blue"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-amber-600" />}
            value={<AnimatedNumber value={stats.pending} />}
            label="Pending"
            tone="amber"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5 text-red-600" />}
            value={<AnimatedNumber value={stats.rejected} />}
            label="Rejected"
            tone="red"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5 text-purple-600" />}
            value={`${(stats.totalAmount / 1000).toFixed(0)}k`}
            label="Total Value"
            tone="purple"
          />
        </div>
      </div>

      {/* View Mode Toggle & Advanced Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-xl p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              viewMode === "table"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <List className="w-4 h-4" />
            Table
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              viewMode === "kanban"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            Kanban
          </button>
          <button
            onClick={() => setViewMode("analytics")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              viewMode === "analytics"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-2 animate-in slide-in-from-right-4">
            <span className="text-sm font-bold text-blue-900">
              {selected.size} selected
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleBulkAction("approve")}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction("export")}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
              >
                Export
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-all"
              >
                Delete
              </button>
            </div>
            <button
              onClick={() => setSelected(new Set())}
              className="ml-2 p-1 text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg">
        <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Fuzzy search invoices… (press / to focus)"
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-semibold bg-white min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="validated">✓ Validated</option>
              <option value="sent">→ Sent</option>
              <option value="pending">⏱ Pending</option>
              <option value="rejected">✗ Rejected</option>
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl bg-white hover:bg-slate-50 font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              className="p-3 border-2 border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all hover:rotate-180 duration-500"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t-2 border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Date Range
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Client
                </label>
                <select className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500">
                  <option>All Clients</option>
                  <option>Al Futtaim Group</option>
                  <option>Emirates NBD</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Amount Range
                </label>
                <input
                  type="text"
                  placeholder="Min - Max"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="overflow-x-auto" ref={tableRef}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-4 focus:ring-blue-500/20 cursor-pointer"
                    />
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c.id}
                      className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider"
                      style={{ width: c.width }}
                    >
                      <div className="flex items-center gap-2">
                        {c.header}
                        {c.sortable && (
                          <button
                            onClick={() => handleSort(c.id as keyof Invoice)}
                            className="p-1 hover:bg-slate-200 rounded transition-all"
                          >
                            {sortBy === c.id ? (
                              sortDir === "asc" ? (
                                <SortAsc className="w-4 h-4 text-blue-600" />
                              ) : (
                                <SortDesc className="w-4 h-4 text-blue-600" />
                              )
                            ) : (
                              <Columns className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {filtered.map((r, idx) => (
                  <React.Fragment key={r.id}>
                    <tr
                      className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 ${
                        selected.has(r.id) ? "bg-blue-50/30" : ""
                      }`}
                      style={{
                        animation: `fadeIn 0.3s ease-out ${idx * 30}ms both`,
                      }}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onChange={() => toggleOne(r.id)}
                          className="w-5 h-5 rounded-lg border-2 border-slate-300 text-blue-600 focus:ring-4 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>

                      {columns.map((c) => {
                        if (c.id === "status")
                          return (
                            <td key={c.id} className="px-6 py-4">
                              <span className={classNames(badgeClasses(r.status))}>
                                {getStatusIcon(r.status)}
                                {r.status}
                              </span>
                            </td>
                          );
                        if (c.id === "ftaStatus")
                          return (
                            <td key={c.id} className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className={classNames(badgeClasses(r.ftaStatus))}>
                                  {getStatusIcon(r.ftaStatus)}
                                  {r.ftaStatus}
                                </span>
                                {r.validationScore != null && (
                                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                                    {r.validationScore}%
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        if (c.id === "actions")
                          return (
                            <td key={c.id} className="px-6 py-4">
                              <RowActions row={r} />
                            </td>
                          );

                        const content = c.cell ? c.cell(r) : (r as any)[c.id];
                        return (
                          <td key={c.id} className="px-6 py-4">
                            {c.id === "invoiceNumber" ? (
                              <button
                                className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all"
                                onClick={() => toggleExpand(r.id)}
                              >
                                {content}
                              </button>
                            ) : (
                              content
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {expanded.has(r.id) && (
                      <tr className="bg-gradient-to-r from-slate-50 to-blue-50/30 animate-in slide-in-from-top-2">
                        <td colSpan={1 + columns.length} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Tag className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-600 font-semibold">Items</div>
                                <div className="font-black text-slate-900">{r.items} items</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-600 font-semibold">Tax</div>
                                <div className="font-black text-slate-900">{r.tax}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-600 font-semibold">Total</div>
                                <div className="font-black text-slate-900">{r.total}</div>
                              </div>
                            </div>
                            {r.notes && (
                              <div className="md:col-span-3 p-4 bg-white rounded-xl border-2 border-slate-200">
                                <div className="text-xs text-slate-600 font-bold mb-2">Notes</div>
                                <div className="text-sm text-slate-900">{r.notes}</div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Kanban View */}
        {viewMode === "kanban" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {["validated", "sent", "pending", "rejected"].map((statusCol) => {
                const statusInvoices = filtered.filter((r) => r.status === statusCol);
                const statusColors = {
                  validated: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300",
                  sent: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300",
                  pending: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300",
                  rejected: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300",
                };
                
                return (
                  <div
                    key={statusCol}
                    className={`rounded-2xl border-2 p-4 ${statusColors[statusCol as RowStatus]} min-h-[500px]`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-slate-900 uppercase text-sm flex items-center gap-2">
                        {getStatusIcon(statusCol as RowStatus)}
                        {statusCol}
                      </h3>
                      <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                        {statusInvoices.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {statusInvoices.map((invoice) => (
                        <KanbanCard key={invoice.id} invoice={invoice} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {viewMode === "analytics" && (
          <div className="p-8">
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-slate-600 mb-6">
                Advanced charts and insights coming soon!
              </p>
              <button
                onClick={() => setViewMode("table")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
              >
                Back to Table
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {viewMode === "table" && (
          <div className="flex items-center justify-between px-6 py-4 border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-black text-slate-900">1–{filtered.length}</span> of{" "}
              <span className="font-black text-slate-900">{rows.length}</span> invoices
              {isPending && <span className="ml-2 text-blue-600 animate-pulse">Loading...</span>}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="px-4 py-2 text-sm bg-white border-2 border-slate-200 rounded-lg text-slate-700 disabled:opacity-50 font-semibold"
              >
                Previous
              </button>
              <button className="px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-blue-600 rounded-lg hover:scale-105 transition-all font-bold shadow-lg">
                1
              </button>
              <button className="px-4 py-2 text-sm bg-white border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold hover:scale-105 transition-all">
                2
              </button>
              <button className="px-4 py-2 text-sm bg-white border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold hover:scale-105 transition-all">
                3
              </button>
              <button className="px-4 py-2 text-sm bg-white border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold hover:scale-105 transition-all">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-from-top-2 {
          from {
            transform: translateY(-0.5rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-right-4 {
          from {
            transform: translateX(1rem);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }

        .slide-in-from-top-2 {
          animation-name: slide-in-from-top-2;
        }

        .slide-in-from-right-4 {
          animation-name: slide-in-from-right-4;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

/** ============================================================================
 * Enhanced Stat Card
 * ============================================================================ */
function StatCard({
  icon,
  value,
  label,
  tone = "slate",
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  tone?: "slate" | "blue" | "emerald" | "amber" | "red" | "purple";
}) {
  const bg = {
    slate: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300",
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300",
    emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300",
    amber: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300",
    red: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300",
  }[tone];

  return (
    <div
      className={`rounded-xl p-4 border-2 ${bg} transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
          {icon}
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{value}</div>
          <div className="text-xs text-slate-600 font-bold uppercase tracking-wide">{label}</div>
        </div>
      </div>
    </div>
  );
}