import React, { useState } from 'react';
import {
  Box,
  Footer,
  Heading,
  Image,
  Main,
  Paragraph,
  FormField,
  TextInput,
  TextArea,
  Button,
} from 'grommet';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import { Link } from 'react-scroll';

import Gr from '../components/Gr';
import Menu from '../components/Menu';
import Tag from '../components/Tag';
import { sections } from '../config/content';

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 80%, ${opacity})`;
}

const IndexPage = () => {
  const [activeSection, setActiveSection] = useState('Intro');

  const handleSetActiveSection = (section) => {
    if (section === activeSection) {
      return;
    }
    setActiveSection(section);
  };

  return (
    <Gr>
      <ScreenClassRender
        render={(screenClass) => {
          const large = ['xxl', 'xl', 'lg'].includes(screenClass);
          return (
            <Container>
              <Row>
                <Col lg={2}>
                  {large && (
                    <Link
                      style={{ position: 'fixed', paddingBottom: 30 }}
                      className="header-logo-container"
                      to="start"
                      href="#"
                      spy
                      hashSpy
                      smooth
                      duration={500}
                    >
                      <Box
                        className="header-logo"
                        margin={{
                          top: 'large',
                          bottom: 'medium',
                        }}
                      />
                    </Link>
                  )}
                  <Box>
                    <Menu
                      activeSection={activeSection}
                      setActiveSection={(section) =>
                        handleSetActiveSection(section)
                      }
                      large={large}
                    />
                  </Box>
                </Col>

                <Col lg={5} name="start">
                  <Box
                    margin={{
                      top: large ? '155px' : '100px',
                      bottom: large ? 'xlarge' : 'none',
                    }}
                  >
                    <Image
                      className="mainImage"
                      fit="contain"
                      src="/cocoso-logo.png"
                      width={large ? '320px' : 'medium'}
                    />
                  </Box>

                  <Box margin={{ bottom: '140px' }}>
                    <Heading
                      level={1}
                      color="dark-2"
                      style={{
                        letterSpacing: '-1px',
                        textTransform: 'uppercase',
                        fontSize: 36,
                        lineHeight: 1.3,
                      }}
                    >
                      Community Cooperation Software
                    </Heading>
                  </Box>

                  <Main margin={{ bottom: '300px' }}>
                    {sections.map((s) => (
                      <Box key={s.title} id={s.title} pad={{ top: 'large' }}>
                        <Heading
                          color="dark-2"
                          level={2}
                          style={{ fontSize: 24, letterSpacing: '-1px' }}
                        >
                          {s.title.toUpperCase()}
                        </Heading>

                        <Box direction="row" gap="small" wrap>
                          {s.tags.map((tag, tagIndex) => (
                            <Tag
                              label={tag}
                              key={tag}
                              margin={{ bottom: 'small' }}
                              background={getHSL(s.tags.length, tagIndex)}
                              color="dark-2"
                            />
                          ))}
                        </Box>

                        {s.image && (
                          <Box
                            width="100%"
                            border={{ color: 'accent-3' }}
                            margin={{ top: 'large', bottom: 'large' }}
                          >
                            <Image src={s.image} fit="contain" fill />
                          </Box>
                        )}

                        <Box>
                          {s.content.map((p) => (
                            <Paragraph key={p.substring(0, 20)} color="dark-1">
                              {p}
                            </Paragraph>
                          ))}
                        </Box>
                      </Box>
                    ))}
                    <Box
                      background="white"
                      border={{ color: 'accent-2' }}
                      pad="medium"
                      margin={{ top: '100px' }}
                    >
                      <Heading
                        level={2}
                        style={{
                          letterSpacing: '-.5px',
                          fontFamily: 'Sarabun',
                        }}
                      >
                        We can work together
                      </Heading>
                      <Paragraph size="large">
                        Do you have a project that you may have use of Cocoso?
                        Drop us a message here, and we'll get back to you!
                      </Paragraph>

                      <form
                        action="https://formspree.io/xvowqleb"
                        method="POST"
                      >
                        <FormField label="Your email address">
                          <TextInput name="email" type="email" />
                        </FormField>
                        <FormField label="Subject">
                          <TextInput name="subject" />
                        </FormField>
                        <FormField label="Message">
                          <TextArea name="message" />
                        </FormField>
                        <Box pad={{ top: 'medium' }}>
                          <Button type="submit" label="Send" alignSelf="end" />
                        </Box>
                      </form>
                    </Box>
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
                    animation="slideLeft"
                  >
                    <Image
                      fit={large ? 'cover' : 'contain'}
                      fill
                      // alignSelf="start"
                      className="niceImage"
                      src={
                        sections.find((s) => s.title === activeSection)
                          .sliderImage
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
