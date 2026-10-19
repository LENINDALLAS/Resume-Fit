import { Button } from "primereact/button";
import { LogIn, LogOut } from "lucide-react";
import { useAppDispatch, useAuth } from "../../hooks";
import { logout } from "../../store";

interface PopupHeaderProps {
  onLoginClick: () => void;
}

export function PopupHeader({ onLoginClick }: PopupHeaderProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <strong style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-primary)" }}>
        <img src="/icons/icon.svg" alt="" width={22} height={22} />
        Resume-Fit
      </strong>

      {isAuthenticated ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user && <span className="text-secondary" style={{ fontSize: "0.8rem" }}>{user.name}</span>}
          <Button
            label="Logout"
            icon={<LogOut size={14} style={{ marginRight: 4 }} />}
            text
            size="small"
            onClick={() => dispatch(logout())}
          />
        </div>
      ) : (
        <Button
          label="Log in"
          icon={<LogIn size={14} style={{ marginRight: 4 }} />}
          text
          size="small"
          onClick={onLoginClick}
        />
      )}
    </div>
  );
}
