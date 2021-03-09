import React from 'react';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import DateBox from 'devextreme-react/date-box';
import Calendar from 'devextreme-react/calendar';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      minDateValue: null,
      maxDateValue: null,
      disabledDates: null,
      firstDay: 0,
      currentValue: new Date(),
      cellTemplate: null,
      disabled: false,
      zoomLevel: 'month'
    };
    this.onCurrentValueChanged = this.onCurrentValueChanged.bind(this);
    this.onDisabledChanged = this.onDisabledChanged.bind(this);
    this.onZoomLevelValueChanged = this.onZoomLevelValueChanged.bind(this);
    this.onZoomLevelChanged = this.onZoomLevelChanged.bind(this);
    this.setMinDate = this.setMinDate.bind(this);
    this.setMaxDate = this.setMaxDate.bind(this);
    this.disableWeekend = this.disableWeekend.bind(this);
    this.setFirstDay = this.setFirstDay.bind(this);
    this.useCellTemplate = this.useCellTemplate.bind(this);
  }

  render() {
    const {
      currentValue,
      minDateValue,
      maxDateValue,
      disabledDates,
      firstDay,
      disabled,
      zoomLevel,
      cellTemplate
    } = this.state;
    return (
      <div id="calendar-demo">
        <div className="widget-container">
          <Calendar
            id="calendar-container"
            value={currentValue}
            onValueChanged={this.onCurrentValueChanged}
            onOptionChanged={this.onZoomLevelChanged}
            min={minDateValue}
            max={maxDateValue}
            disabledDates={disabledDates}
            firstDayOfWeek={firstDay}
            disabled={disabled}
            zoomLevel={zoomLevel}
            cellRender={cellTemplate} />
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              defaultValue={false}
              text="Specified min value"
              onValueChanged={this.setMinDate} />
          </div>
          <div className="option">
            <CheckBox
              defaultValue={false}
              text="Specified max value"
              onValueChanged={this.setMaxDate} />
          </div>
          <div className="option">
            <CheckBox
              defaultValue={false}
              text="Disable weekend"
              onValueChanged={this.disableWeekend} />
          </div>
          <div className="option">
            <CheckBox
              defaultValue={false}
              text="Monday as the first day of a week"
              onValueChanged={this.setFirstDay} />
          </div>
          <div className="option">
            <CheckBox
              defaultValue={false}
              text="Use the Custom Cell Template"
              onValueChanged={this.useCellTemplate} />
          </div>
          <div className="option">
            <CheckBox
              value={disabled}
              text="Disabled"
              onValueChanged={this.onDisabledChanged} />
          </div>
          <div className="option">
            <span>Zoom level</span>
            <SelectBox
              id="zoom-level"
              dataSource={['month', 'year', 'decade', 'century']}
              value={zoomLevel}
              onValueChanged={this.onZoomLevelValueChanged} />
          </div>
          <div className="option">
            <span>Selected date</span>
            <DateBox
              id="selected-date"
              value={currentValue}
              width="100%"
              onValueChanged={this.onCurrentValueChanged} />
          </div>
        </div>
      </div>
    );
  }

  onCurrentValueChanged(e) {
    this.setState({
      currentValue: e.value
    });
  }

  onDisabledChanged(e) {
    this.setState({
      disabled: e.value
    });
  }

  onZoomLevelValueChanged(e) {
    this.setState({
      zoomLevel: e.value
    });
  }

  onZoomLevelChanged(e) {
    if(e.name === 'zoomLevel') {
      this.setState({
        zoomLevel: e.value
      });
    }
  }

  setMinDate(e) {
    this.setState({
      minDateValue: e.value ? new Date((new Date).getTime() - 1000 * 60 * 60 * 24 * 3) : null
    });
  }

  setMaxDate(e) {
    this.setState({
      maxDateValue: e.value ? new Date((new Date).getTime() + 1000 * 60 * 60 * 24 * 3) : null
    });
  }

  disableWeekend(e) {
    this.setState({
      disabledDates: e.value ? (data) => data.view === 'month' && isWeekend(data.date) : null
    });
  }

  setFirstDay(e) {
    this.setState({
      firstDay: e.value ? 1 : 0
    });
  }

  useCellTemplate(e) {
    this.setState({
      cellTemplate: e.value ? CustomCell : null
    });
  }
}

function CustomCell(cell) {
  return (
    <span className={getCellCssClass(cell.date)}>
      { cell.text }
    </span>
  );
}

function getCellCssClass(date) {
  let cssClass = '';
  const holydays = [[1, 0], [4, 6], [25, 11]];

  if(isWeekend(date))
  { cssClass = 'weekend'; }

  holydays.forEach((item) => {
    if(date.getDate() === item[0] && date.getMonth() === item[1]) {
      cssClass = 'holyday';
      return false;
    }
  });

  return cssClass;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export default App;
