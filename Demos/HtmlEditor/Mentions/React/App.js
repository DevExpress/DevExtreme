import React from 'react';
import { employees } from './data.js';
import HtmlEditor from 'devextreme-react/html-editor';

const mentionsConfig = [{
  dataSource: employees,
  searchExpr: 'text',
  displayExpr: 'text',
  valueExpr: 'text'
}];

class App extends React.Component {
  render() {
    return (
      <div>
        <div id="chat-window">
          <div className="message dx-theme-background-color">
            <div className="photo">
              <img src="../../../../images/mentions/Kevin-Carter.png" />
            </div>
            <div className="name">
              {'Kevin Carter'}
            </div>
            <div className="date">
              {'07/03/19 - 12:22AM'}
            </div>
            <div className="text">
              <span className="dx-mention" spellCheck="false"><span><span>@</span>John Heart</span></span> {'What experience do you have in this field?'}
            </div>
          </div>
          <br />
          <div className="message dx-theme-background-color">
            <div className="photo">
              <img src="../../../../images/mentions/John-Heart.png" />
            </div>
            <div className="name">
              {'John Heart'}
            </div>
            <div className="date">
              {'07/03/19 - 12:25AM'}
            </div>
            <div className="text">
              {"I've been in the audio/video industry since 2001, and I've been the CEO of DevAv since 2009."}
            </div>
          </div>
          <br />
          <div className="message dx-theme-background-color">
            <div className="photo">
              <img src="../../../../images/mentions/Kevin-Carter.png" />
            </div>
            <div className="name">
              {'Kevin Carter'}
            </div>
            <div className="date">
              {'07/03/19 - 12:26AM'}
            </div>
            <div className="text">
              {"That's very interesting."} <span className="dx-mention" spellCheck="false"><span><span>@</span>Olivia Peyton</span></span>{', what do you think?'}
            </div>
          </div>
        </div>
        <HtmlEditor
          mentions={mentionsConfig}>
          <p>
            <span className="dx-mention" spellCheck="false" data-marker="@" data-mention-value="Kevin Carter"><span><span>@</span>Kevin Carter</span></span>
            {" I think John's expertise can be very valuable in our startup."}
          </p>
        </HtmlEditor>
      </div>
    );
  }
}

export default App;
