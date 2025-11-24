"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle, Shield, Clock, Network, ArrowRight, Play,
  Menu, X, Star, TrendingUp, Award, HelpCircle, ChevronDown, Calculator
} from "lucide-react";

interface HomepageProps {
  onNavigateToLogin: () => void;
}

/** Shared animated gradient CTA used across Login / Start Free Trial */
function AnimatedCTA({
  children,
  onClick,
  href,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
}) {
  const Tag: any = href ? "a" : "button";
  const commonProps: any = {
    className:
      "group relative inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold " +
      // base
      "text-slate-800 border border-slate-300/80 bg-white shadow-sm " +
      // hover anim
      "hover:text-white hover:border-transparent " +
      // focus
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 " +
      // transition
      "transition-colors",
    "aria-label": ariaLabel,
  };
  if (!href) commonProps.type = "button";
  if (onClick) commonProps.onClick = onClick;
  if (href) commonProps.href = href;

  return (
    <Tag {...commonProps}>
      {/* animated gradient fill layer */}
      <span
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600
                   opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
      {/* foreground content */}
      <span className="relative z-[1] flex items-center gap-2">
        {children}
      </span>
    </Tag>
  );
}

/** Animated Counter */
function AnimatedCounter({ end, prefix = "" }: { end: number; prefix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 2000;
    const start = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(end * progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end]);
  return <span>{prefix}{count.toLocaleString()}</span>;
}

