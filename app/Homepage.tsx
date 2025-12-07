"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CheckCircle,
  Shield,
  Clock,
  ArrowRight,
  Menu,
  X,
  Star,
  Award,
  HelpCircle,
  ChevronDown,
  Plug,
  RefreshCw,
  Phone,
  FileText,
  Zap,
  Users,
  Download,
  AlertTriangle,
  Building2,
  Lock,
  Globe,
  Headphones,
  FileCheck,
  Play,
  Server,
  BadgeCheck,
  ShieldCheck,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

// ============================================================================
// TYPES & CONTENT DATA
// ============================================================================
interface HomepageProps {
  onNavigateToLogin: () => void;
  onNavigateToAssessment: () => void;
}

const pricingPlans = [
  {
    name: "Starter",
    description: "For SMEs preparing for Phase 2 compliance",
    price: "AED 499",
    period: "/month",
    invoices: "Up to 500 invoices/month",
    features: [
      "1 ERP connection",
      "1 ASP connection",
      "Email support (24h response)",
      "Sandbox + production environments",
      "Basic dashboard & reporting",
      "FTA compliance guarantee",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    description: "For finance teams with multi-entity environments",
    price: "AED 1,499",
    period: "/month",
    invoices: "Up to 2,500 invoices/month",
    features: [
      "Up to 3 ERP connections",
      "Multi-ASP support",
      "Priority phone & chat support",
      "Dedicated onboarding specialist",
      "Advanced analytics & audit trails",
      "API access for custom integrations",
      "FTA compliance guarantee",
    ],
    cta: "Book Demo",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large groups and complex architectures",
    price: "Custom",
    period: "",
    invoices: "Unlimited invoices",
    features: [
      "Unlimited ERP connections",
      "Multi-country, multi-tenant setups",
      "24/7 support + custom SLA",
      "Dedicated account manager",
      "Custom integration development",
      "On-premise deployment options",
      "Direct collaboration with your tax advisors",
      "FTA compliance guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqItems = [
  {
    q: "Do I need to change my accounting software?",
    a: "No. Finvise connects to your existing ERP via API or SFTP. Your team continues working exactly as they do today — we handle the e-invoicing layer invisibly.",
  },
  {
    q: "Is Finvise an accredited ASP?",
    a: "Finvise connects via FTA-accredited Access Service Providers (ASPs) to ensure every invoice is validated, signed, and routed in line with FTA requirements. We're your bridge to any accredited ASP.",
  },
  {
    q: "What happens if the FTA rejects an invoice?",
    a: "Our validation engine catches 99.8% of errors before submission. If FTA rejects an invoice we validated, we fix it free and resubmit within 4 hours. You're never left with a compliance gap.",
  },
  {
    q: "Can you support multiple ERPs across subsidiaries?",
    a: "Yes. We regularly handle multi-entity and multi-ERP environments. We centralise e-invoicing while letting local entities keep their preferred systems.",
  },
  {
    q: "How long does implementation take?",
    a: "For a single-ERP setup, most customers go live in 8-14 business days once integration access is provided. Complex multi-ERP setups typically take 3-4 weeks.",
  },
  {
    q: "Is my financial data secure? Where is it stored?",
    a: "We use AES-256 encryption in transit and at rest. All data is stored on UAE-based servers. We never access your invoice content—only submission status and metadata required for compliance.",
  },
  {
    q: "What are the FTA penalties for non-compliance?",
    a: "AED 5,000 per violation, plus potential business license suspension. Each non-compliant invoice counts as a separate violation. With high volumes, penalties add up fast—that's why we guarantee 100% compliance.",
  },
  {
    q: "Can I cancel if it doesn't work for us?",
    a: "Yes. All plans include a 14-day free trial. After that, you can cancel anytime with 30 days' notice—no penalties, no lock-in contracts.",
  },
];

const securityBadges = [
  { icon: ShieldCheck, label: "ISO 27001", sublabel: "Certified" },
  { icon: BadgeCheck, label: "SOC 2 Type II", sublabel: "Audited" },
  { icon: Lock, label: "AES-256", sublabel: "Encryption" },
  { icon: MapPin, label: "UAE Data", sublabel: "Residency" },
  { icon: Award, label: "FTA-Authorized", sublabel: "Partner" },
  { icon: Globe, label: "Peppol", sublabel: "Certified" },
];

// ============================================================================
// HOOKS
// ============================================================================
const useInView = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.2, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};

const useCountdown = (targetDate: Date) => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const today = new Date();
      const difference = Math.ceil(
        (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      setDays(Math.max(0, difference));
    };

    calculateDays();
    const interval = setInterval(calculateDays, 86400000); // Update daily
    return () => clearInterval(interval);
  }, [targetDate]);

  return days;
};

