import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/src/context/ThemeContext";
import "./Navbar.css";

interface DashboardNavbarProps {
  onImport: () => void;
  onLogout: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onImport,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const lastY = lastScrollYRef.current;
        const delta = currentY - lastY;

        if (currentY <= 0) {
          setIsHidden(false);
        } else if (Math.abs(delta) >= 8) {
          if (delta > 0 && currentY > 80) {
            setIsHidden(true);
          } else if (delta < 0) {
            setIsHidden(false);
          }
        }

        lastScrollYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stickyTone = isHidden
    ? "navbar__sticky navbar__sticky--hidden"
    : "navbar__sticky";

  return (
    <div className={stickyTone}>
      <div className="navbar__shell">
        <div className="navbar__layout">
          <div className="navbar__brand">
            <h1 className="navbar__title">Finance Manager</h1>
            <p className="navbar__subtitle">
              Controle suas financas em um unico painel
            </p>
          </div>

          <div className="navbar__actions">
            <button
              type="button"
              onClick={toggleTheme}
              className={`navbar__themeToggle ${
                theme === "dark"
                  ? "navbar__themeToggle--dark"
                  : "navbar__themeToggle--light"
              }`}
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              aria-pressed={theme === "dark"}
            >
              <span className="navbar__themeToggleTrack" aria-hidden="true">
                <svg
                  className="navbar__themeToggleIcon navbar__themeToggleIcon--sun"
                  viewBox="0 0 24 24"
                  role="presentation"
                  focusable="false"
                >
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6M19.1 19.1l-1.6-1.6M6.5 6.5 4.9 4.9" />
                </svg>
                <svg
                  className="navbar__themeToggleIcon navbar__themeToggleIcon--moon"
                  viewBox="0 0 24 24"
                  role="presentation"
                  focusable="false"
                >
                  <path d="M21 15.3A8.4 8.4 0 0 1 9.2 3.6a6.9 6.9 0 1 0 11.8 11.7Z" />
                </svg>
                <span className="navbar__themeToggleKnob" />
              </span>
            </button>
            <button
              type="button"
              onClick={onImport}
              className="navbar__button navbar__button--secondary"
            >
              Importar Excel
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="navbar__button navbar__button--primary"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
