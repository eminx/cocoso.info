import React from "react";
import Head from "next/head";
import { useTranslation } from "../lib/i18n";

import Grommet from "../components/Gr";
import StoryLayout from "../components/StoryLayout";
import { getFeatureSections } from "../config/content";

function FeaturesPage() {
  const { t } = useTranslation("common");

  const sections = getFeatureSections(t);

  if (!sections) {
    return null;
  }

  return (
    <Grommet>
      <Head>
        <title>
          {t("features.pageTitle")} | {t("meta.title")}
        </title>
        <meta name="description" content={t("meta.description")} />
      </Head>

      <StoryLayout
        sections={sections}
        pageTitle={t("features.pageTitle")}
        pageLead={t("features.pageLead")}
        groupLabels={{
          community: t("features.groupCommunityTitle"),
          admin: t("features.groupAdminTitle"),
        }}
      />
    </Grommet>
  );
}

export default FeaturesPage;
