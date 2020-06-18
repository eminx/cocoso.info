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
                <Box direction="row">
                  <Box alignSelf="center">
                    <Heading level={1}>Cocoso</Heading>
                    <Text>Digital Tools for Local Engagement</Text>
                  </Box>
                </Box>
              </Row>

              <Row>
                <Col lg={3}>
                  <Menu
                    activeSection={activeSection}
                    setActiveSection={(section) => setActiveSection(section)}
                    large={large}
                  />
                </Col>
                <Col lg={5}>
                  <Main>
                    {sections.map((s) => (
                      <Box key={s.title} id={s.title} pad={{ top: 'xlarge' }}>
                        <Heading level={2}>{s.title}</Heading>
                        {s.content.map((p) => (
                          <Paragraph key={p.substring(0, 10)}>{p}</Paragraph>
                        ))}
                      </Box>
                    ))}
                  </Main>
                </Col>
                <Col lg={4}>
                  <Box style={{ position: 'fixed' }}>
                    <Box height="small" width="medium" overflow="hidden">
                      <Image
                        fit="cover"
                        src={
                          sections.find((s) => s.title === activeSection).image
                        }
                      />
                    </Box>
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
