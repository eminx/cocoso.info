import React from "react";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

function Footer() {
  const { t } = useTranslation("common");
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-rainbow" />
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/cocoso-logo-small.png" alt="Cocoso" />
          <p>{t("footer.tagline")}</p>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">{t("footer.exploreTitle")}</p>
          <Link href="/">
            <a>{t("nav.home")}</a>
          </Link>
          <Link href="/features">
            <a>{t("nav.features")}</a>
          </Link>
          <Link href="/contact">
            <a>{t("nav.contact")}</a>
          </Link>
          <Link href="/credits">
            <a>{t("nav.credits")}</a>
          </Link>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">{t("footer.projectTitle")}</p>
          <a href="https://github.com/eminx/cocoso" target="_blank" rel="noopener noreferrer">
            {t("nav.sourceCode")}
          </a>
          <a href="https://demo.artistrun.space" target="_blank" rel="noopener noreferrer">
            {t("nav.demo")}
          </a>
          <p className="footer-license">{t("footer.license")}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t("footer.bottom", { year })}</p>
      </div>
    </footer>
  );
}

export default Footer;