/** ROI Calculator */
function ROICalculator() {
  const [invoices, setInvoices] = useState(500);
  const [hours, setHours] = useState(0.5);
  const [rate, setRate] = useState(150);

  const manualCost = invoices * hours * rate;
  const saved = Math.max(0, Math.round(manualCost * 0.8 - 799));
  const timeSaved = Math.round(invoices * hours * 0.8);

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-200">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-8 h-8 text-teal-700" />
        <h3 className="text-2xl font-bold text-slate-900">ROI Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Invoices per month: <span className="font-semibold text-slate-900">{invoices}</span>
          </label>
          <input
            type="range" min={100} max={5000} step={100} value={invoices}
            onChange={(e) => setInvoices(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Hours per invoice: <span className="font-semibold text-slate-900">{hours}</span>
          </label>
          <input
            type="range" min={0.1} max={2} step={0.1} value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Hourly rate (AED): <span className="font-semibold text-slate-900">{rate}</span>
          </label>
          <input
            type="range" min={50} max={500} step={10} value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-700 mb-1">Monthly Savings</div>
          <div className="text-2xl font-bold text-emerald-700">
            AED {saved.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-sm text-slate-700 mb-1">Time Saved</div>
          <div className="text-2xl font-bold text-teal-700">{timeSaved}h/mo</div>
        </div>
      </div>
    </div>
  );
}

export default function Homepage({ onNavigateToLogin }: HomepageProps) {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, accepted: 0, pending: 0 });

  useEffect(() => {
    const t = setTimeout(() => setStats({ total: 1247, accepted: 1198, pending: 49 }), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 bg-teal-600 text-white px-4 py-2 rounded-md shadow-lg z-50 font-medium"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Primary">
          <div className="flex justify-between items-center h-20">
            {/* Left: Logo */}
            <a href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded">
              <img
                src="/Finvise.png"
                alt="InvoiceFlow logo"
                className="object-contain w-28 h-21 sm:w-36 sm:h-25"
              />
            </a>

            {/* Middle: Nav (desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-700 hover:text-teal-700 transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-slate-700 hover:text-teal-700 transition-colors font-medium">Pricing</a>
              <a href="#resources" className="text-slate-700 hover:text-teal-700 transition-colors font-medium">Resources</a>
            </div>

            {/* Right: CTAs (desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <AnimatedCTA onClick={onNavigateToLogin} ariaLabel="Login">
                Login
              </AnimatedCTA>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Open menu"
              className="md:hidden p-2 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-6 h-6 text-slate-800" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main id="main">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-teal-200">
              <CheckCircle className="w-4 h-4" />
              FTA Ready &amp; PEPPOL-capable
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              UAE E-Invoicing Compliance
              <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mt-2">
                in 15 Minutes
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 mb-8">
              Stay compliant without changing your accounting software.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {/* Start Free Trial now matches the Login animated button */}
              <AnimatedCTA href="#start" ariaLabel="Start Free Trial">
                Start Free Trial
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </AnimatedCTA>

              <a
                href="#demo"
                className="border-2 border-slate-300 text-slate-800 px-8 py-4 rounded-xl hover:border-teal-600 hover:bg-teal-50 transition-all flex items-center justify-center gap-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-700 mb-4">
              {["No credit card required", "14-day free trial", "Cancel anytime"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-teal-700" />
                  <span className="font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c, i) => (
                    <span key={i} className={`w-3 h-3 rounded-full ${c}`} />
                  ))}
                </div>
                <div className="text-sm text-slate-600 font-medium">Live Dashboard</div>
                <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Connected
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 md:p-6 rounded-xl border border-teal-200 hover:shadow-md transition">
                  <div className="text-sm text-teal-900 mb-2 font-medium">Total Invoices</div>
                  <div className="text-3xl md:text-4xl font-bold text-teal-900">
                    {stats.total > 0 ? <AnimatedCounter end={stats.total} /> : "0"}
                  </div>
                  <div className="mt-2 text-xs text-teal-800 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% this month
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl border border-green-200 hover:shadow-md transition">
                  <div className="text-sm text-green-900 mb-2 font-medium">Accepted</div>
                  <div className="text-3xl md:text-4xl font-bold text-green-900">
                    {stats.accepted > 0 ? <AnimatedCounter end={stats.accepted} /> : "0"}
                  </div>
                  <div className="mt-2 text-xs text-green-800">96% success rate</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl border border-blue-200 hover:shadow-md transition">
                  <div className="text-sm text-blue-900 mb-2 font-medium">Pending</div>
                  <div className="text-3xl md:text-4xl font-bold text-blue-900">
                    {stats.pending > 0 ? <AnimatedCounter end={stats.pending} /> : "0"}
                  </div>
                  <div className="mt-2 text-xs text-blue-900/80">Avg. 2min processing</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { id: "INV-2025-001", customer: "Al Khaleej Trading LLC", amount: "AED 15,420", status: "accepted" },
                  { id: "INV-2025-002", customer: "Emirates Solutions FZ", amount: "AED 8,750", status: "accepted" },
                  { id: "INV-2025-003", customer: "Dubai Tech Industries", amount: "AED 22,100", status: "pending" }
                ].map(inv => (
                  <div key={inv.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200">
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <div className="text-xs font-mono text-slate-700 bg-white px-2 py-1 rounded border">{inv.id}</div>
                      <div className="text-sm text-slate-900 font-medium">{inv.customer}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-slate-900">{inv.amount}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inv.status === "accepted" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800 animate-pulse"
                      }`}>
                        {inv.status === "accepted" ? "✓ Accepted" : "⏱ Processing"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption & SOC 2" },
                { icon: Clock, title: "15-Min Setup", desc: "No IT team required" },
                { icon: Network, title: "PEPPOL-capable", desc: "Government-ready" },
                { icon: Award, title: "99.9% Uptime", desc: "SLA guaranteed" }
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="w-16 h-16 rounded-full bg-teal-400/20 flex items-center justify-center mb-4 group-hover:bg-teal-400/30 transition">
                    <f.icon className="w-8 h-8 text-teal-200" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-300 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Trusted by businesses across the UAE</h2>
              <p className="mt-3 text-slate-700">See how companies streamline compliance with InvoiceFlow</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { company: "Emirates Trading Co.", quote: "InvoiceFlow reduced our invoice processing time by 80%.", author: "Sarah Al-Mansoori", role: "Finance Director", metric: "80% faster" },
                { company: "Dubai Tech Solutions", quote: "The validation engine caught errors we didn't know existed.", author: "Ahmed Hassan", role: "CFO", metric: "100% compliance" },
                { company: "Gulf Retail Group", quote: "Processing 5,000+ invoices monthly is now effortless.", author: "Fatima Al-Zaabi", role: "Operations Manager", metric: "Zero errors" }
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-800 mb-6">"{t.quote}"</p>
                  <div className="flex justify-between items-end pt-4 border-t">
                    <div>
                      <div className="font-semibold text-slate-900">{t.author}</div>
                      <div className="text-sm text-slate-700">{t.role}</div>
                      <div className="text-xs text-slate-600">{t.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-teal-700">{t.metric}</div>
                      <div className="text-xs text-slate-600">improvement</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Calculate your savings</h2>
              <p className="text-slate-700">See how much InvoiceFlow can save your business</p>
            </div>
            <ROICalculator />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Simple, transparent pricing</h2>
            <p className="text-slate-200 text-center mb-10">Start free. Upgrade when you scale.</p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Starter", price: "AED 0", note: "14-day trial", features: ["100 invoices", "CSV upload", "Email support"] },
                { name: "Growth", price: "AED 799", note: "/month", featured: true, features: ["2,500 invoices", "API access", "All ERPs", "Priority support"] },
                { name: "Scale", price: "Custom", note: "", features: ["Unlimited", "SLA & SSO", "Dedicated support"] }
              ].map((p, i) => (
                <div key={i} className={`relative rounded-2xl border p-8 bg-white ${p.featured ? 'border-teal-600 ring-2 ring-teal-100 scale-105' : 'border-slate-200'}`}>
                  {p.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-bold text-xl text-slate-900">{p.name}</h3>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">{p.price}</span>
                    <span className="text-slate-600 text-sm">{p.note}</span>
                  </div>
                  <ul className="mt-8 space-y-3">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-slate-800">
                        <CheckCircle className="w-5 h-5 text-teal-700 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <AnimatedCTA href="#start" ariaLabel={p.price === "AED 0" ? "Start Free" : "Choose Plan"}>
                    {p.price === "AED 0" ? "Start Free" : "Choose Plan"}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </AnimatedCTA>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="resources" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center mb-10 text-slate-900">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {[
                { q: "Do I need to change my ERP?", a: "No! InvoiceFlow integrates through APIs, CSV/Excel uploads, or SFTP." },
                { q: "How secure is my data?", a: "Bank-grade AES-256 encryption, SOC 2 Type II certified." },
                { q: "How fast is onboarding?", a: "Most teams submit their first test invoice in under 15 minutes." },
                { q: "What if an invoice is rejected?", a: "Instant feedback with clear error messages and step-by-step guidance." }
              ].map((f, i) => (
                <details key={i} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md group">
                  <summary className="flex items-start gap-3 cursor-pointer list-none">
                    <HelpCircle className="w-5 h-5 text-teal-700 mt-0.5 flex-shrink-0" />
                    <span className="font-medium flex-1 text-slate-900">{f.q}</span>
                    <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition flex-shrink-0" />
                  </summary>
                  <p className="mt-3 ml-8 text-sm text-slate-700">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-teal-600 to-blue-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to simplify UAE e-invoicing?</h2>
            <p className="text-xl text-teal-100 mb-8">Join 500+ businesses already using InvoiceFlow</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Start Free Trial now matches Login */}
              <AnimatedCTA href="#start" ariaLabel="Start Free Trial">
                Start Free Trial
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </AnimatedCTA>
              <a
                href="#demo"
                className="border-2 border-white/80 text-white/95 px-8 py-4 rounded-xl hover:bg-white/10 font-semibold text-lg inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                <Play className="w-5 h-5" />Watch Demo
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-slate-600">
            © {new Date().getFullYear()} InvoiceFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
