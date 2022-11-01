import React from 'react';
import { Tooltip } from 'devextreme-react/tooltip';

function LabelNotesTemplate(data) {
  return (
    <React.Fragment>
      <span>
        <i className="dx-icon dx-icon-comment"></i>
        Additional
        <br />
        <i id="helpedInfo" className="dx-icon dx-icon-info"></i>
        { data.text }
      </span>

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
