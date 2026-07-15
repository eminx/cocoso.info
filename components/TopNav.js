import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import ActiveLink from "./ActiveLink";

const locales = [
  { label: "Deutsch", value: "de" },
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "Português (Brasil)", value: "pt-BR" },
  { label: "Português (Portugal)", value: "pt-PT" },
  { label: "Svenska", value: "sv" },
  { label: "Türkçe", value: "tr" },
];

function useClickOutside(onOutside) {
  const ref = useRef(null);

  useEffect(() => {
    function handle(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside();
      }
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, [onOutside]);

  return ref;
}

function Dropdown({ trigger, align = "right", children, panelClassName = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className="nav-dropdown" ref={ref}>
      {trigger(() => setOpen((v) => !v), open)}
      {open && (
        <div
          className={`nav-dropdown-panel nav-dropdown-panel--${align} ${panelClassName}`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function LanguageOptions({ currentLang }) {
  return (
    <>
      {locales.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`lang-option${item.value === currentLang ? " lang-option-active" : ""}`}
          onClick={async () => await setLanguage(item.value)}
        >
          {item.label}
        </button>
      ))}
    </>
  );
}

function BurgerIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <path d="M0 1H20" stroke="currentColor" strokeWidth="2.4" />
      <path d="M0 8H20" stroke="currentColor" strokeWidth="2.4" />
      <path d="M0 15H20" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
      <path
        d="M1 1L5 5.5L9 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TopNav() {
  const { t, lang } = useTranslation("common");

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.features"), href: "/features" },
    { label: t("nav.examples"), href: "/clients" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const currentLocale = locales.find((item) => item.value === lang) || locales[0];

  return (
    <>
      {/* Desktop floating pill */}
      <nav className="top-nav--desktop">
        <Link href="/">
          <a className="top-nav-logo">
            <img src="/cocoso-logo-small.png" alt="Cocoso" />
          </a>
        </Link>

        <div className="top-nav-links">
          {navItems.map((item) => (
            <ActiveLink key={item.href} href={item.href} activeClassName="nav-item-active">
              <a className="top-nav-link">{item.label}</a>
            </ActiveLink>
          ))}
        </div>

        <a
          className="btn-demo"
          href="https://demo.artistrun.space"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("nav.demo")}
        </a>

        <Dropdown
          align="right"
          trigger={(toggle, open) => (
            <button type="button" className="lang-trigger" onClick={toggle}>
              {currentLocale.label}
              <ChevronIcon />
            </button>
          )}
        >
          <LanguageOptions currentLang={lang} />
        </Dropdown>
      </nav>

      {/* Mobile bar */}
      <nav className="top-nav-mobile-bar">
        <Link href="/">
          <a className="top-nav-logo">
            <img src="/cocoso-logo-small.png" alt="Cocoso" />
          </a>
        </Link>

        <Dropdown
          align="right"
          trigger={(toggle, open) => (
            <button type="button" className="burger-trigger" onClick={toggle} aria-label="Menu">
              <BurgerIcon />
            </button>
          )}
          panelClassName="mobile-menu-panel"
        >
          <div className="mobile-menu-links">
            {navItems.map((item) => (
              <ActiveLink key={item.href} href={item.href} activeClassName="nav-item-active">
                <a className="mobile-menu-link">{item.label}</a>
              </ActiveLink>
            ))}
          </div>

          <a
            className="btn-demo btn-demo--mobile"
            href="https://demo.artistrun.space"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("nav.demo")}
          </a>

          <p className="mobile-menu-lang-label">{t("nav.language")}</p>
          <div className="mobile-menu-langs">
            <LanguageOptions currentLang={lang} />
          </div>
        </Dropdown>
      </nav>
    </>
  );
}

export default TopNav;
