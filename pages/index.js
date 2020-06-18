import {
  Box,
  Header,
  Footer,
  Heading,
  Main,
  Text,
  Paragraph,
  Markdown,
} from 'grommet';
import { Container, Row, Col, ScreenClassRender } from 'react-grid-system';

import Nav from '../components/Nav';
import Gr from '../components/Gr';
import { intro, userAccounts } from '../config/content'

const sections = [`Intro`, `Activities`, `Resources`, `Calendar`, `Processes`, `Members`, `Info`]

const IndexPage = () => (
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
                <Box pad="medium" style={{ position: 'fixed' }}>
                  {sections.map(s => <Box pad="xsmall">
                    <Text size="large">{s}</Text>
                  </Box>)}
                </Box>
              </Col>
              <Col lg={5}>
                <Box>
                  <Heading level={2}>Intro</Heading>
                  {intro.map(p => <Paragraph>{p}</Paragraph>)}
                </Box>

                <Box>
                  <Heading level={2}>User Accounts</Heading>
                  {userAccounts.map(p => <Paragraph>{p}</Paragraph>)}
                </Box>
              </Col>
              <Col lg={4}>

              </Col>
            </Row>
            <Footer></Footer>
          </Container>
        )
      }}
    />
  </Gr>
);

export default IndexPage;
