import React, { useState } from 'react';
import {
  Box,
  Footer,
  Heading,
  Image,
  Main,
  Paragraph,
  Form,
  FormField,
  TextInput,
  TextArea,
  Button,
} from 'grommet';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';
import { Link } from 'react-scroll';

import Gr from '../components/Gr';
import Menu from '../components/Menu';
import { sections } from '../config/content';

function getHSL(length, index, opacity = 1) {
  return `hsla(${(360 / (length + 1)) * (index + 1)}, 62%, 56%, ${opacity})`;
}

const IndexPage = () => {
  const [activeSection, setActiveSection] = useState('Intro');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = ({ value }) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://formspree.io/xvowqleb');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;
      if (xhr.status === 200) {
        setSuccess(true);
      } else {
        setError(true);
      }
    };
    xhr.send(value);
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
                      setActiveSection={(section) => setActiveSection(section)}
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
                      className="mainImage niceImage"
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
                        {s.content.map((p) => (
                          <Paragraph key={p.substring(0, 20)} color="dark-1">
                            {p}
                          </Paragraph>
                        ))}
                      </Box>
                    ))}
                    <Box
                      background="dark-3"
                      pad="medium"
                      margin={{ top: '100px' }}
                    >
                      <Heading
                        color="light-1"
                        level={2}
                        style={{
                          letterSpacing: '-.5px',
                          fontFamily: 'Sarabun',
                        }}
                      >
                        We can work together
                      </Heading>
                      <Paragraph size="small">
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
                        <Button type="submit" label="Send" />
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