// ============================================================================
// HERO FLOW DIAGRAM
// ============================================================================
const HeroFlowDiagram = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: "Your ERP", systems: ["Tally", "Zoho", "QuickBooks", "SAP", "Excel"] },
    { label: "Finvise", tagline: "Validates • Transforms • Transmits" },
    { label: "Accredited ASP", tagline: "Peppol Network" },
    { label: "FTA", tagline: "Federal Tax Authority" },
  ];

  return (
    <div className="relative">
      {/* Main container */}
      <div className="bg-gradient-to-br from-white via-green-50/40 to-slate-50 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-6 md:p-8 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #064e3b 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative">
          {/* Flow visualization */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.label}>
                {/* Step card */}
                <div className={`
                  relative flex-1 min-w-[140px] max-w-[200px] transition-all duration-700
                  ${phase === idx ? "scale-105 z-10" : "scale-100"}
                `}>
                  {/* Glow effect for active step */}
                  {phase === idx && (
                    <div className={`absolute -inset-3 rounded-2xl blur-xl transition-opacity duration-500 ${
                      idx === 1 ? "bg-green-400/40" : idx === 3 ? "bg-amber-400/30" : "bg-slate-300/40"
                    }`} />
                  )}

                  <div className={`
                    relative rounded-2xl p-4 transition-all duration-500 border-2
                    ${idx === 1 
                      ? "bg-gradient-to-br from-green-600 to-green-700 border-green-500 text-white shadow-xl shadow-green-600/20" 
                      : idx === 3 
                        ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white shadow-xl"
                        : phase === idx
                          ? "bg-white border-green-400 shadow-lg"
                          : "bg-white/80 border-slate-200 shadow-sm"
                    }
                  `}>
                    {/* Finvise special badge */}
                    {idx === 1 && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-400 text-amber-900 text-[9px] font-black rounded-full whitespace-nowrap">
                        THE BRIDGE
                      </div>
                    )}

                    {/* FTA badge */}
                    {idx === 3 && phase === 3 && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded-full whitespace-nowrap animate-pulse">
                        ✓ ACCEPTED
                      </div>
                    )}

                    <div className="text-center">
                      <div className={`text-xs font-bold mb-1 ${
                        idx === 1 || idx === 3 ? "text-white/70" : "text-slate-400"
                      }`}>
                        {idx === 0 ? "STEP 1" : idx === 1 ? "STEP 2" : idx === 2 ? "STEP 3" : "STEP 4"}
                      </div>
                      <div className={`font-black text-sm mb-1 ${
                        idx === 1 || idx === 3 ? "text-white" : "text-slate-900"
                      }`}>
                        {step.label}
                      </div>
                      
                      {idx === 0 ? (
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                          {step.systems?.slice(0, 3).map((sys) => (
                            <span key={sys} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full">
                              {sys}
                            </span>
                          ))}
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full">
                            +more
                          </span>
                        </div>
                      ) : (
                        <div className={`text-[10px] ${
                          idx === 1 ? "text-green-200" : idx === 3 ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {step.tagline}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow between steps */}
                {idx < 3 && (
                  <div className="hidden lg:flex items-center justify-center w-12 flex-shrink-0">
                    <svg width="48" height="24" viewBox="0 0 48 24" className="overflow-visible">
                      <defs>
                        <linearGradient id={`arrowGrad${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={phase > idx ? "#22c55e" : "#cbd5e1"} />
                          <stop offset="100%" stopColor={phase > idx ? "#16a34a" : "#94a3b8"} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 12 L36 12"
                        stroke={`url(#arrowGrad${idx})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-500"
                      />
                      <path
                        d="M32 6 L42 12 L32 18"
                        stroke={phase > idx ? "#16a34a" : "#94a3b8"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        className="transition-all duration-500"
                      />
                      {/* Animated dot */}
                      {phase === idx + 1 && (
                        <circle r="4" fill="#22c55e" className="drop-shadow-sm">
                          <animateMotion dur="0.8s" fill="freeze" path="M0 12 L36 12" />
                        </circle>
                      )}
                    </svg>
                  </div>
                )}

                {/* Mobile arrows */}
                {idx < 3 && (
                  <div className="lg:hidden flex items-center justify-center h-8">
                    <ChevronDown className={`w-6 h-6 transition-colors duration-500 ${
                      phase > idx ? "text-green-500" : "text-slate-300"
                    }`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Bottom status bar */}
          <div className="mt-6 pt-4 border-t border-slate-200/60 flex flex-wrap justify-center gap-4">
            {[
              { icon: Lock, text: "UAE Servers Only" },
              { icon: Zap, text: "8-Day Avg Setup" },
              { icon: Shield, text: "100% FTA Guarantee" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                <item.icon className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-semibold text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5-CORNER MODEL – FINVISE SVG DIAGRAM
// ============================================================================
type FiveCornerModelProps = {
  onNavigateToAssessment: () => void;
};

const fiveCornerMeta = [
  {
    id: 1,
    label: "SUPPLIER",
    sublabel: "Your Business",
    description:
      "You create invoices in your existing ERP — Tally, Zoho, QuickBooks, or any system you use today.",
  },
  {
    id: 2,
    label: "SUPPLIER ACCESS POINT",
    sublabel: "Finvise (ASP)",
    description:
      "Finvise validates your invoice against FTA rules, transforms it to PINT-AE, digitally signs it, and transmits via Peppol.",
  },
  {
    id: 3,
    label: "BUYER'S ACCESS POINT",
    sublabel: "Receiving ASP",
    description:
      "Your buyer’s Access Service Provider receives the validated, FTA-approved e-invoice in real time.",
  },
  {
    id: 4,
    label: "BUYER",
    sublabel: "Your Customer",
    description:
      "Your customer receives a clean, digital invoice ready for posting and payment processing.",
  },
  {
    id: 5,
    label: "FTA",
    sublabel: "Federal Tax Authority",
    description:
      "The FTA validates every invoice in real-time and returns official acceptance confirmation.",
  },
];

const FiveCornerModel: React.FC<FiveCornerModelProps> = ({
  onNavigateToAssessment,
}) => {
  // NOTE: this uses your existing custom hook defined earlier in Homepage.tsx
  const { ref, isInView } = useInView();
  const [activeCorner, setActiveCorner] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(1);

  // Simple looping animation when diagram is in view
  useEffect(() => {
    if (!isInView) return;

    let step = 1;
    setAnimationStep(step);

    const interval = setInterval(() => {
      step = (step % 5) + 1; // 1 → 2 → 3 → 4 → 5 → 1…
      setAnimationStep(step);
    }, 1400);

    return () => clearInterval(interval);
  }, [isInView]);

  const isCornerActive = (id: number) => {
    if (activeCorner !== null) return activeCorner === id;
    return animationStep === id;
  };

  return (
    <section
      ref={ref}
      id="5-corner"
      className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/10 text-[#1e3a5f] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Globe className="w-4 h-4" />
            UAE E-Invoicing – 5-Corner Model
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            How Finvise Fits into the FTA 5-Corner Flow
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Every e-invoice in the UAE passes through this FTA-mandated
            architecture.{" "}
            <span className="text-emerald-700 font-semibold">
              Finvise acts as your Corner&nbsp;2 Supplier Access Point.
            </span>
          </p>
        </div>

        {/* Diagram */}
        <div
          className={`relative max-w-4xl mx-auto transition-all duration-700 delay-150 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Soft background panel */}
          <div className="absolute inset-[9%] bg-gradient-to-b from-cyan-50/90 via-emerald-50/80 to-white rounded-[48px]" />

          <svg viewBox="0 0 800 480" className="w-full h-auto relative z-10">
            <defs>
              <marker
                id="arrowGreen"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path
                  d="M0 0 L10 5 L0 10 L2 5 Z"
                  fill="#16a34a"
                />
              </marker>
              <marker
                id="arrowGray"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path
                  d="M0 0 L10 5 L0 10 L2 5 Z"
                  fill="#cbd5f5"
                />
              </marker>
              <filter
                id="glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1: Supplier → Finvise */}
            <path
              d="M 160 360 Q 180 290 245 245"
              fill="none"
              stroke={animationStep >= 1 ? "#16a34a" : "#e2e8f0"}
              strokeWidth="3"
              strokeLinecap="round"
              markerEnd={
                animationStep >= 1 ? "url(#arrowGreen)" : "url(#arrowGray)"
              }
              className="transition-all duration-500"
            />
            <text
              x="140"
              y="295"
              className="text-[10px] fill-slate-500 font-medium"
            >
              Generate &amp; Send
            </text>

            {/* 2: Finvise → FTA */}
            <path
              d="M 320 160 Q 360 105 400 80"
              fill="none"
              stroke={animationStep >= 2 ? "#16a34a" : "#e2e8f0"}
              strokeWidth="3"
              strokeLinecap="round"
              markerEnd={
                animationStep >= 2 ? "url(#arrowGreen)" : "url(#arrowGray)"
              }
              className="transition-all duration-500"
            />
            <text
              x="295"
              y="105"
              className="text-[10px] fill-emerald-700 font-semibold"
            >
              PINT-AE format
            </text>

            {/* 3: FTA → Buyer ASP */}
            <path
              d="M 480 80 Q 520 105 560 160"
              fill="none"
              stroke={animationStep >= 3 ? "#16a34a" : "#e2e8f0"}
              strokeWidth="3"
              strokeLinecap="round"
              markerEnd={
                animationStep >= 3 ? "url(#arrowGreen)" : "url(#arrowGray)"
              }
              className="transition-all duration-500"
            />
            <text
              x="500"
              y="105"
              className="text-[10px] fill-emerald-700 font-semibold"
            >
              Validated ✓
            </text>

            {/* 4: Buyer ASP → Buyer */}
            <path
              d="M 620 240 Q 660 300 680 340"
              fill="none"
              stroke={animationStep >= 4 ? "#16a34a" : "#e2e8f0"}
              strokeWidth="3"
              strokeLinecap="round"
              markerEnd={
                animationStep >= 4 ? "url(#arrowGreen)" : "url(#arrowGray)"
              }
              className="transition-all duration-500"
            />
            <text
              x="647"
              y="292"
              className="text-[10px] fill-slate-500 font-medium"
            >
              Receive &amp; Record
            </text>

            {/* 5: Bottom arc – Validate & Transmit */}
            <path
              d="M 300 260 Q 400 340 560 260"
              fill="none"
              stroke={animationStep >= 5 ? "#16a34a" : "#e2e8f0"}
              strokeWidth="3"
              strokeLinecap="round"
              markerEnd={
                animationStep >= 5 ? "url(#arrowGreen)" : "url(#arrowGray)"
              }
              className="transition-all duration-500"
            />
            <text
              x="375"
              y="320"
              className="text-[11px] fill-emerald-700 font-semibold"
            >
              Validate &amp; Transmit
            </text>

            {/* Step badge on arc */}
            <circle
              cx="430"
              cy="295"
              r="13"
              fill={animationStep >= 5 ? "#0d9488" : "#e2e8f0"}
              className="transition-all duration-500"
            />
            <text
              x="430"
              y="299"
              textAnchor="middle"
              className="text-[11px] fill-white font-bold"
            >
              5
            </text>

            {/* Corner 1 – Supplier */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                isCornerActive(1) ? "opacity-100" : "opacity-60"
              }`}
              onMouseEnter={() => setActiveCorner(1)}
              onMouseLeave={() => setActiveCorner(null)}
            >
              <rect
                x="60"
                y="340"
                width="110"
                height="82"
                rx="18"
                fill="#0ea5e9"
                className={isCornerActive(1) ? "drop-shadow-lg" : ""}
              />
              <text
                x="115"
                y="368"
                textAnchor="middle"
                className="text-[11px] fill-white/80 font-medium"
              >
                Corner 1
              </text>
              <text
                x="115"
                y="386"
                textAnchor="middle"
                className="text-[13px] fill-white font-bold"
              >
                SUPPLIER
              </text>
              <text
                x="115"
                y="404"
                textAnchor="middle"
                className="text-[10px] fill-white/75"
              >
                Your Business
              </text>
              <circle
                cx="115"
                cy="435"
                r="12"
                fill="#0ea5e9"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x="115"
                y="439"
                textAnchor="middle"
                className="text-[11px] fill-white font-bold"
              >
                1
              </text>
            </g>

            {/* Corner 2 – Finvise (Supplier ASP) */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                isCornerActive(2) ? "opacity-100" : "opacity-70"
              }`}
              onMouseEnter={() => setActiveCorner(2)}
              onMouseLeave={() => setActiveCorner(null)}
              filter={isCornerActive(2) ? "url(#glow)" : undefined}
            >
              <ellipse
                cx="290"
                cy="200"
                rx="74"
                ry="52"
                fill="#22c55e"
                opacity="0.18"
                className={isCornerActive(2) ? "animate-pulse" : ""}
              />
              <rect
                x="230"
                y="150"
                width="120"
                height="102"
                rx="18"
                fill="#1e293b"
                stroke="#22c55e"
                strokeWidth="3"
              />
              <rect
                x="248"
                y="138"
                width="84"
                height="18"
                rx="9"
                fill="#22c55e"
              />
              <text
                x="290"
                y="150"
                textAnchor="middle"
                className="text-[9px] fill-white font-semibold tracking-wide"
              >
                ✨ FINVISE
              </text>
              <text
                x="290"
                y="176"
                textAnchor="middle"
                className="text-[10px] fill-white/75 font-medium"
              >
                Corner 2
              </text>
              <text
                x="290"
                y="194"
                textAnchor="middle"
                className="text-[11px] fill-white font-bold"
              >
                SUPPLIER
              </text>
              <text
                x="290"
                y="210"
                textAnchor="middle"
                className="text-[11px] fill-white font-bold"
              >
                ACCESS POINT
              </text>
              <text
                x="290"
                y="226"
                textAnchor="middle"
                className="text-[9px] fill-emerald-300"
              >
                (Accredited ASP)
              </text>
              <circle cx="290" cy="265" r="14" fill="#22c55e" />
              <text
                x="290"
                y="269"
                textAnchor="middle"
                className="text-[12px] fill-white font-bold"
              >
                2
              </text>
            </g>

            {/* Corner 5 – FTA (centered) */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                isCornerActive(5) ? "opacity-100" : "opacity-70"
              }`}
              onMouseEnter={() => setActiveCorner(5)}
              onMouseLeave={() => setActiveCorner(null)}
            >
              {/* x=352 with width=96 => perfectly centered at 400 */}
              <rect
                x="352"
                y="30"
                width="96"
                height="74"
                rx="14"
                fill="#1e3a5f"
                className={isCornerActive(5) ? "drop-shadow-lg" : ""}
              />
              <text x="400" y="54" textAnchor="middle" className="text-[22px]">
                🏛️
              </text>
              <text
                x="400"
                y="72"
                textAnchor="middle"
                className="text-[14px] fill-white font-black"
              >
                FTA
              </text>
              <text
                x="400"
                y="88"
                textAnchor="middle"
                className="text-[8px] fill-white/70"
              >
                Federal Tax Authority
              </text>
            </g>

            {/* Corner 3 – Buyer ASP */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                isCornerActive(3) ? "opacity-100" : "opacity-60"
              }`}
              onMouseEnter={() => setActiveCorner(3)}
              onMouseLeave={() => setActiveCorner(null)}
            >
              <rect
                x="530"
                y="150"
                width="120"
                height="102"
                rx="18"
                fill="#1e293b"
                className={isCornerActive(3) ? "drop-shadow-lg" : ""}
              />
              <text
                x="590"
                y="176"
                textAnchor="middle"
                className="text-[10px] fill-white/70 font-medium"
              >
                Corner 3
              </text>
              <text
                x="590"
                y="194"
                textAnchor="middle"
                className="text-[11px] fill-white font-bold"
              >
                BUYER&apos;S
              </text>
              <text
                x="590"
                y="210"
                textAnchor="middle"
                className="text-[11px] fill-white font-bold"
              >
                ACCESS POINT
              </text>
              <text
                x="590"
                y="226"
                textAnchor="middle"
                className="text-[9px] fill-slate-300"
              >
                (ASP)
              </text>
              <circle cx="590" cy="265" r="14" fill="#0d9488" />
              <text
                x="590"
                y="269"
                textAnchor="middle"
                className="text-[12px] fill-white font-bold"
              >
                3
              </text>
            </g>

            {/* Corner 4 – Buyer */}
            <g
              className={`cursor-pointer transition-all duration-300 ${
                isCornerActive(4) ? "opacity-100" : "opacity-60"
              }`}
              onMouseEnter={() => setActiveCorner(4)}
              onMouseLeave={() => setActiveCorner(null)}
            >
              <rect
                x="650"
                y="340"
                width="110"
                height="82"
                rx="18"
                fill="#f59e0b"
                className={isCornerActive(4) ? "drop-shadow-lg" : ""}
              />
              <text
                x="705"
                y="368"
                textAnchor="middle"
                className="text-[11px] fill-white/85 font-medium"
              >
                Corner 4
              </text>
              <text
                x="705"
                y="386"
                textAnchor="middle"
                className="text-[13px] fill-white font-bold"
              >
                BUYER
              </text>
              <text
                x="705"
                y="404"
                textAnchor="middle"
                className="text-[10px] fill-white/75"
              >
                Your Customer
              </text>
              <circle
                cx="705"
                cy="435"
                r="12"
                fill="#f59e0b"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x="705"
                y="439"
                textAnchor="middle"
                className="text-[11px] fill-white font-bold"
              >
                4
              </text>
            </g>

            {/* Animated packet across full flow */}
            {isInView && (
              <circle r="6" fill="#22c55e" className="drop-shadow-md">
                <animateMotion
                  dur="9s"
                  repeatCount="indefinite"
                  path="M 160 360 Q 180 290 290 200 Q 360 100 400 70 Q 520 100 590 200 Q 660 300 705 380"
                />
              </circle>
            )}
          </svg>

          {/* Tooltip */}
          {activeCorner && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-20">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                    activeCorner === 2 ? "bg-emerald-600" : "bg-slate-700"
                  }`}
                >
                  {activeCorner}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {fiveCornerMeta.find((c) => c.id === activeCorner)?.label}
                    {activeCorner === 2 && (
                      <span className="ml-2 text-emerald-700 text-xs font-semibold">
                        (Finvise)
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {fiveCornerMeta.find((c) => c.id === activeCorner)?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tech bar */}
        <div
          className={`max-w-3xl mx-auto mt-8 transition-all duration-700 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="bg-[#1e3a5f] rounded-2xl py-4 px-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            {[
              "PINT-AE",
              "API",
              "Accredited ASP",
              "Digital Signature",
              "Timestamping",
            ].map((tech, i) => (
              <React.Fragment key={tech}>
                {i > 0 && (
                  <span className="hidden md:inline text-slate-500">|</span>
                )}
                <span className="text-white font-semibold text-sm">
                  {tech}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-10 transition-all duration-700 delay-400 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <button
            onClick={onNavigateToAssessment}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all hover:scale-105"
          >
            Book Your Free Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};



// ============================================================================
// COUNTDOWN COMPONENT
// ============================================================================
const CountdownDisplay = ({ days, size = "default" }: { days: number; size?: "default" | "small" }) => {
  const digits = days.toString().padStart(3, "0").split("");
  
  const sizeClasses = size === "small" 
    ? "w-8 h-10 text-lg"
    : "w-12 h-16 md:w-14 md:h-20 text-2xl md:text-4xl";

  return (
    <div className="flex items-center gap-1">
      {digits.map((digit, i) => (
        <div
          key={i}
          className={`${sizeClasses} bg-gradient-to-b from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden`}
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-red-900/20" />
          <span className="font-black text-white relative z-10">{digit}</span>
        </div>
      ))}
      <span className={`ml-2 font-bold text-red-700 ${size === "small" ? "text-xs" : "text-sm"}`}>DAYS</span>
    </div>
  );
};

// ============================================================================
// SECURITY SECTION
// ============================================================================
const SecuritySection = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Enterprise Security. Government-Grade Compliance.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Your financial data deserves the highest protection. We're built for UAE compliance from day one.
          </p>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {securityBadges.map((badge, i) => (
            <div 
              key={badge.label} 
              className="text-center group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center mb-3 border border-slate-700 group-hover:border-green-500/50 group-hover:bg-slate-800/80 transition-all">
                <badge.icon className="w-8 h-8 text-amber-400" />
              </div>
              <div className="font-bold text-white text-sm">{badge.label}</div>
              <div className="text-xs text-slate-500">{badge.sublabel}</div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-slate-500 text-sm max-w-2xl mx-auto">
          Your data never leaves UAE servers. We store only submission metadata—never your actual invoice content.
        </p>
      </div>
    </section>
  );
};

// ============================================================================
// LEAD MAGNETS SECTION
// ============================================================================
const LeadMagnetsSection = () => {
  const { ref, isInView } = useInView();

  const magnets = [
    {
      icon: FileText,
      title: "FTA E-Invoicing Readiness Checklist",
      description: "47-point PDF covering technical requirements, ASP selection criteria, and implementation timeline milestones.",
      cta: "Download Checklist",
      color: "green",
    },
    {
      icon: FileCheck,
      title: "Sample Peppol Invoice: Annotated Guide",
      description: "See exactly what a compliant UAE e-invoice looks like, with field-by-field explanations and validation rules.",
      cta: "Download Sample",
      color: "blue",
    },
  ];

  return (
    <section ref={ref} className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-10 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
            Free Resources to Prepare for Compliance
          </h2>
          <p className="text-slate-600">
            Not ready to talk yet? Start with these guides built by our compliance team.
          </p>
        </div>

        <div className={`grid md:grid-cols-2 gap-6 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {magnets.map((magnet) => (
            <div key={magnet.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow flex gap-5">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                magnet.color === "green" ? "bg-green-100" : "bg-blue-100"
              }`}>
                <magnet.icon className={`w-7 h-7 ${magnet.color === "green" ? "text-green-600" : "text-blue-600"}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-2">{magnet.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{magnet.description}</p>
                <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  magnet.color === "green" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}>
                  <Download className="w-4 h-4" />
                  {magnet.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// PRICING SECTION
// ============================================================================
const PricingSection = ({ onNavigateToAssessment }: { onNavigateToAssessment: () => void }) => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Simple Pricing That Scales With You
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            All plans include FTA compliance guarantee, UAE data residency, and dedicated onboarding support.
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-6 lg:gap-8 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-slate-900 text-white scale-105 shadow-2xl shadow-slate-900/20 z-10 border-2 border-green-500"
                  : "bg-white border border-slate-200 shadow-lg hover:shadow-xl"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${plan.popular ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? "text-slate-300" : "text-slate-600"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-2">
                <span className={`text-4xl font-black ${plan.popular ? "text-white" : "text-slate-900"}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={plan.popular ? "text-slate-400" : "text-slate-500"}>
                    {plan.period}
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${plan.popular ? "text-green-400" : "text-green-600"} font-medium`}>
                {plan.invoices}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.popular ? "text-green-400" : "text-green-600"
                    }`} />
                    <span className={plan.popular ? "text-slate-200" : "text-slate-700"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onNavigateToAssessment}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-slate-600">
          Need more invoices? Add <span className="font-semibold">AED 100</span> per additional 500 invoices/month.
          All plans include 14-day free trial.
        </p>
      </div>
    </section>
  );
};

// ============================================================================
// FAQ SECTION
// ============================================================================
const FAQSection = ({ onNavigateToAssessment }: { onNavigateToAssessment: () => void }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="faq" className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Everything Your Team Will Ask
          </h2>
          <p className="text-lg text-slate-600">
            Quick answers for your CFO, Head of Tax, and IT before they sign off.
          </p>
        </div>

        <div className={`space-y-3 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-4 text-slate-600">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-slate-600">
          Still have questions?{" "}
          <button
            onClick={onNavigateToAssessment}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Book a free assessment
          </button>{" "}
          and we'll walk your team through everything.
        </p>
      </div>
    </section>
  );
};

// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================
export default function Homepage({ onNavigateToLogin, onNavigateToAssessment }: HomepageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const deadline = new Date("2026-06-01");
  const daysUntilDeadline = useCountdown(deadline);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Skip link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50 font-medium"
      >
        Skip to content
      </a>

      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <a href="/" className="flex items-center">
              <img
                src="/Finvise.png"
                alt="Finvise"
                className="h-22 md:h-33 w-auto"
              />
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#5-corner" className="text-sm font-medium text-slate-600 hover:text-green-700 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-green-700 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-green-700 transition-colors">
                FAQ
              </a>
              <button
                onClick={onNavigateToLogin}
                className="text-sm font-medium text-slate-600 hover:text-green-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={onNavigateToAssessment}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md"
              >
                Book Free Assessment
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <img src="/Finvise.png" alt="Finvise" className="h-8" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <a href="#5-corner" className="block py-3 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" className="block py-3 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="block py-3 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <hr className="my-4" />
              <button onClick={() => { setMobileMenuOpen(false); onNavigateToLogin(); }} className="block w-full text-left py-3 font-medium">
                Login
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateToAssessment(); }}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold"
              >
                Book Free Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main id="main">
        {/* ==================== HERO ==================== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white to-slate-50" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Copy */}
              <div className="order-2 lg:order-1">
                {/* Trust badge */}
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <span>🇦🇪</span>
                  <span>FTA-Ready</span>
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  <span>1,200+ UAE Businesses</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  E-invoicing compliance
                  <span className="block text-green-700">without breaking your ERP.</span>
                </h1>

                {/* Subhead */}
                <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                  Finvise connects your existing billing and accounting systems to the UAE e-invoicing network. 
                  No ripping out ERPs, no manual uploads—just clean, FTA-ready invoices with full audit trails.
                </p>

                {/* Urgency callout */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-8">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Phase 2 Deadline Approaching</p>
                      <p className="text-xs text-amber-700">Non-compliance = AED 5,000 per invoice</p>
                    </div>
                  </div>
                  <CountdownDisplay days={daysUntilDeadline} size="small" />
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={onNavigateToAssessment}
                    className="group px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    Book Free Assessment
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    href="#5-corner"
                    className="px-8 py-4 border-2 border-slate-300 hover:border-green-500 text-slate-700 hover:text-green-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    See How It Works
                  </a>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="order-1 lg:order-2">
                <HeroFlowDiagram />
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SOCIAL PROOF BAR ==================== */}
        <section className="bg-slate-900 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-400 text-sm">
                Trusted by <span className="text-white font-semibold">1,200+</span> UAE businesses across
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Retail", "Trading", "Manufacturing", "Consulting", "Accounting Firms"].map((industry) => (
                  <span key={industry} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 5-CORNER MODEL ==================== */}
        <FiveCornerModel onNavigateToAssessment={onNavigateToAssessment} />

        {/* ==================== MANDATE SECTION ==================== */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  UAE E-Invoicing Mandate
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                  The clock is ticking on
                  <span className="block text-red-600">FTA compliance.</span>
                </h2>
                <p className="text-slate-600 mb-6">
                  The UAE is moving to a Peppol-style, 5-corner e-invoicing model. That means real-time clearance 
                  with the FTA, digital signatures, and strict validation of every B2B invoice you issue.
                </p>
                <p className="text-slate-600 mb-8">
                  Finvise helps you adapt without rebuilding your finance stack—connecting your ERPs, point solutions, 
                  and billing systems into one compliant e-invoicing bridge.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <CountdownDisplay days={daysUntilDeadline} />
                  </div>
                  <p className="text-sm text-slate-500">until Phase 2 mandatory compliance</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  What the FTA expects from every invoice
                </h3>
                <ul className="space-y-4">
                  {[
                    { title: "Structured", desc: "In PINT-AE (Peppol-based) XML format" },
                    { title: "Cleared", desc: "Checked and accepted by FTA in real-time" },
                    { title: "Signed", desc: "Digitally signed with traceable audit data" },
                    { title: "Delivered", desc: "Routed to buyer through the e-invoicing network" },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">{item.title}:</span>{" "}
                        <span className="text-slate-600">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-slate-200 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-slate-600">
                    Finvise is designed around these requirements from day one—so your finance team doesn't have to 
                    reverse-engineer the regulation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== WHY FINVISE ==================== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                Built for Finance Teams Without IT Departments
              </h2>
              <p className="text-lg text-slate-600">
                Your accountant stays in Tally. We handle everything else.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Plug, title: "Works With Your Current System", desc: "No migration. No data exports. We connect via API or SFTP while your team works exactly as before.", color: "from-blue-500 to-cyan-500" },
                { icon: Zap, title: "Live in 2 Weeks, Not 6 Months", desc: "Pre-built connectors for 15+ ERPs mean 8-day average setup. Most competitors quote 3-6 months.", color: "from-amber-500 to-orange-500" },
                { icon: Shield, title: "100% FTA Acceptance Guarantee", desc: "Our validation engine catches errors before submission. If FTA rejects it, we fix it free within 4 hours.", color: "from-green-500 to-emerald-500" },
                { icon: RefreshCw, title: "Automatic Everything", desc: "Create invoice in your ERP → Finvise validates, transforms, and submits → You get confirmation. Zero manual steps.", color: "from-purple-500 to-pink-500" },
                { icon: Users, title: "White-Glove Onboarding", desc: "Dedicated account manager handles setup. We train your team, not the other way around.", color: "from-indigo-500 to-blue-500" },
                { icon: Headphones, title: "Local UAE Support", desc: "Arabic and English speakers in Dubai. <2 hour response during business hours. Not an offshore ticket queue.", color: "from-teal-500 to-green-500" },
              ].map((item) => (
                <div key={item.title} className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== SECURITY ==================== */}
        <SecuritySection />

        {/* ==================== PRICING ==================== */}
        <PricingSection onNavigateToAssessment={onNavigateToAssessment} />

        {/* ==================== LEAD MAGNETS ==================== */}
        <LeadMagnetsSection />

        {/* ==================== FAQ ==================== */}
        <FAQSection onNavigateToAssessment={onNavigateToAssessment} />

        {/* ==================== FINAL CTA ==================== */}
        <section className="py-16 bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              Ready to Make E-Invoicing One Less Thing to Worry About?
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Share your ERPs, invoice volumes, and current workflows. We'll map out exactly how Finvise 
              would plug into your stack and what your FTA-compliant future looks like.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onNavigateToAssessment}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 transition-all"
              >
                Book Free Assessment
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onNavigateToLogin}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-slate-600 text-slate-200 hover:border-slate-400 rounded-xl font-medium transition-all"
              >
                Already using Finvise? Login
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/Finvise.png" alt="Finvise" className="h-30 brightness-50 invert" />
              <span className="text-slate-500 text-sm">Your Bridge to UAE Digital Compliance</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-600">
            © {new Date().getFullYear()} Finvise.
          </div>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}