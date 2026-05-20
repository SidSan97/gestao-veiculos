"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from '../../css/sidebar.module.css';

const navItems = [
  { href: "/", label: "Home" },
  { href: "/cadastrar-veiculo", label: "Cadastrar veículo" },
];

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_COLLAPSED_WIDTH = "4.5rem";
const MOBILE_RAIL_WIDTH = "3.5rem";

function useBootstrap() {
  useEffect(() => {
    void import("bootstrap");
  }, []);
}

type NavLinksProps = {
  onNavigate?: () => void;
  className?: string;
};

function NavLinks({ onNavigate, className = "" }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={`nav nav-pills flex-column gap-1 ${className}`.trim()}>
      {navItems.map(({ href, label }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <li className="nav-item" key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              className={`nav-link ${isActive ? styles.activeLink : styles.inactiveLink}`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

type SidebarLayoutProps = {
  children: React.ReactNode;
};

export function SidebarLayout({ children }: SidebarLayoutProps) {
  useBootstrap();

  const [collapsed, setCollapsed] = useState(false);

  const closeOffcanvas = useCallback(() => {
    const element = document.getElementById("sidebarOffcanvas");
    if (!element) return;

    void import("bootstrap").then(({ Offcanvas }) => {
      Offcanvas.getInstance(element)?.hide();
    });
  }, []);

  return (
    <div className="d-flex min-vh-100 w-100">
      {/* Mobile: faixa fixa + offcanvas */}
      <div
        className={`app-sidebar-rail d-md-none position-fixed top-0 start-0 bottom-0 ${styles.mobileSidebar} border-end d-flex flex-column align-items-center py-3 gap-2`}
        style={{ width: MOBILE_RAIL_WIDTH, zIndex: 1040 }}
      >
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary border"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon" />
        </button>
      </div>

      <div
        className="offcanvas offcanvas-start d-md-none"
        tabIndex={-1}
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-semibold" id="sidebarOffcanvasLabel">
            Gestão de Veículos
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Fechar"
          />
        </div>
        <div className="offcanvas-body">
          <NavLinks onNavigate={closeOffcanvas} />
        </div>
      </div>

      {/* Desktop: sidebar fixo e recolhível */}
      <aside
        className={`d-none d-md-flex flex-column flex-shrink-0 border-end ${styles.desktopSidebar}`}
        style={{
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          transition: "width 0.2s ease-in-out",
        }}
      >
        <div className="d-flex align-items-center gap-2 p-3 border-bottom">
          {!collapsed && (
            <span className={styles.sidebarTitle}>
              Gestão de Veículos
            </span>
          )}
          <button
            type="button"
            className={`btn btn-sm btn-outline-secondary ${collapsed ? "mx-auto" : "ms-auto"}`}
            onClick={() => setCollapsed((value) => !value)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {!collapsed ? (
          <div className="p-3">
            <NavLinks />
          </div>
        ) : (
          <div className="p-2 d-flex flex-column align-items-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCollapsed(false)}
              title="Expandir menu"
              aria-label="Expandir menu"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>
        )}
      </aside>

      <main className="flex-grow-1 overflow-auto app-main-content">
        {children}
      </main>
    </div>
  );
}
