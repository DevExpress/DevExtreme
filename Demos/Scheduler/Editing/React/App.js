import React from 'react';
import Scheduler from 'devextreme-react/scheduler';
import { CheckBox } from 'devextreme-react/check-box';
import notify from 'devextreme/ui/notify';

import { data } from './data.js';

const currentDate = new Date(2021, 4, 27);
const views = ['day', 'week'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowAdding: true,
      allowDeleting: true,
      allowResizing: true,
      allowDragging: true,
      allowUpdating: true
    };
    this.onAllowAddingChanged = this.onAllowAddingChanged.bind(this);
    this.onAllowDeletingChanged = this.onAllowDeletingChanged.bind(this);
    this.onAllowResizingChanged = this.onAllowResizingChanged.bind(this);
    this.onAllowDraggingChanged = this.onAllowDraggingChanged.bind(this);
    this.onAllowUpdatingChanged = this.onAllowUpdatingChanged.bind(this);
    this.showAddedToast = this.showAddedToast.bind(this);
    this.showUpdatedToast = this.showUpdatedToast.bind(this);
    this.showDeletedToast = this.showDeletedToast.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Scheduler
          timeZone="America/Los_Angeles"
          dataSource={data}
          views={views}
          defaultCurrentView="week"
          defaultCurrentDate={currentDate}
          startDayHour={9}
          endDayHour={19}
          height={600}
          editing={this.state}
          onAppointmentAdded={this.showAddedToast}
          onAppointmentUpdated={this.showUpdatedToast}
          onAppointmentDeleted={this.showDeletedToast}
        />
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              defaultValue={this.state.allowAdding}
              text="Allow adding"
              onValueChanged={this.onAllowAddingChanged}
            />
          </div>
          {' '}
          <div className="option">
            <CheckBox
              defaultValue={this.state.allowDeleting}
              text="Allow deleting"
              onValueChanged={this.onAllowDeletingChanged}
            />
          </div>
          {' '}
          <div className="option">
            <CheckBox
              defaultValue={this.state.allowUpdating}
              text="Allow updating"
              onValueChanged={this.onAllowUpdatingChanged}
            />
          </div>
          {' '}
          <div className="option">
            <CheckBox
              defaultValue={this.state.allowResizing}
              text="Allow resizing"
              onValueChanged={this.onAllowResizingChanged}
              disabled={!this.state.allowUpdating}
            />
          </div>
          {' '}
          <div className="option">
            <CheckBox
              defaultValue={this.state.allowDragging}
              text="Allow dragging"
              onValueChanged={this.onAllowDraggingChanged}
              disabled={!this.state.allowUpdating}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  onAllowAddingChanged(e) {
    this.setState({ allowAdding: e.value });
  }

  onAllowDeletingChanged(e) {
    this.setState({ allowDeleting: e.value });
  }

  onAllowResizingChanged(e) {
    this.setState({ allowResizing: e.value });
  }

  onAllowDraggingChanged(e) {
    this.setState({ allowDragging: e.value });
  }

  onAllowUpdatingChanged(e) {
    this.setState({ allowUpdating: e.value });
  }

  showToast(event, value, type) {
    notify(`${event} "${value}" task`, type, 800);
  }

  showAddedToast(e) {
    this.showToast('Added', e.appointmentData.text, 'success');
  }

  showUpdatedToast(e) {
    this.showToast('Updated', e.appointmentData.text, 'info');
  }

  showDeletedToast(e) {
    this.showToast('Deleted', e.appointmentData.text, 'warning');
  }
}

export default App;
