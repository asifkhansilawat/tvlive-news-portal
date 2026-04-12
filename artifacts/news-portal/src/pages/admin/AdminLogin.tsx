import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Newspaper, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const adminLogin = useAdminLogin();

  if (isAuthenticated) {
    setLocation("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    adminLogin.mutate(
      { data: { username, password } },
      {
        onSuccess: (data) => {
          if (data.success && data.token) {
            login(data.token);
            setLocation("/admin/dashboard");
          } else {
            setError("Login failed");
          }
        },
        onError: () => {
          setError("Invalid credentials. Try admin / admin123");
        },
      }
    );
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Newspaper className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white font-hindi mb-1">
            दैनिक<span className="text-primary">भास्कर</span>
          </h1>
          <p className="text-slate-400 text-sm">Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sign In</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm" data-testid="text-login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  required
                  data-testid="input-username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 pl-10 pr-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  required
                  data-testid="input-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminLogin.isPending}
              className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 mt-2"
              data-testid="button-login-submit"
            >
              {adminLogin.isPending ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
