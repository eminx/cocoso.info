import PropTypes from 'prop-types';
import { Anchor, Box, Menu as GrMenu, Text } from 'grommet';
import { Link } from 'react-scroll';
import { sections } from '../config/content';

const Menu = ({ setActiveSection, activeSection, large, ...otherProps }) => {
  return (
    <Box
      width={!large ? '100%' : 'small '}
      background={large ? 'none' : 'white'}
      style={{
        position: 'fixed',
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
                  display: 'block',
                  textDecoration: 'none',
                  paddingTop: 6,
                  paddingBottom: 6,
                }}
              >
                <Anchor
                  color="dark-2"
                  weight={isActive ? 'bold' : 'normal'}
                  as="span"
                  style={{ fontWeight: isActive ? 800 : 400 }}
                >
                  {s.title}
                </Anchor>
              </Link>
            );
          })}
          <Link
            as="span"
            to="contact"
            smooth
            duration={500}
            style={{ marginTop: 24 }}
          >
            <Anchor>Contact</Anchor>
          </Link>
          <Anchor target="_blank" href="https://github.com/eminx/cocoso">
            Source Code
          </Anchor>
        </Box>
      ) : (
        <Box pad="xsmall" width="100%">
          <GrMenu
            alignSelf="center"
            tabIndex="0"
            label={<Text>FEATURES</Text>}
            items={sections.map((s) => ({
              label: s.title,
              href: `#${s.title}`,
              size: 'large',
            }))}
          />
        </Box>
      )}
    </Box>
  );
};

Menu.propTypes = {
  setActiveSection: PropTypes.func.isRequired,
  large: PropTypes.bool.isRequired,
};

export default Menu;
