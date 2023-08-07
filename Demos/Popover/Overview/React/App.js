import React from 'react';
import { Popover } from 'devextreme-react/popover';

const animationConfig = {
  show: {
    type: 'pop',
    from: {
      scale: 0,
    },
    to: {
      scale: 1,
    },
  },
  hide: {
    type: 'fade',
    from: 1,
    to: 0,
  },
};

export default function App() {
  return (
    <div className="dx-fieldset form">
      <div className="dx-field">
        <div className="dx-field-label">Default mode</div>
        <div className="dx-field-value-static">
          <p>
            <span id="subject1">Google AdWords Strategy </span>
              (<a id="link1">details</a>)
          </p>
          <Popover
            target="#link1"
            showEvent="mouseenter"
            hideEvent="mouseleave"
            position="top"
            width={300}
          >
              Make final decision on whether we are going to
              increase our Google AdWord spend based
              on our 2013 marketing plan.
          </Popover>
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">With title</div>
        <div className="dx-field-value-static">
          <p>
            <span id="subject2">Rollout of New Website and Marketing Brochures </span>
              (<a id="link2">details</a>)
          </p>
          <Popover
            target="#link2"
            showEvent="mouseenter"
            hideEvent="mouseleave"
            position="top"
            width={300}
            showTitle={true}
            title="Details"
          >
              The designs for new brochures and
              website have been approved.
              Launch date is set for Feb 28.
          </Popover>
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">With animation</div>
        <div className="dx-field-value-static">
          <p>
            <span id="subject3">Create 2012 Sales Report </span>
              (<a id="link3">details</a>)
          </p>
          <Popover
            target="#link3"
            showEvent="mouseenter"
            hideEvent="mouseleave"
            position="top"
            width={300}
            animation={animationConfig}
          >
              2012 Sales Report has to be completed
              so we can determine if major changes
              are required to sales strategy.
          </Popover>
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">With overlay</div>
        <div className="dx-field-value-static">
          <p>
            <span id="subject4">Website Re-Design Plan </span>
              (<a id="link4">more</a>)
          </p>
          <Popover
            target="#link4"
            showEvent="click"
            position="top"
            width={300}
            shading={true}
            shadingColor="rgba(0, 0, 0, 0.5)"
          >
              The changes in our brochure designs for 2013 require
              us to update key areas of our website.
          </Popover>
        </div>
      </div>
    </div>
  );
}
