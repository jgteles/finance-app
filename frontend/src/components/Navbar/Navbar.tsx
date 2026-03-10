import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";

interface DashboardNavbarProps {
  onImport: () => void;
  onLogout: () => void;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  onImport,
  onLogout,
}) => {
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
