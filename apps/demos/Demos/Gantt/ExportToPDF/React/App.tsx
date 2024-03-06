import React from 'react';

import { SelectBox, ISelectBoxOptions } from 'devextreme-react/select-box';
import { CheckBox, ICheckBoxOptions } from 'devextreme-react/check-box';
import { NumberBox, INumberBoxOptions } from 'devextreme-react/number-box';
import { DateBox, IDateBoxOptions } from 'devextreme-react/date-box';
import {
  Gantt, Tasks, Dependencies, Resources, ResourceAssignments, Column, Editing, Toolbar, Item,
} from 'devextreme-react/gantt';

import pdfExporter from 'devextreme/pdf_exporter';

import { jsPDF } from 'jspdf';
import {
  tasks, dependencies, resources, resourceAssignments, startDateLabel, endDateLabel,
  documentFormatLabel, exportModeLabel, dateRangeLabel,
} from './data.ts';

import 'jspdf-autotable';

type GanttPdfExportMode = 'all' | 'treeList' | 'chart';

const formats = ['A0', 'A1', 'A2', 'A3', 'A4', 'Auto'];
const exportModes = ['All', 'Chart', 'Tree List'];
const dateRanges = ['All', 'Visible', 'Custom'];
const startTaskIndexLabel = { 'aria-label': 'Start Task Index' };
const endTaskIndexLabel = { 'aria-label': 'End Task Index' };

class App extends React.Component {
  formatBoxRef: any;

  exportModeBoxRef: any;

  dateRangeBoxRef: any;

  ganttRef: any;

  state: { formatBoxValue: string; exportModeBoxValue: string; dateRangeBoxValue: string; landscapeCheckBoxValue: boolean; startTaskIndex: number; endTaskIndex: number; startDate: Date; endDate: Date; customRangeDisabled: boolean; };

  exportButtonOptions: { icon: string; hint: string; stylingMode: string; onClick: any; };

  exportModeBoxSelectionChanged: ISelectBoxOptions['onValueChanged'];

  formatBoxSelectionChanged: ISelectBoxOptions['onValueChanged'];

  dateRangeBoxSelectionChanged: ISelectBoxOptions['onValueChanged'];

  onLandscapeCheckBoxChanged: ICheckBoxOptions['onValueChanged'] ;

  startTaskIndexValueChanged: INumberBoxOptions['onValueChanged'];

  endTaskIndexValueChanged: INumberBoxOptions['onValueChanged'];

  startDateValueChanged: IDateBoxOptions['onValueChange'];

  endDateValueChanged: IDateBoxOptions['onValueChange'];

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

    const updateFn = (key) => (e) => this.setState({ [key]: e.value });

    this.formatBoxSelectionChanged = updateFn('formatBoxValue');
    this.exportModeBoxSelectionChanged = updateFn('exportModeBoxValue');
    this.dateRangeBoxSelectionChanged = ({ value }) => {
      this.setState({
        dateRangeBoxValue: value,
        customRangeDisabled: value !== 'Custom',
      });
    };
    this.onLandscapeCheckBoxChanged = updateFn('landscapeCheckBoxValue');
    this.startTaskIndexValueChanged = updateFn('startTaskIndex');
    this.endTaskIndexValueChanged = updateFn('endTaskIndex');
    this.startDateValueChanged = updateFn('startDate');
    this.endDateValueChanged = updateFn('startDate');
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
                  inputAttr={documentFormatLabel}
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
                  inputAttr={exportModeLabel}
                  onValueChanged={this.exportModeBoxSelectionChanged} />
              </div>
            </div>
            <div className="option">
              <div className="label">Date range:</div>
              {' '}
              <div className="value">
                <SelectBox items={dateRanges}
                  value={this.state.dateRangeBoxValue}
                  inputAttr={dateRangeLabel}
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
    const exportMode: GanttPdfExportMode = this.state.exportModeBoxValue === 'Tree List' ? 'treeList' : this.state.exportModeBoxValue.toLowerCase() as GanttPdfExportMode;
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

    pdfExporter.exportGantt(
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
}

export default App;
