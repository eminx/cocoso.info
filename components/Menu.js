import PropTypes from "prop-types";
import useTranslation from "next-translate/useTranslation";
import { Anchor, Box, Menu as GrMenu, Text } from "grommet";
import { Link } from "react-scroll";
import { getSections } from "../config/content";

function Menu({ setActiveSection, activeSection, large, ...otherProps }) {
  const { t, lang } = useTranslation("common");

  const sections = getSections(t);
  if (!sections) {
    return null;
  }

  return (
    <Box
      width={!large ? "100%" : "small "}
      background={large ? "none" : "white"}
      style={{
        position: "fixed",
        zIndex: 10,
        top: large ? 150 : 0,
        left: !large && 0,
      }}
      {...otherProps}
    >
      {large ? (
        <Box>
          {sections.map((s, i) => {
            const isActive = s.title === activeSection;
            return (
              <Link
                key={s.title}
                activeClass="menuitem-active"
                className="menuitem"
                to={s.title}
                spy
                hashSpy
                smooth
                duration={500}
                onSetActive={(section) => setActiveSection(section)}
                style={{
                  display: "block",
                  textDecoration: "none",
                  paddingTop: 6,
                  paddingBottom: 6,
                }}
              >
                <Anchor
                  color="dark-2"
                  weight={isActive ? "bold" : "normal"}
                  as="span"
                  style={{ fontWeight: isActive ? 800 : 400 }}
                >
                  {s.title}
                </Anchor>
              </Link>
            );
          })}
          <Link to="credits" smooth duration={500} style={{ marginTop: 24 }}>
            <Anchor as="span">{t("credits")}</Anchor>
          </Link>
          <Link to="contact" smooth duration={500}>
            <Anchor as="span">{t("contact")}</Anchor>
          </Link>
          <Anchor target="_blank" href="https://github.com/eminx/cocoso">
            {t("sourceCode")}
          </Anchor>
        </Box>
      ) : (
        <Box pad="xsmall" width="100%">
          <GrMenu
            alignSelf="center"
            tabIndex="0"
            label={<Text>{t("features").toUpperCase()}</Text>}
            items={sections.map((s) => ({
              label: s.title,
              href: `#${s.title}`,
              size: "large",
            }))}
          />
        </Box>
      )}
    </Box>
  );
}

Menu.propTypes = {
  setActiveSection: PropTypes.func.isRequired,
  large: PropTypes.bool.isRequired,
};

export default Menu;
