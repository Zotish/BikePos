import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, X, Check } from "lucide-react";
import { useToast } from "../components/Toast";

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const { addToast } = useToast();
  const [showPass, setShowPass] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("demo@motoparts.com");
  const [password, setPassword] = useState("demo1234");
  const [businessName, setBusinessName] = useState("Rahim Motors Ltd");
  const [phone, setPhone] = useState("+880 1712-345678");

  // Modals
  const [forgotModal, setForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      addToast({
        title: "Account Created",
        message: `Welcome ${businessName}! Your account has been created.`,
        type: "success"
      });
    } else {
      addToast({
        title: "Signed In",
        message: "Successfully logged in to MotoParts ERP.",
        type: "success"
      });
    }
    onLogin();
  };

  const handleGoogleLogin = () => {
    addToast({
      title: "Google Authentication",
      message: "Signed in with Google (demo@motoparts.com).",
      type: "success"
    });
    onLogin();
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotModal(false);
    addToast({
      title: "Password Reset Link Sent",
      message: `If an account exists for ${resetEmail || email}, a reset link has been dispatched.`,
      type: "info"
    });
    setResetEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#243B53] flex-col items-center justify-center relative overflow-hidden p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 12 }).map((_, col) => (
              <div
                key={`${row}-${col}`}
                className="absolute"
                style={{ top: `${row * 80 + 20}px`, left: `${col * 100}px`, transform: "rotate(45deg)" }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="white" opacity="0.6">
                  <circle cx="20" cy="20" r="16" stroke="white" strokeWidth="2" fill="none" />
                  <circle cx="20" cy="20" r="5" fill="white" />
                </svg>
              </div>
            ))
          )}
        </div>

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-[#D85A30] rounded-2xl flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                <circle cx="12" cy="12" r="3.5" fill="white" />
                <path d="M12 3V6M12 18V21M3 12H6M18 12H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-2xl leading-tight">MotoParts ERP</div>
              <div className="text-[#94A3B8] text-xs font-medium tracking-wide">B2B Spare Parts Platform</div>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Your entire motorcycle parts<br />business, synchronized.
          </h2>
          <p className="text-[#94A3B8] text-[15px] leading-relaxed mb-8">
            Manage parts catalog, multi-branch inventory, POS billing, workshop job cards, and accounting in one unified cloud system.
          </p>

          {/* Feature list */}
          <div className="space-y-3 text-left bg-white/5 p-5 rounded-2xl border border-white/10 mb-8">
            {[
              "Real-time motorcycle model compatibility tracking",
              "Multi-branch & warehouse transfer management",
              "Fast offline-capable POS with bKash / Nagad",
              "Workshop service & technician commission billing",
              "AI reorder predictions & automated purchase orders",
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D85A30] flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[#CBD5E1] text-[13px]">{f}</span>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            {[["2,400+", "Active Outlets"], ["৳ 45Cr+", "Processed"], ["99.9%", "Uptime SLA"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold text-white">{val}</div>
                <div className="text-[11px] text-[#64748B]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[#F7F8FA]">
        <div className="w-full max-w-[420px]">
          <h1 className="text-2xl font-bold text-center text-[#111827] mb-6">
            {isRegister ? "Sign Up" : "Sign In"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <>
                <div>
                  <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-[13px] border border-[#E5E7EB] rounded-xl bg-white text-[#111827] focus:outline-none focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30]"
                    placeholder="e.g. Rahim Motors Ltd"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#374151] mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-[13px] border border-[#E5E7EB] rounded-xl bg-white text-[#111827] focus:outline-none focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30]"
                    placeholder="+880 1712-345678"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-[13px] border border-[#E5E7EB] rounded-xl bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-semibold text-[#374151]">Password</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setForgotModal(true);
                    }}
                    className="text-[12px] text-[#D85A30] font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 text-[13px] border border-[#E5E7EB] rounded-xl bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30]"
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#D85A30] hover:bg-[#B74421] text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-[14px] active:scale-[0.99]"
            >
              <span>{isRegister ? "Create Account" : "Sign In"}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="relative flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-[#E5E7EB]" />
            <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider">or sign in with</span>
            <div className="flex-1 border-t border-[#E5E7EB]" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full border border-[#E5E7EB] rounded-xl py-2.5 text-[13px] font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2.5 bg-white shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-[12px] text-[#9CA3AF] mt-6">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#D85A30] font-semibold hover:underline"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </p>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#E5E7EB] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-[#D85A30]" />
                <h3 className="font-bold text-sm text-[#111827]">Reset your password</h3>
              </div>
              <button
                onClick={() => setForgotModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] p-1"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleResetSubmit} className="py-4 space-y-3 text-xs">
              <p className="text-[#6B7280]">
                Enter your account email address and we'll send a secure password reset link to your inbox.
              </p>
              <div>
                <label className="font-semibold text-[#374151] block mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs focus:border-[#D85A30] outline-none"
                  placeholder="name@business.com"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F3F4F6]">
                <button
                  type="button"
                  onClick={() => setForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#111827]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#D85A30] hover:bg-[#B74421] text-white rounded-lg transition-colors shadow-sm"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
