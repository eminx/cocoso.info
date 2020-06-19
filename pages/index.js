import React, { useState } from 'react';
import { Box, Footer, Heading, Image, Main, Paragraph, Text } from 'grommet';
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
                <Col lg={2}>
                  {/* <Box margin={{ top: 'xlarge', bottom: 'xlarge' }}>
                    <Image
                      className="logo niceImage"
                      src="/cocoso-logo.png"
                      width="168px"
                      height="30px"
                    />
                  </Box> */}
                  <Box margin={{ top: 'xlarge' }}>
                    <Menu
                      activeSection={activeSection}
                      setActiveSection={(section) => setActiveSection(section)}
                      large={large}
                    />
                  </Box>
                </Col>
                <Col lg={5}>
                  <Box margin={{ top: 'xlarge', bottom: 'xlarge' }}>
                    <Image
                      // className="logo niceImage"
                      src="/cocoso-logo.png"
                      width="500px"
                      height="90px"
                    />
                  </Box>

                  <Box direction="row">
                    <Box alignSelf="center">
                      <Heading level={1} color="dark-1">
                        Community Cooperation Software.
                      </Heading>
                      <Heading level={3} color="accent-3" size="large">
                        Digital Tools for Local Engagement
                      </Heading>
                    </Box>
                  </Box>
                  <Main margin={{ bottom: '500px' }}>
                    {sections.map((s) => (
                      <Box key={s.title} id={s.title} pad={{ top: 'large' }}>
                        <Heading color="dark-1" level={2}>
                          {s.title}
                        </Heading>
                        {s.content.map((p) => (
                          <Paragraph
                            // size="large"
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
                  lg={5}
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Box
                    onMouseEnter={() => console.log('geldi')}
                    onMouseLeave={() => console.log('gitti')}
                    width={screenClass === 'md' ? '200px' : '450px'}
                    height="100vh"
                    justify="start"
                    style={
                      large || screenClass === 'md'
                        ? { position: 'fixed', top: '0', right: 0 }
                        : null
                    }
                  >
                    <Image
                      fit={large ? 'cover' : 'contain'}
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
