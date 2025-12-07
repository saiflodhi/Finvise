"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Shield,
  Network,
  ArrowRight,
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  Phone,
  Menu,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ============================================================================
 * TYPES & SCHEMAS
 * ============================================================================ */

interface LoginPageProps {
  onLogin: (user: { name: string; email: string }) => void;
  onBack: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  businessName: z.string().min(1, "Business name is required"),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{6,}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type FormData = SignupFormData;

/* ============================================================================
 * CONSTANTS
 * ============================================================================ */

const FORM_CONFIG = {
  passwordMinLength: 6,
  simulatedApiDelay: 300,
} as const;

const FEATURE_BULLETS = [
  { icon: CheckCircle, text: "FTA & ZATCA compliant", color: "from-emerald-500 to-teal-500" },
  { icon: Shield, text: "Bank-grade security", color: "from-blue-500 to-cyan-500" },
  { icon: Zap, text: "Real-time processing", color: "from-amber-500 to-orange-500" },
  { icon: Network, text: "All ERP integrations", color: "from-purple-500 to-pink-500" },
] as const;

const STATS = [
  { value: "500+", label: "Active Users", icon: TrendingUp },
  { value: "99.9%", label: "Uptime", icon: Sparkles },
  { value: "24/7", label: "Support", icon: Shield },
] as const;

const STYLE_CLASSES = {
  input: {
    base:
      "w-full py-3.5 rounded-xl outline-none transition-all duration-300 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300",
    focus:
      "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
    withIcon: "pl-12 pr-4",
    withRightIcon: "pl-12 pr-12",
    error: "border-red-400 focus:border-red-500 focus:ring-red-500/10",
    normal: "border-slate-300 hover:border-slate-400",
  },
  label: "block text-sm font-semibold text-slate-700 mb-2",
  error: "mt-2 text-sm text-red-600 font-medium",
} as const;

/* ============================================================================
 * API SERVICE
 * ============================================================================ */

class AuthService {
  // Only allow the demo credentials
  static async login(data: LoginFormData): Promise<{ name: string; email: string }> {
    await new Promise((resolve) => setTimeout(resolve, FORM_CONFIG.simulatedApiDelay));

    if (data.email !== "a@gmail.com" || data.password !== "Asdf@1234") {
      throw new Error("Invalid email or password. Use a@gmail.com / Asdf@1234");
    }

    return {
      name: "Demo User",
      email: data.email,
    };
  }

  static async signup(data: SignupFormData): Promise<{ name: string; email: string }> {
    await new Promise((resolve) => setTimeout(resolve, FORM_CONFIG.simulatedApiDelay));
    return {
      name: data.businessName,
      email: data.email,
    };
  }
}

/* ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================ */

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/* ============================================================================
 * REUSABLE COMPONENTS
 * ============================================================================ */

interface AnimatedCTAProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary";
}

function AnimatedCTA({
  children,
  type = "button",
  onClick,
  disabled,
  className = "",
  href,
  variant = "primary",
}: AnimatedCTAProps) {
  const baseClasses = cn(
    "group relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0",
    "focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30",
    variant === "primary" &&
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25",
    variant === "secondary" &&
      "bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-700",
    disabled && "opacity-60 cursor-not-allowed transform-none",
    className
  );

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"
        />
      )}
      <span className="relative z-[1] flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  );
}

interface InputWrapperProps {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
}

