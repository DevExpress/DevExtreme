import React from 'react';

import Sparkline, {
  Tooltip,
} from 'devextreme-react/sparkline';

import {
  copperCosts,
  nickelCosts,
  palladiumCosts,
} from './data.ts';

interface RowTemplateProps {
  key: number;
  year: string;
}

export default function RowTemplate(props: RowTemplateProps) {
  return (
    <tr>
      <th>{ props.year }</th>
      <td>
        <Sparkline
          dataSource={copperCosts}
          showMinMax={true}
          winlossThreshold={8000}
          className="sparkline"
          argumentField="month"
          valueField={props.year}
          type="winloss"
        >
          <Tooltip format={{ type: 'currency', precision: 2 }} />
        </Sparkline>
      </td>
      <td>
        <Sparkline
          dataSource={nickelCosts}
          showMinMax={true}
          showFirstLast={false}
          winlossThreshold={19000}
          className="sparkline"
          argumentField="month"
          valueField={props.year}
          type="winloss"
          winColor="#6babac"
          lossColor="#8076bb"
        >
          <Tooltip format={{ type: 'currency', precision: 2 }} />
        </Sparkline>
      </td>
      <td>
        <Sparkline
          dataSource={palladiumCosts}
          winlossThreshold={2000}
          className="sparkline"
          argumentField="month"
          valueField={props.year}
          type="winloss"
          firstLastColor="#e55253"
          winColor="#7e4452"
          lossColor="#ebdd8f"
        >
          <Tooltip format={{ type: 'currency', precision: 2 }} />
        </Sparkline>
      </td>
    </tr>
  );
}
