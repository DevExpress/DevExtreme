$(() => {
  const draggingGroupName = 'appointmentsGroup';

  const createItemElement = function (data) {
    $('<div>')
      .text(data.text)
      .addClass('item dx-card')
      .appendTo('#list')
      .dxDraggable({
        group: draggingGroupName,
        data,
        clone: true,
        onDragEnd(e) {
          if (e.toData) {
            e.cancel = true;
          }
        },
        onDragStart(e) {
          e.itemData = e.fromData;
        },
      });
  };

  $('#scroll').dxScrollView({});

  $('#list').dxDraggable({
    data: 'dropArea',
    group: draggingGroupName,
    onDragStart(e) {
      e.cancel = true;
    },
  });

  tasks.forEach((task) => {
    createItemElement(task);
  });

  $('#scheduler').dxScheduler({
    timeZone: 'America/Los_Angeles',
    dataSource: appointments,
    views: [{
      type: 'day',
      intervalCount: 3,
    }],
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    height: 600,
    editing: true,
    appointmentDragging: {
      group: draggingGroupName,
      onRemove(e) {
        e.component.deleteAppointment(e.itemData);
        createItemElement(e.itemData);
      },
      onAdd(e) {
        e.component.addAppointment(e.itemData);
        e.itemElement.remove();
      },
    },
  });
});
