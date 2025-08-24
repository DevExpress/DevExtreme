$(() => {
  $('#card-view').dxCardView({
    dataSource: tasks,
    cardsPerRow: 'auto',
    cardMinWidth: 240,
    paging: {
      pageSize: 12,
    },
    cardHeader: {
      visible: true,
      template: (data, container) => {
        const text = data.card.data.Task_Subject;
        $(container).addClass('task__header-container');
        return $('<div>')
          .addClass('task__header')
          .attr('title', text)
          .text(text);
      },
    },
    columns: [
      {
        dataField: 'Task_Priority',
        caption: 'Priority',
        fieldValueTemplate({ field: { value } }) {
          const priority = priorities.find(p => p.id === value);
          return $('<div>').append(
            $('<div>').addClass('task__indicator'),
          )
            .append(
              $('<div>').text(priority.text),
            )
            .addClass('task__priority')
            .addClass(`task__priority--${priority.postfix}`);
        },
      },
      {
        dataField: 'Task_Start_Date',
        caption: 'Start Date',
        dataType: 'date',
      },
      {
        dataField: 'Task_Due_Date',
        caption: 'End Date',
        dataType: 'date',
      },
      {
        dataField: 'Task_Assigned_Employee_ID',
        caption: 'Assigned to',
        fieldValueTemplate({ field: { value } }) {
          return $('<button>')
            .addClass('task__link-button')
            .text(employees.find(e => e.ID === value).Name);
        },
      },
      {
        dataField: 'Task_Status',
        caption: 'Status',
      },
      {
        dataField: 'Task_Completion',
        caption: 'Completed',
        fieldTemplate({ field: { value } }) {
          return $('<div>')
            .addClass('task__progress')
            .dxProgressBar({
              value,
              elementAttr: {
                'aria-label': 'Progress Bar',
              },
              statusFormat(_, value) {
                return `${value}%`;
              },
            });
        },
      },
    ],
  });
});
