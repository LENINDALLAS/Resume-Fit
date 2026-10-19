import { Button } from "primereact/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAuth } from "../../hooks";
import { logout } from "../../store";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    await dispatch(logout());
    navigate("/login", { replace: true });
  }

  return (
    <header
      style={{
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <strong style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-primary)", fontSize: "1.1rem" }}>
          <img src="/icon.svg" alt="" width={28} height={28} />
          Resume-Fit
        </strong>

        {isAuthenticated && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user && <span className="text-secondary">{user.name}</span>}
            <Button
              label="Logout"
              icon={<LogOut size={16} style={{ marginRight: 6 }} />}
              outlined
              size="small"
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
    </header>
  );
}
