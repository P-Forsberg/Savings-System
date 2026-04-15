import { Home, PlusCircle, FolderOpen, Clock, Settings } from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";

const links = [
  { to: "/", icon: Home, label: "Hem" },
  { to: "/create", icon: PlusCircle, label: "Nytt mål" },
  { to: "/categories", icon: FolderOpen, label: "Kategorier" },
  { to: "/history", icon: Clock, label: "Historik" },
  { to: "/settings", icon: Settings, label: "Inställningar" },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {links.map(({ to, icon: Icon, label }) => (
          <RouterNavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `bottom-nav-link ${isActive ? "bottom-nav-link-active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </RouterNavLink>
        ))}
      </div>
    </nav>
  );
}
