/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import { Button } from 'devextreme-react/button';
import { Chart } from 'devextreme-react/chart';
import { TextBox } from 'devextreme-react/text-box';
import { orangesByDay } from './data';
import Example from './example-block';

interface IState {
  currentTime: string;
  seriesName: string;
  series: any[];
}

class Updater extends React.Component<{ onChange: (value: string) => void }, { value: string }> {
  constructor(props: { onChange: (value: string) => void }) {
    super(props);
    this.state = {
      value: '',
    };

    this.update = this.update.bind(this);
    this.fireOnChange = this.fireOnChange.bind(this);
  }

  private fireOnChange() {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(value);
  }

  private update(e: any) {
    this.setState({
      value: e.value,
    });
  }

  public render() {
    const { value } = this.state;
    return (
      <div className="dx-field">
        <div className="dx-field-label">
          <TextBox value={value} onValueChanged={this.update} valueChangeEvent="input" />
        </div>
        <div className="dx-field-value">
          <Button text="Update series name" onClick={this.fireOnChange} />
        </div>
      </div>
    );
  }
}

export default class extends React.Component<any, IState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      currentTime: this.GetTimeString(),
      seriesName: 'My oranges',
      series: [{
        argumentField: 'day',
        valueField: 'oranges',
        name: 'My oranges',
        type: 'line',
      }],
    };

    this.updateTime = this.updateTime.bind(this);
    this.updateSeriesName = this.updateSeriesName.bind(this);
  }

  private GetTimeString = () => new Date().toLocaleTimeString();

  private updateTime() {
    this.setState({
      currentTime: this.GetTimeString(),
    });
  }

  private updateSeriesName(seriesName: string) {
    const { series: stateSeries } = this.state;
    const series = [...stateSeries];
    series[0].name = seriesName;
    this.setState({
      seriesName,
      series,
    });
  }

  public render(): React.ReactNode {
    const { currentTime, series } = this.state;
    return (
      <Example title="DxChart" state={this.state}>

        <div className="paragraph dx-field">
          <div className="dx-field-label">
            {currentTime}
          </div>
          <div className="dx-field-value">
            <Button text="Update time" onClick={this.updateTime} />
          </div>
        </div>

        <div className="paragraph">
          <Updater onChange={this.updateSeriesName} />
        </div>

        <Chart dataSource={orangesByDay} series={series} />

      </Example>
    );
  }
}
