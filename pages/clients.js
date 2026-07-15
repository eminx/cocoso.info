import React from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { Anchor, Image, Text } from "grommet";

import Grommet from "../components/Gr";
import StoryLayout from "../components/StoryLayout";
import Reveal from "../components/Reveal";
import { getClientSections } from "../config/content";

function ClientsPage() {
  const { t } = useTranslation("common");

  const sections = getClientSections(t);

  if (!sections) {
    return null;
  }

  return (
    <Grommet>
      <Head>
        <title>
          {t("clients.pageTitle")} | {t("meta.title")}
        </title>
        <meta name="description" content={t("meta.description")} />
      </Head>

      <StoryLayout
        sections={sections}
        pageTitle={t("clients.pageTitle")}
        pageLead={t("clients.pageLead")}
        afterSections={
          <div className="credits-section">
            <div className="simple-card">
              <h2 className="simple-title" style={{ textAlign: "center" }}>
                {t("credits.title")}
              </h2>

              <Reveal className="credits-block reveal-fade">
                <Text textAlign="center">
                  {t("credits.first")}
                  <Anchor href="https://www.skogen.pm" target="_blank">
                    {" "}
                    Skogen
                  </Anchor>
                </Text>
                <Image width="220px" src="/credits/skogen.png" />
              </Reveal>

              <Reveal className="credits-block reveal-fade">
                <Text textAlign="center">{t("credits.second")}</Text>
                <Image height="100px" src="/credits/CCA.svg" />
                <Anchor href="https://currency.community" target="_blank">
                  Community Currency Alliance
                </Anchor>
              </Reveal>

              <Reveal className="credits-block reveal-fade">
                <Image width="160px" src="/credits/ge.png" />
                <Anchor href="https://www.grassrootseconomics.org" target="_blank">
                  Grassroots Economics
                </Anchor>
              </Reveal>

              <Reveal className="credits-block reveal-fade">
                <Image height="90px" src="/credits/circles.svg" />
                <Anchor href="https://joincircles.net" target="_blank">
                  Circles UBI
                </Anchor>
              </Reveal>

              <Reveal className="credits-block reveal-fade">
                <Image width="190px" src="/credits/lilo.png" />
                <Anchor href="https://www.laborislove.se" target="_blank">
                  Labor is Love
                </Anchor>
              </Reveal>
            </div>
          </div>
        }
      />
    </Grommet>
  );
}

export default ClientsPage;
