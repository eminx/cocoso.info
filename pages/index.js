import React, { useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import {
  Anchor,
  Box,
  Footer,
  Heading,
  Image,
  Main,
  Paragraph,
  FormField,
  Text,
  TextInput,
  TextArea,
  Button,
} from "grommet";
import { Container, Row, Col, ScreenClassRender } from "react-grid-system";
import { Link as ScrollLink } from "react-scroll";

import Grommet from "../components/Gr";
import Menu from "../components/Menu";
import Tag from "../components/Tag";
import { getSections } from "../config/content";

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 80%, ${opacity})`;
}

function IndexPage() {
  const { t, lang } = useTranslation("common");
  const introTitle = t("introTitle");
  const [activeSection, setActiveSection] = useState(introTitle);
  const [showCaption, setShowCaption] = useState(false);

  const handleSetActiveSection = (section) => {
    if (section === activeSection) {
      return;
    }
    setActiveSection(section);
  };

  const sections = getSections(t);

  if (!sections) {
    return null;
  }

  return (
    <Grommet>
      <Head>
        Community Cooperation Software | calendar, resources, events management,
        activities, workshops, processes, education, time plannning
      </Head>
      <ScreenClassRender
        render={(screenClass) => {
          const large = ["xxl", "xl", "lg"].includes(screenClass);
          return (
            <Container>
              <Row>
                <Col lg={2}>
                  {large && (
                    <ScrollLink
                      style={{ position: "fixed", paddingBottom: 30 }}
                      className="header-logo-container"
                      to="start"
                      href="#"
                      spy
                      // hashSpy
                      smooth
                      duration={500}
                    >
                      <Box
                        className="header-logo"
                        margin={{
                          top: "large",
                          bottom: "medium",
                        }}
                      />
                    </ScrollLink>
                  )}
                  <Box>
                    <Menu
                      activeSection={activeSection}
                      setActiveSection={handleSetActiveSection}
                      large={large}
                    />
                  </Box>
                </Col>

                <Col
                  lg={5}
                  name="start"
                  style={{ backgroundColor: "rgba(255, 255, 255, .5)" }}
                >
                  <Box
                    margin={{
                      top: large ? "155px" : "100px",
                      bottom: large ? "xlarge" : "none",
                    }}
                  >
                    <Image
                      className="mainImage"
                      fit="contain"
                      src="/cocoso-logo.png"
                      width={large ? "320px" : "medium"}
                    />
                  </Box>

                  <Box margin={{ bottom: "140px" }}>
                    <Heading
                      level={1}
                      color="dark-2"
                      style={{
                        letterSpacing: "-1px",
                        textTransform: "uppercase",
                        fontSize: 36,
                        lineHeight: 1.3,
                      }}
                    >
                      {t("slogan")}
                    </Heading>
                  </Box>

                  <Main margin={{ bottom: "300px" }}>
                    {sections.map((s) => (
                      <Box key={s.title} id={s.title} pad={{ top: "large" }}>
                        <Heading
                          color="dark-2"
                          level={2}
                          style={{
                            fontSize: 24,
                            letterSpacing: "-1px",
                            textTransform: "uppercase",
                          }}
                        >
                          {s.title}
                        </Heading>

                        <Box direction="row" wrap>
                          {s.tags?.map((tag, tagIndex) => (
                            <Tag
                              label={tag}
                              key={tag}
                              margin={{ bottom: "small", right: "small" }}
                              background={getHSL(s.tags.length, tagIndex)}
                            />
                          ))}
                        </Box>

                        {s.image && (
                          <Box
                            width="100%"
                            border={{ color: "accent-3" }}
                            margin={{ top: "large", bottom: "large" }}
                          >
                            <Image src={s.image} fit="contain" fill />
                          </Box>
                        )}

                        <Box>
                          {s.content?.map((p) => (
                            <Paragraph key={p.substring(0, 20)} color="dark-1">
                              {p}
                            </Paragraph>
                          ))}
                        </Box>
                      </Box>
                    ))}

                    <Box
                      id="credits"
                      margin={{ vertical: "large" }}
                      pad="medium"
                      border={{ color: "accent-3" }}
                    >
                      <Box pad={{ vertical: "medium" }}>
                        <Text textAlign="center">
                          {t("creditsFirst")}
                          <Anchor href="https://www.skogen.pm" target="_blank">
                            {" "}
                            Skogen
                          </Anchor>
                        </Text>
                        <Box pad="small" alignSelf="center">
                          <Image
                            width="260px"
                            height="130px"
                            src="/credits/skogen.png"
                          />
                        </Box>
                      </Box>

                      <Box pad={{ vertical: "medium" }}>
                        <Text textAlign="center">{t("creditsSecond")} </Text>
                        <Box width="small" alignSelf="center">
                          <Image
                            height="120px"
                            src="/credits/CCA.svg"
                            alignSelf="center"
                          />
                        </Box>
                        <Box alignSelf="center" margin={{ bottom: "medium" }}>
                          <Anchor
                            href="https://currency.community"
                            target="_blank"
                          >
                            Community Currency Alliance
                          </Anchor>
                        </Box>

                        <Box alignSelf="center" margin={{ bottom: "medium" }}>
                          <Image
                            width="185px"
                            height="120px"
                            src="/credits/ge.png"
                          />
                          <Anchor
                            href="https://www.grassrootseconomics.org"
                            target="_blank"
                            style={{ textAlign: "center" }}
                          >
                            Grassroots Economics
                          </Anchor>
                        </Box>

                        <Box width="medium" pad="small" alignSelf="center">
                          <Image
                            height="100px"
                            margin={{ bottom: "small" }}
                            src="/credits/circles.svg"
                          />
                          <Box alignSelf="center">
                            <Anchor
                              href="https://joincircles.net"
                              target="_blank"
                            >
                              Circles UBI
                            </Anchor>
                          </Box>
                        </Box>

                        <Box pad="small" alignSelf="center">
                          <Image
                            width="223px"
                            height="132px"
                            src="/credits/lilo.png"
                          />
                          <Anchor
                            href="https://www.laborislove.se"
                            target="_blank"
                            style={{ textAlign: "center" }}
                          >
                            Labor is Love
                          </Anchor>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      id="contact"
                      background="white"
                      border={{ color: "accent-2" }}
                      pad="medium"
                      margin={{ top: "100px" }}
                    >
                      <Heading
                        level={2}
                        style={{
                          letterSpacing: "-.5px",
                          fontFamily: "Sarabun",
                        }}
                      >
                        {t("contactTitle")}
                      </Heading>
                      <Paragraph size="large">{t("contactBody")}</Paragraph>

                      <form
                        action="https://formspree.io/xvowqleb"
                        method="POST"
                      >
                        <FormField label={t("contactForm.email")}>
                          <TextInput name="email" type="email" />
                        </FormField>
                        <FormField label={t("contactForm.subject")}>
                          <TextInput name="subject" />
                        </FormField>
                        <FormField label={t("contactForm.message")}>
                          <TextArea name="message" />
                        </FormField>
                        <Box pad={{ top: "medium" }}>
                          <Button
                            type="submit"
                            label={t("contactForm.send")}
                            alignSelf="end"
                          />
                        </Box>
                      </form>
                    </Box>
                  </Main>
                </Col>
                <Col
                  lg={5}
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    onMouseEnter={() => setShowCaption(true)}
                    onMouseLeave={() => setShowCaption(false)}
                    width={screenClass === "md" ? "0" : "38%"}
                    height="100vh"
                    justify="start"
                    style={
                      large || screenClass === "md"
                        ? { position: "fixed", top: "0", right: 0 }
                        : null
                    }
                    animation="slideLeft"
                  >
                    <Image
                      fit={large ? "cover" : "contain"}
                      fill
                      className="niceImage"
                      src={
                        sections.find((s) => s.title === activeSection)
                          ?.sliderImage
                      }
                    />
                    {showCaption && (
                      <Box
                        style={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          paddingLeft: 12,
                          paddingRight: 12,
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        <Paragraph size="large" color="dark-1">
                          {
                            sections.find((s) => s.title === activeSection)
                              ?.sliderCaption.title
                          }
                        </Paragraph>
                        <Anchor
                          target="_blank"
                          href={
                            sections.find((s) => s.title === activeSection)
                              .sliderCaption.link
                          }
                          alignSelf="end"
                          margin={{ bottom: "medium", right: "medium" }}
                        >
                          <Text>{t("source")}</Text>
                        </Anchor>
                      </Box>
                    )}
                  </Box>
                </Col>
              </Row>
              <Footer></Footer>
            </Container>
          );
        }}
      />
    </Grommet>
  );
}

export default IndexPage;
