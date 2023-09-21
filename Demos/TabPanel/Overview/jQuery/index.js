$(() => {
  const taskItem = (task) => {
    const className = `task-item task-item-priority-${task.priority}`;

    return `
      <div class="${className}">
        <span class="task-item-text">
          ${task.text}
        </span>

        <span class="task-item-info">
          ${task.date} by ${task.assignedBy}
        </span>

        <i class="task-item-pseudo-button dx-icon dx-icon-overflow"></i>
      </div>
    `;
  };

  const taskList = (tasks) => {
    const list = tasks.reduce((accumulator, task) => `${accumulator} ${taskItem(task)}`, '');

    return `
      <div class="tabpanel-item">
        ${list}
      </div>
    `;
  };

  const tabPanel = $('#tabpanel').dxTabPanel({
    dataSource,
    width: '100%',
    height: 418,
    animationEnabled: true,
    swipeEnabled: true,
    showNavButtons: true,
    tabsPosition: tabsPositions[0],
    stylingMode: stylingModes[0],
    iconPosition: iconPositions[0],
    itemTemplate: ({ tasks }) => taskList(tasks),
  }).dxTabPanel('instance');

  $('#tabs-position-selectbox').dxSelectBox({
    inputAttr: tabsPositionsSelectBoxLabel,
    items: tabsPositions,
    value: tabsPositions[0],
    onValueChanged({ value }) {
      tabPanel.option({ tabsPosition: value });
    },
  });

  $('#styling-mode-selectbox').dxSelectBox({
    inputAttr: stylingModesSelectBoxLabel,
    items: stylingModes,
    value: stylingModes[0],
    onValueChanged({ value }) {
      tabPanel.option({ stylingMode: value });
    },
  });

  $('#icon-position-selectbox').dxSelectBox({
    inputAttr: iconPositionsSelectBoxLabel,
    items: iconPositions,
    value: iconPositions[0],
    onValueChanged({ value }) {
      tabPanel.option({ iconPosition: value });
    },
  });

  $('#show-nav-buttons-checkbox').dxCheckBox({
    text: 'Show navigation buttons',
    elementAttr: navButtonsCheckBoxLabel,
    value: true,
    onValueChanged({ value }) {
      tabPanel.option({ showNavButtons: value });
    },
  });
});
