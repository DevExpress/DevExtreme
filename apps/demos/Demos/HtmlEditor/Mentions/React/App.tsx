import React from 'react';
import HtmlEditor from 'devextreme-react/html-editor';
import { employees } from './data.ts';

const mentionsConfig = [{
  dataSource: employees,
  searchExpr: 'text',
  displayExpr: 'text',
  valueExpr: 'text',
}];

export default function App() {
  return (
    <div>
      <div id="chat-window">
        <div className="message dx-theme-background-color" tabIndex={0}>
          <div className="photo">
            <img alt="Kevin Carter" src="../../../../images/mentions/Kevin-Carter.png" />
          </div>
          <div className="name">
              Kevin Carter
          </div>
          <div className="date">
              07/03/19 - 12:22AM
          </div>
          <div className="text">
            <span className="dx-mention" spellCheck="false"><span><span>@</span>John Heart</span></span> What experience do you have in this field?
          </div>
        </div>
        <br />
        <div className="message dx-theme-background-color" tabIndex={0}>
          <div className="photo">
            <img alt="John Heart" src="../../../../images/mentions/John-Heart.png" />
          </div>
          <div className="name">
              John Heart
          </div>
          <div className="date">
              07/03/19 - 12:25AM
          </div>
          <div className="text">
              I&apos;ve been in the audio/video industry since 2001,
              and I&apos;ve been the CEO of DevAv since 2009.
          </div>
        </div>
        <br />
        <div className="message dx-theme-background-color" tabIndex={0}>
          <div className="photo">
            <img alt="Kevin Carter" src="../../../../images/mentions/Kevin-Carter.png" />
          </div>
          <div className="name">
              Kevin Carter
          </div>
          <div className="date">
              07/03/19 - 12:26AM
          </div>
          <div className="text">
              That&apos;s very interesting. <span className="dx-mention" spellCheck="false"><span><span>@</span>Olivia Peyton</span></span>, what do you think?
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
