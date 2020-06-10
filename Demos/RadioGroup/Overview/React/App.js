import React from 'react';
import { RadioGroup } from 'devextreme-react';
import { priorities, tasks } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPriority: priorities[2],
      selectionPriority: priorities[0]
    };

    this.changeColorPriority = this.changeColorPriority.bind(this);
    this.changeSelectionPriority = this.changeSelectionPriority.bind(this);
  }

  render() {
    return (
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <RadioGroup items={priorities} defaultValue={priorities[0]} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Disabled</div>
            <div className="dx-field-value">
              <RadioGroup items={priorities} defaultValue={priorities[1]} disabled={true} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Horizontal layout</div>
            <div className="dx-field-value">
              <RadioGroup items={priorities} defaultValue={priorities[0]} layout="horizontal" />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Custom item template</div>
            <div className="dx-field-value">
              <RadioGroup className={this.state.colorPriority.toLowerCase()} items={priorities} value={this.state.colorPriority}
                itemRender={renderCustomItem} onValueChanged={this.changeColorPriority} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Event handling</div>
            <div className="dx-field-value">
              <RadioGroup id="radio-group-with-selection" items={priorities} value={this.state.selectionPriority} onValueChanged={this.changeSelectionPriority} />
            </div>
          </div>
        </div>
        <div id="tasks-list">
          Tasks by selected priority:
          <ul id="list">
            {tasks.filter(task => task.priority == this.state.selectionPriority).map(task => <li key={task.id}>{task.subject}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  changeColorPriority(e) {
    this.setState({
      colorPriority: e.value
    });
  }

  changeSelectionPriority(e) {
    this.setState({
      selectionPriority: e.value
    });
  }
}

function renderCustomItem(data) {
  return <div>{data}</div>;
}

export default App;
