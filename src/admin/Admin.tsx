import { useState } from "react";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";

export function Admin() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("gn_admin_token")
  );

  function refresh() {
    setToken(localStorage.getItem("gn_admin_token"));
  }

  return token ? (
    <AdminDashboard onLogout={refresh} />
  ) : (
    <AdminLogin onLogin={refresh} />
  );
}
