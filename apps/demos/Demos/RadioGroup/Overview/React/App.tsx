import React, { useCallback, useState } from 'react';
import RadioGroup, { RadioGroupTypes } from 'devextreme-react/radio-group';
import { priorities, priorityEntities, tasks } from './data.ts';

const renderCustomItem = (data) => <div>{data}</div>;

function App() {
  const [colorPriority, setColorPriority] = useState(priorities[2]);
  const [selectionPriority, setSelectionPriority] = useState(priorityEntities[0].id);

  const changeColorPriority = useCallback((e: RadioGroupTypes.ValueChangedEvent) => {
    setColorPriority(e.value);
  }, [setColorPriority]);

  const changeSelectionPriority = useCallback((e: RadioGroupTypes.ValueChangedEvent) => {
    setSelectionPriority(e.value);
  }, [setSelectionPriority]);

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
            <RadioGroup
              className={colorPriority.toLowerCase()}
              items={priorities}
              value={colorPriority}
              itemRender={renderCustomItem}
              onValueChanged={changeColorPriority}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Event handling</div>
          <div className="dx-field-value">
            <RadioGroup
              id="radio-group-with-selection"
              items={priorityEntities}
              value={selectionPriority}
              valueExpr="id"
              displayExpr="text"
              onValueChanged={changeSelectionPriority}
            />
          </div>
        </div>
      </div>
      <div id="tasks-list">
        Tasks by selected priority:
        <ul id="list">
          {tasks
            .filter((task) => task.priority === selectionPriority)
            .map((task) => (
              <li key={task.id}>{task.subject}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
