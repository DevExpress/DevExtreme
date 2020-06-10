import React from 'react';

import ResponsiveBox, {
  Row,
  Col,
  Item,
  Location
} from 'devextreme-react/responsive-box';

function screen(width) {
  return (width < 700) ? 'sm' : 'lg';
}

class App extends React.Component {
  render() {
    return (
      <div id="page">
        <ResponsiveBox
          singleColumnScreen="sm"
          screenByWidth={screen}>
          <Row ratio={1}></Row>
          <Row ratio={2} screen="xs"></Row>
          <Row ratio={2}></Row>
          <Row ratio={1}></Row>

          <Col ratio={1}></Col>
          <Col ratio={2} screen="lg"></Col>
          <Col ratio={1}></Col>
          <Item>
            <Location
              row={0}
              col={0}
              colspan={3}
              screen="lg"
            ></Location>
            <Location
              row={0}
              col={0}
              colspan={2}
              screen="sm"
            ></Location>
            <div className="header item">
              <p>Header</p>
            </div>
          </Item>
          <Item>
            <Location
              row={1}
              col={1}
              screen="lg"
            ></Location>
            <Location
              row={1}
              col={0}
              colspan={2}
              screen="sm"
            ></Location>
            <div className="content item">
              <p>Content</p>
            </div>
          </Item>
          <Item>
            <Location
              row={1}
              col={0}
              screen="lg"
            ></Location>
            <Location
              row={2}
              col={0}
              screen="sm"
            ></Location>
            <div className="left-side-bar item">
              <p>Left Bar</p>
            </div>
          </Item>
          <Item>
            <Location
              row={1}
              col={2}
              screen="lg"
            ></Location>
            <Location
              row={2}
              col={1}
              screen="sm"
            ></Location>
            <div className="right-side-bar item">
              <p>Right Bar</p>
            </div>
          </Item>
          <Item>
            <Location
              row={2}
              col={0}
              colspan={3}
              screen="lg"
            ></Location>
            <Location
              row={3}
              col={0}
              colspan={2}
              screen="sm"
            ></Location>
            <div className="footer item">
              <p>Footer</p>
            </div>
          </Item>
        </ResponsiveBox>
      </div>
    );
  }
}

export default App;
