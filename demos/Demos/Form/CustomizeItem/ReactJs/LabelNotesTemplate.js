import React from 'react';
import { Tooltip } from 'devextreme-react/tooltip';

function LabelNotesTemplate(data) {
  return (
    <React.Fragment>
      <div id="template-content">
        <i
          id="helpedInfo"
          className="dx-icon dx-icon-info"
        ></i>
        Additional
        <br />
        {data.text}
      </div>

      <Tooltip
        target="#helpedInfo"
        showEvent="mouseenter"
        hideEvent="mouseleave"
      >
        <div id="tooltip-content">This field must not exceed 200 characters</div>
      </Tooltip>
    </React.Fragment>
  );
}
export default LabelNotesTemplate;
