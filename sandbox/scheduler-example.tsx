import * as React from 'react';
import { Scheduler } from 'devextreme-react/scheduler';
import Example from './example-block';
import { appointments } from './data';

class DateCell extends React.PureComponent<any> {
  public render(): React.ReactNode {
    const { data } = this.props;
    const { date: now, text } = data;
    const start = new Date(now.getFullYear(), 0, 0).getTime();
    const dayNumber = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return (
      <div style={{ height: '50px', color: now.getDay() % 6 === 0 ? 'red' : '' }}>
        <h4>{text}</h4>
        <h5>{dayNumber}</h5>
      </div>
    );
  }
}

export default (): React.ReactElement | null => (
  <Example title="DxScheduler">
    <Scheduler
      dateCellComponent={DateCell}
      dataSource={appointments}
      height={400}
      startDayHour={9}
      defaultCurrentView="week"
      defaultCurrentDate={new Date(2017, 4, 25)}
    />
  </Example>
);
