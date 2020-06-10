import React from 'react';

import Box, {
  Item
} from 'devextreme-react/box';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Box
          direction="row"
          width="100%"
          height={75}>
          <Item ratio={1}>
            <div className="rect demo-dark">
              ratio = 1
            </div>
          </Item>
          <Item ratio={2}>
            <div className="rect demo-light">
                ratio = 2
            </div>
          </Item>
          <Item ratio={1}>
            <div className="rect demo-dark">
              ratio = 1
            </div>
          </Item>
        </Box>
        <br />
        <Box
          direction="row"
          width="100%"
          height={75}>
          <Item
            ratio={0}
            baseSize={150}>
            <div className="rect demo-dark">
              150px
            </div>
          </Item>
          <Item
            ratio={1}>
            <Box
              className="demo-light"
              direction="row"
              width="100%"
              height={75}
              align="center"
              crossAlign="center">
              <Item
                ratio={0}
                baseSize={50}>
                <div className="small"></div>
              </Item>
              <Item
                ratio={0}
                baseSize={50}>
                <div className="small"></div>
              </Item>
              <Item
                ratio={0}
                baseSize={50}>
                <div className="small"></div>
              </Item>
            </Box>
          </Item>
          <Item
            ratio={0}
            baseSize="10%">
            <div className="rect demo-dark">
              10%
            </div>
          </Item>
        </Box>
        <br />
        <Box
          direction="col"
          width="100%"
          height={250}>
          <Item ratio={1}>
            <div className="rect demo-dark header">
              Header
            </div>
          </Item>
          <Item
            ratio={2}
            baseSize={0}>
            <Box
              direction="row"
              width="100%"
              height={125}>
              <Item ratio={1}>
                <div className="rect demo-dark">
                  Left Bar
                </div>
              </Item>
              <Item ratio={1}>
                <div className="rect demo-light">
                  Content
                </div>
              </Item>
              <Item ratio={1}>
                <div className="rect demo-dark">
                  Right Bar
                </div>
              </Item>
            </Box>
          </Item>
          <Item ratio={1}>
            <div className="rect demo-dark footer">
              Footer
            </div>
          </Item>
        </Box>
      </React.Fragment>
    );
  }
}

export default App;
