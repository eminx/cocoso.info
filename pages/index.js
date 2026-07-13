import React from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

import Grommet from "../components/Gr";
import StoryLayout from "../components/StoryLayout";
import Reveal from "../components/Reveal";
import { getHomeSections } from "../config/content";

function IndexPage() {
  const { t } = useTranslation("common");

  const sections = getHomeSections(t);

  if (!sections) {
    return null;
  }

  return (
    <Grommet>
      <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
      </Head>

      <StoryLayout
        sections={sections}
        heroTitle={t("brand.slogan")}
        heroLead={t("home.lead", {}, { returnObjects: true })}
        heroTags={t("home.leadTags", {}, { returnObjects: true })}
        afterSections={
          <div className="cta-card">
            <Reveal className="cta-card-inner reveal-fade">
              <h2 className="story-title">{t("home.ctaTitle")}</h2>
              <p className="story-text">{t("home.ctaBody")}</p>
              <div className="cta-row">
                <a className="btn-thick" href="/features">
                  {t("home.ctaButton")}
                </a>
                <a
                  className="btn-outline"
                  href="/contact"
                  style={{ color: "var(--paper)", borderColor: "var(--paper)" }}
                >
                  {t("home.ctaSecondary")}
                </a>
              </div>
            </Reveal>
          </div>
        }
      />
    </Grommet>
  );
}

export default IndexPage;
