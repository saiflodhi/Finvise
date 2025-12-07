"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle, ArrowLeft, ArrowRight, Phone, Shield,
  Clock, Building2, Mail, User, Briefcase, FileText,
  Calendar, Users, AlertTriangle, Zap, Lock
} from "lucide-react";

interface AssessmentPageProps {
  onNavigateBack: () => void;
}

export default function AssessmentPage({ onNavigateBack }: AssessmentPageProps) {
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(463);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    jobTitle: "",
    employeeCount: "",
    currentERP: "",
    invoicesPerMonth: "",
    currentlyCompliant: "",
    preferredDate: "",
    additionalNotes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const deadline = new Date('2026-06-01');
    const today = new Date();
    const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysUntilDeadline(days);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.currentERP) newErrors.currentERP = "Please select your current ERP";
    if (!formData.invoicesPerMonth) newErrors.invoicesPerMonth = "Please select your invoice volume";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">
            Assessment Booked Successfully!
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Thank you, {formData.fullName.split(' ')[0]}! Our compliance specialist will contact you within 24 hours to schedule your free 15-minute assessment.
          </p>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg mb-8">
            <h3 className="font-bold text-slate-900 mb-4">What happens next?</h3>
            <ul className="space-y-3 text-left">
              {[
                "We'll review your ERP and invoice volume",
                "A specialist will call you to schedule a convenient time",
                "During the call, we'll assess your compliance readiness",
                "You'll receive a custom implementation roadmap"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-xs">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={onNavigateBack}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-2 text-slate-600 hover:text-green-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <a href="/" className="flex items-center">
              <img src="/Finvise.png" alt="Finvise" className="h-8" />
            </a>
            <a
              href="tel:+97112345678"
              className="flex items-center gap-2 text-slate-600 hover:text-green-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">+971 1 234 5678</span>
            </a>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            
            {/* Left Column - Benefits */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="sticky top-24">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                  Book Your Free Compliance Assessment
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  Get a personalized roadmap to FTA compliance. No cost, no commitment — just expert guidance.
                </p>

                {/* Urgency Banner */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-red-800 mb-1">
                        {daysUntilDeadline} Days Until Deadline
                      </p>
                      <p className="text-sm text-red-700">
                        Phase 2 mandate begins June 2026. Non-compliance = AED 5,000 per invoice.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What You'll Get */}
                <h3 className="font-bold text-slate-900 mb-4">What You'll Get:</h3>
                <ul className="space-y-4 mb-8">
                  {[
                    { icon: FileText, text: "Personalized compliance readiness score" },
                    { icon: Calendar, text: "Custom implementation timeline for your business" },
                    { icon: Zap, text: "ERP-specific integration recommendations" },
                    { icon: Shield, text: "Risk assessment and penalty exposure analysis" },
                    { icon: Users, text: "Direct access to our compliance specialists" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-slate-700 pt-2">{item.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Lock, label: "Data Protected" },
                    { icon: Clock, label: "15 Min Call" },
                    { icon: Shield, label: "No Obligation" }
                  ].map((badge) => (
                    <div key={badge.label} className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
                      <badge.icon className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-medium text-slate-600">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Schedule Your Assessment</h2>
                    <p className="text-sm text-slate-500">Fill out the form and we'll contact you within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      Contact Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            id="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="Ahmed Al-Rashid"
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all ${
                              errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-300'
                            }`}
                          />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Work Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="ahmed@company.ae"
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all ${
                              errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
                            }`}
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Phone Number (UAE) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+971 50 123 4567"
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all ${
                              errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300'
                            }`}
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Job Title
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            id="jobTitle"
                            type="text"
                            value={formData.jobTitle}
                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                            placeholder="Finance Manager"
                            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      Company Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            id="companyName"
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            placeholder="ABC Trading LLC"
                            className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all ${
                              errors.companyName ? 'border-red-300 bg-red-50' : 'border-slate-300'
                            }`}
                          />
                        </div>
                        {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                      </div>

                      <div>
                        <label htmlFor="employeeCount" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Number of Employees
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <select
                            id="employeeCount"
                            value={formData.employeeCount}
                            onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all appearance-none bg-white"
                          >
                            <option value="">Select...</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-25">11-25 employees</option>
                            <option value="26-50">26-50 employees</option>
                            <option value="51-100">51-100 employees</option>
                            <option value="101-250">101-250 employees</option>
                            <option value="250+">250+ employees</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="currentERP" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Current ERP / Accounting System <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="currentERP"
                          value={formData.currentERP}
                          onChange={(e) => handleInputChange('currentERP', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all appearance-none bg-white ${
                            errors.currentERP ? 'border-red-300 bg-red-50' : 'border-slate-300'
                          }`}
                        >
                          <option value="">Select your ERP...</option>
                          <option value="tally">Tally ERP</option>
                          <option value="zoho">Zoho Books</option>
                          <option value="quickbooks">QuickBooks</option>
                          <option value="odoo">Odoo</option>
                          <option value="sap">SAP Business One</option>
                          <option value="oracle">Oracle NetSuite</option>
                          <option value="sage">Sage</option>
                          <option value="excel">Excel / Manual</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.currentERP && <p className="text-red-500 text-xs mt-1">{errors.currentERP}</p>}
                      </div>

                      <div>
                        <label htmlFor="invoicesPerMonth" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Invoices Per Month <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="invoicesPerMonth"
                          value={formData.invoicesPerMonth}
                          onChange={(e) => handleInputChange('invoicesPerMonth', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all appearance-none bg-white ${
                            errors.invoicesPerMonth ? 'border-red-300 bg-red-50' : 'border-slate-300'
                          }`}
                        >
                          <option value="">Select volume...</option>
                          <option value="<50">Less than 50</option>
                          <option value="50-100">50 - 100</option>
                          <option value="100-500">100 - 500</option>
                          <option value="500-1000">500 - 1,000</option>
                          <option value="1000-2500">1,000 - 2,500</option>
                          <option value="2500+">2,500+</option>
                        </select>
                        {errors.invoicesPerMonth && <p className="text-red-500 text-xs mt-1">{errors.invoicesPerMonth}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Are you currently using any e-invoicing solution?
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "no", label: "No, not yet" },
                          { value: "partial", label: "Partially implemented" },
                          { value: "yes", label: "Yes, fully compliant" },
                          { value: "unsure", label: "I'm not sure" }
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                              formData.currentlyCompliant === option.value
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="currentlyCompliant"
                              value={option.value}
                              checked={formData.currentlyCompliant === option.value}
                              onChange={(e) => handleInputChange('currentlyCompliant', e.target.value)}
                              className="sr-only"
                            />
                            <span className="text-sm font-medium">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                      Additional Information (Optional)
                    </h3>

                    <div>
                      <label htmlFor="additionalNotes" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Anything specific you'd like us to address?
                      </label>
                      <textarea
                        id="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                        placeholder="E.g., We have multiple entities, We need to integrate with a custom system, etc."
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                        isSubmitting
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30'
                      } text-white`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Booking Your Assessment...
                        </>
                      ) : (
                        <>
                          Book My Free Assessment
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-500 mt-4">
                      By submitting, you agree to our{' '}
                      <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>. 
                      We'll never share your information.
                    </p>
                  </div>
                </form>
              </div>

              {/* Alternative Contact */}
              <div className="mt-6 text-center">
                <p className="text-slate-600 mb-2">Prefer to talk now?</p>
                <a
                  href="tel:+97142345678"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call +971 4 234 5678
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/Finvise.png" alt="Finvise" className="h-6" />
              <span className="text-slate-400 text-sm">Your Bridge to UAE Digital Compliance</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>© {new Date().getFullYear()} Finvise</span>
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}