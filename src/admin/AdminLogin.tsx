import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

interface Props {
  onLogin?: () => void;
}

export function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { token } = await api.login(password);
      localStorage.setItem("gn_admin_token", token);
      onLogin?.();
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container section admin-login">
      <div className="login-card">
        <h1>Admin login</h1>
        <p className="muted">Enter the admin password to manage sweets.</p>
        <form onSubmit={submit}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              placeholder="••••••••"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary" disabled={busy} type="submit">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="muted small">
          Demo default password: <code>nakur-admin</code> (set{" "}
          <code>ADMIN_PASSWORD</code> on the server).
        </p>
      </div>
    </div>
  );
}
