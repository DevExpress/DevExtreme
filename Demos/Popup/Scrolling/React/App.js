import React from 'react';

import { Popup, ScrollView } from 'devextreme-react';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Popup
        width={550}
        height={350}
        visible={true}
        showTitle={false}
        closeOnOutsideClick={false}>
        <ScrollView width='100%' height='100%'>
          <img src="../../../../images/Popup-Scrolling-Image.jpg" className="center" />
          <div id="textBlock">
            The <b>ScrollView</b> allows users to scroll its content vertically. To enable horizontal and vertical scrolling, set the <b>direction</b> option to <i>&quot;both&quot;</i>. Horizontal scrolling is available only if the content is wider than the <b>ScrollView</b>. Otherwise, the content adapts to the widget&apos;s width.<br /><br />The <b>ScrollView</b> uses native scrolling on most platforms, except desktops. To use it on all platforms, assign <b>true</b> to the <b>useNative</b> option. If you assign <b>false</b>, scrolling is simulated on all platforms.
          </div>
        </ScrollView>
      </Popup>
    );
  }
}

export default App;