function InputWrapper({ children, leftIcon }: InputWrapperProps) {
  return (
    <div className="relative group">
      {leftIcon && (
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300"
          aria-hidden="true"
        >
          {leftIcon}
        </span>
      )}
      {children}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className={STYLE_CLASSES.label}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className={cn(STYLE_CLASSES.error, "flex items-center gap-1 animate-shake")}>
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  autoComplete: "current-password" | "new-password";
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, autoComplete, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <InputWrapper leftIcon={<Lock className="w-5 h-5" />}>
        <input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={cn(
            STYLE_CLASSES.input.base,
            STYLE_CLASSES.input.focus,
            STYLE_CLASSES.input.withRightIcon,
            error ? STYLE_CLASSES.input.error : STYLE_CLASSES.input.normal
          )}
          autoComplete={autoComplete}
          minLength={FORM_CONFIG.passwordMinLength}
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors duration-300"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </InputWrapper>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

interface GlobalErrorProps {
  message?: string;
}

function GlobalError({ message }: GlobalErrorProps) {
  if (!message) return null;

  return (
    <div
      className="bg-red-50 text-red-700 px-4 py-3.5 rounded-xl text-sm border-2 border-red-200 shadow-sm flex items-start gap-3 animate-slideDown"
      role="alert"
    >
      <span className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
      </span>
      <span className="font-medium">{message}</span>
    </div>
  );
}

/* ============================================================================
 * HEADER COMPONENT
 * ============================================================================ */

interface HeaderProps {
  onMenuClick?: () => void;
  onBack?: () => void;
}

function Header({ onMenuClick, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Primary">
        <div className="flex justify-between items-center h-20">
          <a
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
          >
            <div className="relative">
              <img
                src="/Finvise.png"
                alt="Finvise logo"
                className="relative object-contain w-28 h-21 sm:w-36 sm:h-25"
              />
            </div>
          </a>

          <div className="hidden md:flex items-center gap-4">
            {onBack && (
              <AnimatedCTA variant="secondary" onClick={onBack}>
                Back to Home
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </AnimatedCTA>
            )}
          </div>

          <button
            type="button"
            aria-label="Open menu"
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ============================================================================
 * BRANDING SECTION
 * ============================================================================ */
function BrandingSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-green-50/40 to-slate-50 p-8 lg:p-12 border border-slate-200 shadow-2xl shadow-slate-200/50">
      {/* Decorative Background Blurs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
          Welcome to Finvise
        </h1>

        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          UAE’s e-invoicing bridge between your ERP and accredited ASPs. Secure, compliant,
          and built for finance teams that can’t afford downtime.
        </p>

        {/* Feature Bullets */}
        <div className="space-y-4 mb-8">
          {FEATURE_BULLETS.map((bullet, index) => (
            <div
              key={bullet.text}
              className="flex items-center gap-4 group animate-slideRight"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center",
                  "transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                  bullet.color
                )}
              >
                <bullet.icon className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                {bullet.text}
              </span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {stat.label}
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * CUSTOM HOOK
 * ============================================================================ */

function useAuthForm(
  mode: "login" | "signup",
  onSuccess: (user: { name: string; email: string }) => void
) {
  const [globalError, setGlobalError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(
      mode === "login" ? loginSchema : signupSchema
    ) as any,
    mode: "onBlur",
  });

  const handleSubmit = async (data: FormData) => {
    setGlobalError(undefined);
    setIsSubmitting(true);

    try {
      const user =
        mode === "login"
          ? await AuthService.login(data as LoginFormData)
          : await AuthService.signup(data as SignupFormData);

      onSuccess(user);
    } catch (error) {
      setGlobalError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    globalError,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}

/* ============================================================================
 * MAIN LOGIN PAGE COMPONENT
 * ============================================================================ */

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { form, globalError, isSubmitting, handleSubmit } = useAuthForm(mode, onLogin);

  const {
    register,
    formState: { errors },
  } = form;

  const isLogin = mode === "login";
  const title = isLogin ? "Sign In" : "Create Account";
  const subtitle = isLogin
    ? "Use demo credentials to explore the dashboard."
    : "Get started with your 14-day free trial.";

  const toggleMode = () => {
    form.reset();
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header
        onMenuClick={() => console.log("Mobile menu not implemented")}
        onBack={onBack}
      />

      <main className="relative flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 items-stretch">
          <BrandingSection />

          <div className="relative bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 animate-fadeIn">
            {/* Decorative corner accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-tr-full"></div>

            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                      {title}
                    </h2>
                  </div>
                  <p className="text-slate-600 text-lg">{subtitle}</p>
                  {isLogin && (
                    <p className="mt-2 text-sm text-slate-500">
                      <span className="font-semibold">Email:</span> a@gmail.com &nbsp;•&nbsp;
                      <span className="font-semibold">Password:</span> Asdf@1234
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onBack}
                  className="hidden md:inline-flex text-sm text-slate-500 hover:text-slate-800 underline-offset-4 hover:underline"
                >
                  Back to home
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <GlobalError message={globalError} />

                {!isLogin && (
                  <FormField
                    label="Business Name"
                    required
                    error={!isLogin ? errors.businessName?.message : undefined}
                  >
                    <InputWrapper leftIcon={<Building2 className="w-5 h-5" />}>
                      <input
                        {...register("businessName")}
                        type="text"
                        placeholder="Your Business LLC"
                        className={cn(
                          STYLE_CLASSES.input.base,
                          STYLE_CLASSES.input.focus,
                          STYLE_CLASSES.input.withIcon,
                          errors.businessName
                            ? STYLE_CLASSES.input.error
                            : STYLE_CLASSES.input.normal
                        )}
                        autoComplete="organization"
                      />
                    </InputWrapper>
                  </FormField>
                )}

                <FormField label="Email Address" required error={errors.email?.message}>
                  <InputWrapper leftIcon={<Mail className="w-5 h-5" />}>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="a@gmail.com"
                      className={cn(
                        STYLE_CLASSES.input.base,
                        STYLE_CLASSES.input.focus,
                        STYLE_CLASSES.input.withIcon,
                        errors.email
                          ? STYLE_CLASSES.input.error
                          : STYLE_CLASSES.input.normal
                      )}
                      autoComplete="email"
                      inputMode="email"
                    />
                  </InputWrapper>
                </FormField>

                {!isLogin && (
                  <FormField label="Phone Number" error={errors.phone?.message}>
                    <InputWrapper leftIcon={<Phone className="w-5 h-5" />}>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+971 50 XXX XXXX"
                        className={cn(
                          STYLE_CLASSES.input.base,
                          STYLE_CLASSES.input.focus,
                          STYLE_CLASSES.input.withIcon,
                          errors.phone
                            ? STYLE_CLASSES.input.error
                            : STYLE_CLASSES.input.normal
                        )}
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </InputWrapper>
                  </FormField>
                )}

                <FormField label="Password" required error={errors.password?.message}>
                  <PasswordInput
                    {...register("password")}
                    placeholder="Asdf@1234"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    error={errors.password?.message}
                  />
                </FormField>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 focus:ring-2 transition-all"
                        aria-label="Remember me"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#forgot-password"
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}

                <AnimatedCTA
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  className="mt-4 w-full"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-5 h-5 rounded-full border-3 border-white/40 border-t-white animate-spin"></span>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </AnimatedCTA>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">or</span>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-slate-600 hover:text-slate-800 transition-colors font-medium"
                  >
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
                      {isLogin ? "Sign Up" : "Sign In"}
                    </span>
                  </button>
                </div>
              </form>

              {!isLogin && (
                <div className="mt-8 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl shadow-sm">
                  <div className="flex items-start gap-3 text-emerald-800">
                    <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                    </div>
                    <div className="text-sm">
                      <strong className="font-bold">14-day free trial</strong>
                      <span className="text-emerald-700">
                        {" "}
                        • No credit card required • Cancel anytime
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }

        .animate-slideRight {
          animation: slideRight 0.6s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
