import React from 'react';

import { SelectBox } from 'devextreme-react/select-box';
import { CheckBox } from 'devextreme-react/check-box';
import { NumberBox } from 'devextreme-react/number-box';
import { DateBox } from 'devextreme-react/date-box';
import {
  Gantt, Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item,
} from 'devextreme-react/gantt';

import { exportGantt as exportGanttToPdf } from 'devextreme/pdf_exporter';

import { jsPDF } from 'jspdf';
import {
  tasks, dependencies, resources, resourceAssignments, startDateLabel, endDateLabel,
} from './data.js';

import 'jspdf-autotable';

const formats = ['A0', 'A1', 'A2', 'A3', 'A4', 'Auto'];
const exportModes = ['All', 'Chart', 'Tree List'];
const dateRanges = ['All', 'Visible', 'Custom'];
const startTaskIndexLabel = { 'aria-label': 'Start Task Index' };
const endTaskIndexLabel = { 'aria-label': 'End Task Index' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.formatBoxRef = null;
    this.exportModeBoxRef = null;
    this.dateRangeBoxRef = null;
    this.ganttRef = React.createRef();
    this.state = {
      formatBoxValue: formats[0],
      exportModeBoxValue: exportModes[0],
      dateRangeBoxValue: dateRanges[1],
      landscapeCheckBoxValue: true,
      startTaskIndex: 0,
      endTaskIndex: 3,
      startDate: tasks[0].start,
      endDate: tasks[0].end,
      customRangeDisabled: true,
    };
    this.exportButtonOptions = {
      icon: 'exportpdf',
      hint: 'Export to PDF',
      stylingMode: 'text',
      onClick: this.exportButtonClick.bind(this),
    };
    this.formatBoxSelectionChanged = this.formatBoxSelectionChanged.bind(this);
    this.exportModeBoxSelectionChanged = this.exportModeBoxSelectionChanged.bind(this);
    this.dateRangeBoxSelectionChanged = this.dateRangeBoxSelectionChanged.bind(this);
    this.onLandscapeCheckBoxChanged = this.onLandscapeCheckBoxChanged.bind(this);
    this.startTaskIndexValueChanged = this.startTaskIndexValueChanged.bind(this);
    this.endTaskIndexValueChanged = this.endTaskIndexValueChanged.bind(this);
    this.startDateValueChanged = this.startDateValueChanged.bind(this);
    this.endDateValueChanged = this.endDateValueChanged.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Gantt
          ref={this.ganttRef}
          taskListWidth={500}
          scaleType="weeks"
          height={700}
          rootValue={-1}>

          <Tasks dataSource={tasks} />
          <Dependencies dataSource={dependencies} />
          <Resources dataSource={resources} />
          <ResourceAssignments dataSource={resourceAssignments} />

          <Toolbar>
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item name="zoomIn" />
            <Item name="zoomOut" />
            <Item name="separator" />
            <Item widget="dxButton" options={this.exportButtonOptions} />
          </Toolbar>

          <Column dataField="title" caption="Subject" width={300} />
          <Column dataField="start" caption="Start Date" />
          <Column dataField="end" caption="End Date" />

          <Editing enabled={true} />
        </Gantt>
        <div className="options">
          <div className="column">
            <div className="caption">Export Options</div>
            <div className="option">
              <div className="label">Document format:</div>
              {' '}
              <div className="value">
                <SelectBox items={formats}
                  value={this.state.formatBoxValue}
                  onValueChanged={this.formatBoxSelectionChanged} />
              </div>
            </div>
            <div className="option">
              <div className="label">Landscape orientation:</div>
              {' '}
              <div className="value">
                <CheckBox
                  value={this.state.landscapeCheckBoxValue}
                  onValueChanged={this.onLandscapeCheckBoxChanged} />
              </div>
            </div>
            <div className="option">
              <div className="label">Export mode:</div>
              {' '}
              <div className="value">
                <SelectBox items={exportModes}
                  value={this.state.exportModeBoxValue}
                  onValueChanged={this.exportModeBoxSelectionChanged} />
              </div>
            </div>
            <div className="option">
              <div className="label">Date range:</div>
              {' '}
              <div className="value">
                <SelectBox items={dateRanges}
                  value={this.state.dateRangeBoxValue}
                  onValueChanged={this.dateRangeBoxSelectionChanged} />
              </div>
            </div>
          </div>
          {' '}
          <div className="column">
            <div className="caption">Task Filter Options</div>
            <div className="option">
              <div className="label">Start task (index):</div>
              {' '}
              <div className="value">
                <NumberBox
                  value={this.state.startTaskIndex}
                  min={0}
                  max={this.state.endTaskIndex}
                  disabled={this.state.customRangeDisabled}
                  showSpinButtons={true}
                  inputAttr={startTaskIndexLabel}
                  onValueChanged={this.startTaskIndexValueChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">End task (index):</div>
              {' '}
              <div className="value">
                <NumberBox
                  value={this.state.endTaskIndex}
                  min={this.state.startTaskIndex}
                  max={tasks.length - 1}
                  disabled={this.state.customRangeDisabled}
                  showSpinButtons={true}
                  inputAttr={endTaskIndexLabel}
                  onValueChanged={this.endTaskIndexValueChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">Start date:</div>
              {' '}
              <div className="value">
                <DateBox
                  value={this.state.startDate}
                  max={this.state.endDate}
                  inputAttr={startDateLabel}
                  disabled={this.state.customRangeDisabled}
                  type="date"
                  onValueChanged={this.startDateValueChanged}
                />
              </div>
            </div>
            <div className="option">
              <div className="label">End date:</div>
              {' '}
              <div className="value">
                <DateBox
                  value={this.state.endDate}
                  min={this.state.startDate}
                  inputAttr={endDateLabel}
                  disabled={this.state.customRangeDisabled}
                  type="date"
                  onValueChanged={this.endDateValueChanged}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  exportButtonClick() {
    const gantt = this.ganttRef.current.instance;
    const format = this.state.formatBoxValue.toLowerCase();
    const isLandscape = this.state.landscapeCheckBoxValue;
    const exportMode = this.state.exportModeBoxValue === 'Tree List' ? 'treeList' : this.state.exportModeBoxValue.toLowerCase();
    const dataRangeMode = this.state.dateRangeBoxValue.toLowerCase();
    let dataRange;
    if (dataRangeMode === 'custom') {
      dataRange = {
        startIndex: this.state.startTaskIndex,
        endIndex: this.state.endTaskIndex,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      };
    } else {
      dataRange = dataRangeMode;
    }
    exportGanttToPdf(
      {
        component: gantt,
        // eslint-disable-next-line new-cap
        createDocumentMethod: (args) => new jsPDF(args),
        format,
        landscape: isLandscape,
        exportMode,
        dateRange: dataRange,
      },
    ).then((doc) => doc.save('gantt.pdf'));
  }

  formatBoxSelectionChanged(e) {
    this.setState({ formatBoxValue: e.value });
  }

  exportModeBoxSelectionChanged(e) {
    this.setState({ exportModeBoxValue: e.value });
  }

  dateRangeBoxSelectionChanged(e) {
    this.setState({
      dateRangeBoxValue: e.value,
      customRangeDisabled: e.value !== 'Custom',
    });
  }

  onLandscapeCheckBoxChanged(e) {
    this.setState({ landscapeCheckBoxValue: e.value });
  }

  startTaskIndexValueChanged(e) {
    this.setState({ startTaskIndex: e.value });
  }

  endTaskIndexValueChanged(e) {
    this.setState({ endTaskIndex: e.value });
  }

  startDateValueChanged(e) {
    this.setState({ startDate: e.value });
  }

  endDateValueChanged(e) {
    this.setState({ startDate: e.value });
  }
}

export default App;
