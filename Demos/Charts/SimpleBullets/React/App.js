import React from 'react';
import Bullet, { Tooltip } from 'devextreme-react/bullet';
import { service } from './data.js';

function customizeTooltip(arg) {
  return {
    text: `Current t&#176: ${arg.value} &#176C<br>Average t&#176:${arg.target}&#176C`,
  };
}

function App() {
  return (
    <div id="chart-demo">
      <div className="long-title"><h3>Daily temperature</h3></div>
      <table className="demo-table">
        <tbody>
          <tr>
            <th></th>
            <th>June</th>
            <th>July</th>
            <th>August</th>
          </tr>
          {service.getWeeksData().map((week, i) => (
            <tr key={i}>
              <th>{`${week.weekCount} week`}</th>
              {week.bulletsData.map((data, j) => (
                <td key={j}>
                  <Bullet
                    className="bullet"
                    startScaleValue={0}
                    endScaleValue={35}
                    value={data.value}
                    target={data.target}
                    color={data.color}
                  >
                    <Tooltip customizeTooltip={customizeTooltip} />
                  </Bullet>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
