import React, { useState } from 'react';
import {
  Anchor,
  Box,
  Footer,
  Heading,
  Image,
  Main,
  Paragraph,
  Text,
} from 'grommet';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';

import Gr from '../components/Gr';
import Menu from '../components/Menu';
import { sections } from '../config/content';

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 56%, ${opacity})`;
}

const IndexPage = () => {
  const [activeSection, setActiveSection] = useState('Intro');

  return (
    <Gr>
      <ScreenClassRender
        render={(screenClass) => {
          const large = ['lg', 'xl'].includes(screenClass);
          return (
            <Container>
              <Row>
                <Col lg={2.5} />
                <Col lg={5.5}>
                  <Box direction="row">
                    <Box alignSelf="center">
                      <Heading level={1} color="dark-1">
                        Community Cooperation Software
                      </Heading>
                      <Text color="dark-1">
                        with Digital Tools for Local Engagement
                      </Text>
                    </Box>
                  </Box>
                </Col>
              </Row>

              <Row>
                <Col lg={2.5}>
                  <Menu
                    activeSection={activeSection}
                    setActiveSection={(section) => setActiveSection(section)}
                    large={large}
                  />
                </Col>
                <Col lg={5.5}>
                  <Main margin={{ bottom: '500px' }}>
                    {sections.map((s) => (
                      <Box key={s.title} id={s.title} pad={{ top: 'large' }}>
                        <Heading color="dark-1" level={2}>
                          {s.title}
                        </Heading>
                        {s.content.map((p) => (
                          <Paragraph
                            size="large"
                            color="dark-1"
                            key={p.substring(0, 10)}
                          >
                            {p}
                          </Paragraph>
                        ))}
                      </Box>
                    ))}
                  </Main>
                </Col>
                <Col
                  lg={4}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Box
                    width={screenClass === 'md' ? '200px' : '300px'}
                    height="900px"
                    justify="start"
                    style={
                      large || screenClass === 'md'
                        ? { position: 'fixed', top: '-150px' }
                        : null
                    }
                  >
                    <Image
                      fit="contain"
                      fill
                      // alignSelf="start"
                      className={'niceImage'}
                      src={
                        sections.find((s) => s.title === activeSection).image
                      }
                    />
                  </Box>
                </Col>
              </Row>
              <Footer></Footer>
            </Container>
          );
        }}
      />
    </Gr>
  );
};

export default IndexPage;
