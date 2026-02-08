import React, { useState } from "react";
import Gantt, {
  Tasks,
  Dependencies,
  Resources,
  ResourceAssignments,
  Column,
  Editing,
} from "devextreme-react/gantt";
import { tasks, dependencies, resources, resourceAssignments } from "./data";

function App() {
  const [showData, setShowData] = useState(true);

  const toggleData = () => setShowData(!showData);

  const taskContentRender = ({ taskData, taskSize, taskResources }) => {
    const getImagePath = (taskId) => {
      const imgPath =
        "https://js.devexpress.com/React/Demos/WidgetsGallery/JSDemos/images/employees";
      const img = taskId < 10 ? `0${taskId}` : taskId;
      return `${imgPath}/${img}.png`;
    };

    const getTaskColor = (taskId) => {
      const color = taskId % 6;
      return `custom-task-color-${color}`;
    };

    return (
      <div
        className={`custom-task ${getTaskColor(taskData.id)}`}
        style={{ width: `${taskSize.width}px` }}
      >
        <div className="custom-task-img-wrapper">
          <img
            className="custom-task-img"
            src={getImagePath(taskData.id)}
            alt={taskData.title}
          />
        </div>
        <div className="custom-task-wrapper">
          <div className="custom-task-title">{taskData.title}</div>
          {taskResources?.length > 0 && (
            <div className="custom-task-row">{taskResources[0].text}</div>
          )}
        </div>
        <div
          className="custom-task-progress"
          style={{ width: `${taskData.progress}%` }}
        />
      </div>
    );
  };

  return (
    <div id="form-demo">
      <div className="widget-container">
        <button onClick={toggleData}>
          {showData ? "Hide Data" : "Show Data"}
        </button>

        <Gantt
          taskListWidth={500}
          height={700}
          scaleType="days"
          taskContentRender={taskContentRender}
        >
          <Tasks dataSource={showData ? tasks : []} />
          <Dependencies dataSource={showData ? dependencies : []} />
          <Resources dataSource={showData ? resources : []} />
          <ResourceAssignments
            dataSource={showData ? resourceAssignments : []}
          />

          <Column dataField="title" caption="Subject" width={300} />
          <Column dataField="start" caption="Start Date" />
          <Column dataField="end" caption="End Date" />

          <Editing enabled />
        </Gantt>
      </div>
    </div>
  );
}

export default App;
