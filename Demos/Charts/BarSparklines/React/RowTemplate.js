import React from 'react';

import Sparkline, {
  Tooltip
} from 'devextreme-react/sparkline';

export default function RowTemplate(props) {
  return (
    <tr>
      <th>{props.year}</th>
      <td>
        <Sparkline
          dataSource={props.source}
          showMinMax={true}
          className="sparkline"
          argumentField="month"
          valueField={`alum${props.year}`}
          type="bar"
        >
          <Tooltip format="currency" />
        </Sparkline>
      </td>
      <td>
        <Sparkline
          dataSource={props.source}
          showMinMax={true}
          showFirstLast={false}
          className="sparkline"
          argumentField="month"
          valueField={`nickel${props.year}`}
          type="bar"
          barPositiveColor="#6babac"
          minColor="#9ab57e"
          maxColor="#8076bb"
        >
          <Tooltip format="currency" />
        </Sparkline>
      </td>
      <td>
        <Sparkline
          dataSource={props.source}
          className="sparkline"
          argumentField="month"
          valueField={`copper${props.year}`}
          type="bar"
          barPositiveColor="#e55253"
          firstLastColor="#ebdd8f"
          pointColor="#e8c267"
        >
          <Tooltip format="currency" />
        </Sparkline>
      </td>
    </tr>
  );
}

