// This code is used for backwards compatibility with the older jsPDF variable name
// Read more: https://github.com/MrRio/jsPDF/releases/tag/v2.0.0
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);

$(() => {
  const ganttInstance = $('#gantt').dxGantt({
    rootValue: -1,
    tasks: {
      dataSource: tasks,
    },
    dependencies: {
      dataSource: dependencies,
    },
    resources: {
      dataSource: resources,
    },
    resourceAssignments: {
      dataSource: resourceAssignments,
    },
    editing: {
      enabled: true,
    },
    columns: [{
      dataField: 'title',
      caption: 'Subject',
      width: 300,
    }, {
      dataField: 'start',
      caption: 'Start Date',
    }, {
      dataField: 'end',
      caption: 'End Date',
    }],
    scaleType: 'weeks',
    taskListWidth: 500,
    toolbar: {
      items: [
        'undo',
        'redo',
        'separator',
        'zoomIn',
        'zoomOut',
        'separator',
        {
          widget: 'dxButton',
          options: {
            icon: 'exportpdf',
            hint: 'Export to PDF',
            stylingMode: 'text',
            onClick() {
              exportGantt();
            },
          },
        },
      ],
    },
  }).dxGantt('instance');

  const formats = ['A0', 'A1', 'A2', 'A3', 'A4', 'Auto'];
  const exportModes = ['All', 'Chart', 'Tree List'];
  const dataRanges = ['All', 'Visible', 'Custom'];

  $('#formatSelector').dxSelectBox({
    items: formats,
    inputAttr: { 'aria-label': 'Format' },
    value: formats[0],
  });
  $('#landscapeCheckBoxContainer').dxCheckBox({
    value: true,
  });
  $('#exportModeSelector').dxSelectBox({
    items: exportModes,
    inputAttr: { 'aria-label': 'Export Mode' },
    value: exportModes[0],
  });
  $('#dataRangeSelector').dxSelectBox({
    items: dataRanges,
    value: dataRanges[1],
    inputAttr: { 'aria-label': 'Date Range' },
    onValueChanged(data) {
      const disabled = data.value.toLowerCase() !== 'custom';
      changeCustomRangeEditorsDisabled(disabled);
    },
  });
  $('#startIndexContainer').dxNumberBox({
    disabled: true,
    value: 0,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'Start Index' },
  });
  $('#endIndexContainer').dxNumberBox({
    disabled: true,
    value: 3,
    showSpinButtons: true,
    inputAttr: { 'aria-label': 'End Index' },
  });

  $('#startDateContainer').dxDateBox({
    disabled: true,
    type: 'date',
    value: tasks[0].start,
    inputAttr: { 'aria-label': 'Start Date' },
  });

  $('#endDateContainer').dxDateBox({
    disabled: true,
    type: 'date',
    value: tasks[0].end,
    inputAttr: { 'aria-label': 'End Date' },
  });

  function exportGantt() {
    const format = $('#formatSelector').dxSelectBox('option', 'value').toLowerCase();
    const isLandscape = $('#landscapeCheckBoxContainer').dxCheckBox('option', 'value');
    let exportMode = $('#exportModeSelector').dxSelectBox('option', 'value');
    exportMode = exportMode === 'Tree List' ? 'treeList' : exportMode.toLowerCase();
    const dataRangeMode = $('#dataRangeSelector').dxSelectBox('option', 'value').toLowerCase();
    let dataRange;
    if (dataRangeMode === 'custom') {
      dataRange = {
        startIndex: $('#startIndexContainer').dxNumberBox('option', 'value'),
        endIndex: $('#endIndexContainer').dxNumberBox('option', 'value'),
        startDate: $('#startDateContainer').dxDateBox('option', 'value'),
        endDate: $('#endDateContainer').dxDateBox('option', 'value'),
      };
    } else {
      dataRange = dataRangeMode;
    }
    DevExpress.pdfExporter.exportGantt(
      {
        component: ganttInstance,
        // eslint-disable-next-line new-cap
        createDocumentMethod: (args) => new jsPDF(args),
        format,
        landscape: isLandscape,
        exportMode,
        dateRange: dataRange,
      },
    ).then((doc) => {
      doc.save('gantt.pdf');
    });
  }
  function changeCustomRangeEditorsDisabled(disabled) {
    $('#startIndexContainer').dxNumberBox('instance').option('disabled', disabled);
    $('#endIndexContainer').dxNumberBox('instance').option('disabled', disabled);
    $('#startDateContainer').dxDateBox('instance').option('disabled', disabled);
    $('#endDateContainer').dxDateBox('instance').option('disabled', disabled);
  }
});
