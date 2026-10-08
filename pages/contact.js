import React from "react";
import Head from "next/head";
import { useTranslation } from "../lib/i18n";
import { Box, Button, FormField, TextArea, TextInput } from "grommet";

import Grommet from "../components/Gr";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

function ContactPage() {
  const { t } = useTranslation("common");

  return (
    <Grommet>
      <Head>
        <title>
          {t("contact.title")} | {t("meta.title")}
        </title>
      </Head>

      <TopNav />

      <div className="simple-page">
        <div className="simple-card">
          <h1 className="simple-title">{t("contact.heading")}</h1>
          <p className="simple-body">{t("contact.body")}</p>

          <form action="https://formspree.io/f/xpqrdwpl" method="POST">
            <FormField label={t("contact.email")}>
              <TextInput name="email" type="email" />
            </FormField>
            <FormField label={t("contact.subject")}>
              <TextInput name="subject" />
            </FormField>
            <FormField label={t("contact.message")}>
              <TextArea name="message" />
            </FormField>
            <Box pad={{ top: "medium" }}>
              <Button type="submit" label={t("contact.send")} alignSelf="end" />
            </Box>
          </form>
        </div>
      </div>

      <Footer />
    </Grommet>
  );
}

export default ContactPage;
