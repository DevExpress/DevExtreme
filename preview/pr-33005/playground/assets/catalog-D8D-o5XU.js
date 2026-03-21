import { j as jQuery, _ as __vitePreload, s as setLicenseCheckSkipCondition } from './preload-helper-LFsGM7aE.js';

true               && function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}();

const apptData = [{
  text: 'Meeting',
  startDate: new Date(2024, 0, 10, 9, 0),
  endDate: new Date(2024, 0, 10, 10, 30)
}, {
  text: 'Conference Call',
  startDate: new Date(2024, 0, 10, 14, 0),
  endDate: new Date(2024, 0, 10, 15, 0)
}];
const gridData = [{
  id: 1,
  name: 'Alice',
  city: 'London',
  age: 32
}, {
  id: 2,
  name: 'Bob',
  city: 'Paris',
  age: 25
}, {
  id: 3,
  name: 'Carol',
  city: 'Berlin',
  age: 41
}];
const chartData = [{
  arg: 'Jan',
  val: 30
}, {
  arg: 'Feb',
  val: 50
}, {
  arg: 'Mar',
  val: 40
}, {
  arg: 'Apr',
  val: 70
}, {
  arg: 'May',
  val: 60
}, {
  arg: 'Jun',
  val: 80
}];
const treeData = [{
  id: 1,
  parentId: 0,
  text: 'Documents'
}, {
  id: 2,
  parentId: 1,
  text: 'Reports'
}, {
  id: 3,
  parentId: 1,
  text: 'Notes'
}, {
  id: 4,
  parentId: 0,
  text: 'Images'
}];
const dx = $el => $el;
const registry = {
  accordion: {
    label: 'Accordion',
    init: $el => dx($el).dxAccordion({
      dataSource: ['Item 1', 'Item 2', 'Item 3'],
      width: 400
    })
  },
  actionSheet: {
    label: 'ActionSheet',
    init: $el => {
      const $btn = jQuery('<div>').appendTo($el);
      dx($btn).dxButton({
        text: 'Show ActionSheet',
        onClick: () => dx(jQuery('<div>').appendTo($el)).dxActionSheet({
          title: 'Actions',
          items: [{
            text: 'Action 1'
          }, {
            text: 'Action 2'
          }],
          visible: true,
          target: $btn
        })
      });
    }
  },
  autocomplete: {
    label: 'Autocomplete',
    init: $el => dx($el).dxAutocomplete({
      dataSource: ['Alice', 'Bob', 'Carol', 'Dave'],
      placeholder: 'Type a name...'
    })
  },
  barGauge: {
    label: 'BarGauge',
    init: $el => dx($el).dxBarGauge({
      values: [0.3, 0.6, 0.9],
      startValue: 0,
      endValue: 1,
      height: 300
    })
  },
  box: {
    label: 'Box',
    init: $el => dx($el).dxBox({
      direction: 'row',
      height: 100,
      items: [{
        html: '<div style="background:#e8e8e8;padding:10px">Box 1</div>',
        ratio: 1
      }, {
        html: '<div style="background:#d0d0d0;padding:10px">Box 2</div>',
        ratio: 1
      }]
    })
  },
  bullet: {
    label: 'Bullet',
    init: $el => dx($el).dxBullet({
      value: 65,
      startScaleValue: 0,
      endScaleValue: 100,
      target: 80,
      height: 60,
      width: 400
    })
  },
  button: {
    label: 'Button',
    init: $el => dx($el).dxButton({
      text: 'Click me',
      type: 'default',
      stylingMode: 'contained'
    })
  },
  buttonGroup: {
    label: 'ButtonGroup',
    init: $el => dx($el).dxButtonGroup({
      items: [{
        text: 'Left'
      }, {
        text: 'Center'
      }, {
        text: 'Right'
      }],
      selectionMode: 'single',
      selectedItemKeys: ['Center'],
      keyExpr: 'text'
    })
  },
  calendar: {
    label: 'Calendar',
    init: $el => dx($el).dxCalendar({
      value: new Date(),
      width: 280
    })
  },
  cardView: {
    label: 'CardView',
    init: $el => dx($el).dxCardView({
      dataSource: [{
        id: 1,
        name: 'Alice',
        city: 'London',
        age: 32
      }, {
        id: 2,
        name: 'Bob',
        city: 'Paris',
        age: 25
      }, {
        id: 3,
        name: 'Carol',
        city: 'Berlin',
        age: 41
      }],
      keyExpr: 'id',
      columns: ['name', 'city', 'age'],
      height: 400
    })
  },
  chat: {
    label: 'Chat',
    init: $el => dx($el).dxChat({
      height: 400,
      items: []
    })
  },
  checkBox: {
    label: 'CheckBox',
    init: $el => dx($el).dxCheckBox({
      text: 'Enable feature',
      value: true
    })
  },
  chart: {
    label: 'Chart',
    init: $el => dx($el).dxChart({
      dataSource: chartData,
      series: [{
        argumentField: 'arg',
        valueField: 'val',
        type: 'bar'
      }],
      height: 300
    })
  },
  circularGauge: {
    label: 'CircularGauge',
    init: $el => dx($el).dxCircularGauge({
      value: 65,
      height: 300,
      rangeContainer: {
        ranges: []
      }
    })
  },
  colorBox: {
    label: 'ColorBox',
    init: $el => dx($el).dxColorBox({
      value: '#0d6efd',
      width: 200
    })
  },
  contextMenu: {
    label: 'ContextMenu',
    init: $el => {
      jQuery('<div id="ctx-target" style="padding:20px;background:#eee;border:1px dashed #999">Right-click here</div>').appendTo($el);
      dx(jQuery('<div>').appendTo($el)).dxContextMenu({
        target: '#ctx-target',
        items: [{
          text: 'Copy'
        }, {
          text: 'Paste'
        }, {
          text: 'Delete'
        }]
      });
    }
  },
  dataGrid: {
    label: 'DataGrid',
    init: $el => dx($el).dxDataGrid({
      dataSource: gridData,
      keyExpr: 'id',
      columns: ['name', 'city', 'age'],
      showBorders: true
    })
  },
  dateBox: {
    label: 'DateBox',
    init: $el => dx($el).dxDateBox({
      value: new Date(),
      type: 'date',
      width: 220
    })
  },
  dateRangeBox: {
    label: 'DateRangeBox',
    init: $el => dx($el).dxDateRangeBox({
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 0, 31),
      width: 400
    })
  },
  diagram: {
    label: 'Diagram',
    init: $el => dx($el).dxDiagram({
      height: 400
    })
  },
  draggable: {
    label: 'Draggable',
    init: $el => {
      const $box = jQuery('<div style="width:100px;height:100px;background:#0d6efd;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px">Drag me</div>').appendTo($el);
      dx($box).dxDraggable({
        boundary: $el
      });
    }
  },
  drawer: {
    label: 'Drawer',
    init: $el => {
      $el.css({
        height: '300px',
        position: 'relative'
      });
      const $content = jQuery('<div style="padding:16px"><p>Main content area</p></div>');
      dx($el).dxDrawer({
        opened: true,
        template: () => jQuery('<div style="width:200px;padding:16px;background:#f5f5f5">Drawer panel</div>'),
        contentTemplate: () => $content,
        height: 300
      });
    }
  },
  dropDownBox: {
    label: 'DropDownBox',
    init: $el => dx($el).dxDropDownBox({
      dataSource: ['Alice', 'Bob', 'Carol'],
      value: 'Alice',
      width: 300
    })
  },
  dropDownButton: {
    label: 'DropDownButton',
    init: $el => dx($el).dxDropDownButton({
      text: 'Options',
      items: [{
        text: 'Option 1'
      }, {
        text: 'Option 2'
      }, {
        text: 'Option 3'
      }]
    })
  },
  fileManager: {
    label: 'FileManager',
    init: $el => dx($el).dxFileManager({
      height: 400
    })
  },
  fileUploader: {
    label: 'FileUploader',
    init: $el => dx($el).dxFileUploader({
      multiple: false,
      accept: '*',
      uploadMode: 'useButton'
    })
  },
  filterBuilder: {
    label: 'FilterBuilder',
    init: $el => dx($el).dxFilterBuilder({
      fields: [{
        dataField: 'name',
        caption: 'Name'
      }, {
        dataField: 'age',
        caption: 'Age',
        dataType: 'number'
      }]
    })
  },
  form: {
    label: 'Form',
    init: $el => dx($el).dxForm({
      formData: {
        name: 'Alice',
        email: 'alice@example.com',
        age: 32
      },
      items: [{
        dataField: 'name',
        label: {
          text: 'Name'
        }
      }, {
        dataField: 'email',
        label: {
          text: 'Email'
        }
      }, {
        dataField: 'age',
        label: {
          text: 'Age'
        },
        editorType: 'dxNumberBox'
      }],
      width: 400
    })
  },
  funnel: {
    label: 'Funnel',
    init: $el => dx($el).dxFunnel({
      dataSource: [{
        argument: 'Leads',
        value: 100
      }, {
        argument: 'Prospects',
        value: 60
      }, {
        argument: 'Customers',
        value: 30
      }],
      argumentField: 'argument',
      valueField: 'value',
      height: 300
    })
  },
  gallery: {
    label: 'Gallery',
    init: $el => dx($el).dxGallery({
      dataSource: ['Item 1', 'Item 2', 'Item 3'],
      height: 200,
      width: 400,
      itemTemplate: item => jQuery(`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#eee;font-size:18px">${item}</div>`)
    })
  },
  gantt: {
    label: 'Gantt',
    init: $el => dx($el).dxGantt({
      tasks: {
        dataSource: [{
          id: 1,
          parentId: 0,
          title: 'Project',
          start: new Date(2024, 0, 1),
          end: new Date(2024, 0, 31),
          progress: 50
        }, {
          id: 2,
          parentId: 1,
          title: 'Task 1',
          start: new Date(2024, 0, 1),
          end: new Date(2024, 0, 15),
          progress: 70
        }]
      },
      height: 300
    })
  },
  htmlEditor: {
    label: 'HtmlEditor',
    init: $el => dx($el).dxHtmlEditor({
      value: '<p>Hello <b>world</b>!</p>',
      height: 200,
      toolbar: {
        items: ['bold', 'italic', 'underline']
      }
    })
  },
  linearGauge: {
    label: 'LinearGauge',
    init: $el => dx($el).dxLinearGauge({
      value: 65,
      height: 100
    })
  },
  list: {
    label: 'List',
    init: $el => dx($el).dxList({
      dataSource: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
      height: 250
    })
  },
  loadIndicator: {
    label: 'LoadIndicator',
    init: $el => {
      $el.css({
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      });
      dx(jQuery('<div>').appendTo($el)).dxLoadIndicator({
        visible: true
      });
      jQuery('<span>Loading...</span>').appendTo($el);
    }
  },
  loadPanel: {
    label: 'LoadPanel',
    init: $el => {
      jQuery('<div id="lp-target" style="height:200px;background:#f0f0f0;display:flex;align-items:center;justify-content:center">Content area</div>').appendTo($el);
      dx(jQuery('<div>').appendTo($el)).dxLoadPanel({
        visible: true,
        showIndicator: true,
        showPane: true,
        shading: false,
        position: {
          of: '#lp-target'
        },
        container: $el
      });
    }
  },
  lookup: {
    label: 'Lookup',
    init: $el => dx($el).dxLookup({
      dataSource: ['Alice', 'Bob', 'Carol', 'Dave'],
      value: 'Alice',
      width: 250
    })
  },
  map: {
    label: 'Map',
    init: $el => dx($el).dxMap({
      center: {
        lat: 40.7128,
        lng: -74.006
      },
      zoom: 10,
      height: 300,
      width: '100%',
      provider: 'google'
    })
  },
  menu: {
    label: 'Menu',
    init: $el => dx($el).dxMenu({
      dataSource: [{
        text: 'File',
        items: [{
          text: 'New'
        }, {
          text: 'Open'
        }, {
          text: 'Save'
        }]
      }, {
        text: 'Edit',
        items: [{
          text: 'Cut'
        }, {
          text: 'Copy'
        }, {
          text: 'Paste'
        }]
      }, {
        text: 'View'
      }]
    })
  },
  multiView: {
    label: 'MultiView',
    init: $el => dx($el).dxMultiView({
      dataSource: [{
        html: '<div style="padding:20px;background:#e8f4fd">View 1 content</div>'
      }, {
        html: '<div style="padding:20px;background:#fdecea">View 2 content</div>'
      }, {
        html: '<div style="padding:20px;background:#e8fde8">View 3 content</div>'
      }],
      height: 150
    })
  },
  numberBox: {
    label: 'NumberBox',
    init: $el => dx($el).dxNumberBox({
      value: 42,
      min: 0,
      max: 100,
      showSpinButtons: true,
      width: 180
    })
  },
  pagination: {
    label: 'Pagination',
    init: $el => dx($el).dxPagination({
      pageCount: 10,
      pageIndex: 0,
      pageSize: 10,
      itemCount: 100
    })
  },
  pieChart: {
    label: 'PieChart',
    init: $el => dx($el).dxPieChart({
      dataSource: [{
        arg: 'Apples',
        val: 35
      }, {
        arg: 'Oranges',
        val: 25
      }, {
        arg: 'Bananas',
        val: 20
      }, {
        arg: 'Grapes',
        val: 20
      }],
      series: [{
        argumentField: 'arg',
        valueField: 'val'
      }],
      height: 300
    })
  },
  pivotGrid: {
    label: 'PivotGrid',
    init: $el => dx($el).dxPivotGrid({
      dataSource: {
        fields: [{
          dataField: 'region',
          area: 'row'
        }, {
          dataField: 'product',
          area: 'column'
        }, {
          dataField: 'amount',
          area: 'data',
          summaryType: 'sum'
        }],
        store: [{
          region: 'North',
          product: 'A',
          amount: 100
        }, {
          region: 'South',
          product: 'B',
          amount: 200
        }, {
          region: 'North',
          product: 'B',
          amount: 150
        }]
      },
      height: 300
    })
  },
  pivotGridFieldChooser: {
    label: 'PivotGridFieldChooser',
    init: $el => {
      const dataSource = {
        fields: [{
          dataField: 'name'
        }, {
          dataField: 'age'
        }],
        store: gridData
      };
      dx($el).dxPivotGridFieldChooser({
        dataSource,
        height: 300
      });
    }
  },
  polarChart: {
    label: 'PolarChart',
    init: $el => dx($el).dxPolarChart({
      dataSource: chartData,
      series: [{
        argumentField: 'arg',
        valueField: 'val',
        type: 'line'
      }],
      height: 300
    })
  },
  popover: {
    label: 'Popover',
    init: $el => {
      const $btn = jQuery('<div style="display:inline-block">').appendTo($el);
      dx($btn).dxButton({
        text: 'Show Popover',
        onClick: () => dx($pop).dxPopover('show')
      });
      const $pop = jQuery('<div>').appendTo($el);
      dx($pop).dxPopover({
        target: $btn,
        content: 'Hello from popover!'
      });
    }
  },
  popup: {
    label: 'Popup',
    init: $el => {
      const $btn = jQuery('<div style="display:inline-block">').appendTo($el);
      const $pop = jQuery('<div>').appendTo($el);
      dx($pop).dxPopup({
        title: 'Info',
        contentTemplate: () => '<p>Popup content</p>',
        visible: false,
        width: 300,
        height: 200
      });
      dx($btn).dxButton({
        text: 'Show Popup',
        onClick: () => dx($pop).dxPopup('show')
      });
    }
  },
  progressBar: {
    label: 'ProgressBar',
    init: $el => dx($el).dxProgressBar({
      value: 65,
      min: 0,
      max: 100,
      width: 300
    })
  },
  radioGroup: {
    label: 'RadioGroup',
    init: $el => dx($el).dxRadioGroup({
      dataSource: ['Option A', 'Option B', 'Option C'],
      value: 'Option A'
    })
  },
  rangeSelector: {
    label: 'RangeSelector',
    init: $el => dx($el).dxRangeSelector({
      scale: {
        startValue: 0,
        endValue: 100,
        tickInterval: 10
      },
      sliderMarker: {
        visible: true
      },
      value: [20, 70],
      height: 120
    })
  },
  rangeSlider: {
    label: 'RangeSlider',
    init: $el => dx($el).dxRangeSlider({
      min: 0,
      max: 100,
      start: 20,
      end: 70,
      width: 300
    })
  },
  recurrenceEditor: {
    label: 'RecurrenceEditor',
    init: $el => dx($el).dxRecurrenceEditor({
      value: 'FREQ=WEEKLY;BYDAY=MO,WE,FR'
    })
  },
  resizable: {
    label: 'Resizable',
    init: $el => {
      const $box = jQuery('<div style="background:#e8f4fd;padding:16px;border:1px solid #90caf9">Resize me</div>').appendTo($el);
      dx($box).dxResizable({
        width: 200,
        height: 100,
        minWidth: 100,
        minHeight: 60
      });
    }
  },
  responsiveBox: {
    label: 'ResponsiveBox',
    init: $el => dx($el).dxResponsiveBox({
      rows: [{
        ratio: 1
      }],
      cols: [{
        ratio: 1
      }, {
        ratio: 1
      }],
      items: [{
        html: '<div style="background:#eee;padding:10px">Left</div>',
        location: {
          row: 0,
          col: 0
        }
      }, {
        html: '<div style="background:#ddd;padding:10px">Right</div>',
        location: {
          row: 0,
          col: 1
        }
      }],
      height: 80
    })
  },
  sankey: {
    label: 'Sankey',
    init: $el => dx($el).dxSankey({
      dataSource: [{
        source: 'A',
        target: 'X',
        weight: 10
      }, {
        source: 'A',
        target: 'Y',
        weight: 5
      }, {
        source: 'B',
        target: 'X',
        weight: 7
      }, {
        source: 'B',
        target: 'Y',
        weight: 8
      }],
      height: 300
    })
  },
  scheduler: {
    label: 'Scheduler',
    init: $el => dx($el).dxScheduler({
      dataSource: apptData,
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2024, 0, 10),
      startDayHour: 8,
      endDayHour: 18,
      height: 500
    })
  },
  scrollView: {
    label: 'ScrollView',
    init: $el => dx($el).dxScrollView({
      width: 300,
      height: 150,
      content: () => jQuery('<div style="height:400px;padding:12px">Scrollable content<br/>'.repeat(10) + '</div>')
    })
  },
  selectBox: {
    label: 'SelectBox',
    init: $el => dx($el).dxSelectBox({
      dataSource: ['Apple', 'Banana', 'Cherry'],
      value: 'Apple',
      width: 220
    })
  },
  slider: {
    label: 'Slider',
    init: $el => dx($el).dxSlider({
      min: 0,
      max: 100,
      value: 40,
      width: 300
    })
  },
  sortable: {
    label: 'Sortable',
    init: $el => {
      const $list = jQuery('<div>').appendTo($el);
      ['Item 1', 'Item 2', 'Item 3', 'Item 4'].forEach(t => {
        jQuery(`<div style="padding:8px 12px;margin:4px 0;background:#f0f0f0;border:1px solid #ddd;cursor:grab;user-select:none">${t}</div>`).appendTo($list);
      });
      dx($list).dxSortable({
        filter: 'div'
      });
    }
  },
  sparkline: {
    label: 'Sparkline',
    init: $el => dx($el).dxSparkline({
      dataSource: [{
        val: 4
      }, {
        val: 8
      }, {
        val: 6
      }, {
        val: 9
      }, {
        val: 5
      }, {
        val: 7
      }],
      valueField: 'val',
      type: 'bar',
      width: 200,
      height: 40
    })
  },
  speedDialAction: {
    label: 'SpeedDialAction',
    init: $el => {
      $el.css({
        position: 'relative',
        height: '200px',
        background: '#f5f5f5'
      });
      dx(jQuery('<div>').appendTo($el)).dxSpeedDialAction({
        label: 'Add',
        icon: 'plus'
      });
    }
  },
  splitter: {
    label: 'Splitter',
    init: $el => dx($el).dxSplitter({
      items: [{
        html: '<div style="padding:12px">Left pane</div>'
      }, {
        html: '<div style="padding:12px">Right pane</div>'
      }],
      orientation: 'horizontal',
      height: 200
    })
  },
  stepper: {
    label: 'Stepper',
    init: $el => dx($el).dxStepper({
      items: [{
        title: 'Step 1'
      }, {
        title: 'Step 2'
      }, {
        title: 'Step 3'
      }],
      selectedIndex: 0
    })
  },
  switch: {
    label: 'Switch',
    init: $el => dx($el).dxSwitch({
      value: true,
      switchedOnText: 'ON',
      switchedOffText: 'OFF'
    })
  },
  tabPanel: {
    label: 'TabPanel',
    init: $el => dx($el).dxTabPanel({
      dataSource: [{
        title: 'Tab 1',
        html: '<p style="padding:12px">Content of Tab 1</p>'
      }, {
        title: 'Tab 2',
        html: '<p style="padding:12px">Content of Tab 2</p>'
      }, {
        title: 'Tab 3',
        html: '<p style="padding:12px">Content of Tab 3</p>'
      }],
      height: 150
    })
  },
  tabs: {
    label: 'Tabs',
    init: $el => dx($el).dxTabs({
      dataSource: [{
        text: 'Home'
      }, {
        text: 'Products'
      }, {
        text: 'About'
      }],
      selectedIndex: 0
    })
  },
  tagBox: {
    label: 'TagBox',
    init: $el => dx($el).dxTagBox({
      dataSource: ['Angular', 'React', 'Vue', 'jQuery'],
      value: ['React', 'Vue'],
      width: 350
    })
  },
  textArea: {
    label: 'TextArea',
    init: $el => dx($el).dxTextArea({
      value: 'Some text here...',
      height: 100,
      width: 300
    })
  },
  textBox: {
    label: 'TextBox',
    init: $el => dx($el).dxTextBox({
      value: 'Hello world',
      width: 250,
      showClearButton: true
    })
  },
  tileView: {
    label: 'TileView',
    init: $el => dx($el).dxTileView({
      dataSource: [{
        text: 'Tile 1',
        color: '#e3f2fd'
      }, {
        text: 'Tile 2',
        color: '#fce4ec'
      }, {
        text: 'Tile 3',
        color: '#e8f5e9'
      }, {
        text: 'Tile 4',
        color: '#fff3e0'
      }],
      itemTemplate: item => jQuery(`<div style="background:${item.color};display:flex;align-items:center;justify-content:center;height:100%">${item.text}</div>`),
      baseItemHeight: 80,
      baseItemWidth: 120,
      height: 200
    })
  },
  toast: {
    label: 'Toast',
    init: $el => {
      const $btn = jQuery('<div style="display:inline-block">').appendTo($el);
      const $toast = jQuery('<div>').appendTo($el);
      dx($toast).dxToast({
        message: 'Hello from Toast!',
        type: 'success',
        displayTime: 2000
      });
      dx($btn).dxButton({
        text: 'Show Toast',
        onClick: () => dx($toast).dxToast('show')
      });
    }
  },
  toolbar: {
    label: 'Toolbar',
    init: $el => dx($el).dxToolbar({
      items: [{
        widget: 'dxButton',
        options: {
          text: 'New',
          icon: 'plus'
        },
        location: 'before'
      }, {
        widget: 'dxButton',
        options: {
          text: 'Save',
          icon: 'save'
        },
        location: 'before'
      }, {
        widget: 'dxTextBox',
        options: {
          placeholder: 'Search...'
        },
        location: 'after'
      }]
    })
  },
  tooltip: {
    label: 'Tooltip',
    init: $el => {
      const $target = jQuery('<div id="tt-target" style="display:inline-block;padding:10px;background:#e3f2fd;border-radius:4px">Hover me</div>').appendTo($el);
      dx(jQuery('<div>').appendTo($el)).dxTooltip({
        target: $target,
        content: 'This is a tooltip!',
        showEvent: 'mouseenter',
        hideEvent: 'mouseleave'
      });
    }
  },
  treeList: {
    label: 'TreeList',
    init: $el => dx($el).dxTreeList({
      dataSource: treeData,
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      columns: [{
        dataField: 'text',
        caption: 'Name'
      }],
      showBorders: true,
      height: 250
    })
  },
  treeMap: {
    label: 'TreeMap',
    init: $el => dx($el).dxTreeMap({
      dataSource: [{
        name: 'A',
        value: 40
      }, {
        name: 'B',
        value: 25
      }, {
        name: 'C',
        value: 20
      }, {
        name: 'D',
        value: 15
      }],
      valueField: 'value',
      labelField: 'name',
      height: 300
    })
  },
  treeView: {
    label: 'TreeView',
    init: $el => dx($el).dxTreeView({
      dataSource: treeData,
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      displayExpr: 'text',
      height: 250
    })
  },
  validationGroup: {
    label: 'ValidationGroup',
    init: $el => {
      const $group = jQuery('<div>').appendTo($el);
      dx($group).dxValidationGroup({});
      const $tb = jQuery('<div style="margin-bottom:8px">').appendTo($group);
      dx($tb).dxTextBox({
        placeholder: 'Required field'
      });
      dx(jQuery('<div>').appendTo($group)).dxValidator({
        validationRules: [{
          type: 'required',
          message: 'This field is required'
        }],
        adapter: {
          getValue: () => dx($tb).dxTextBox('option', 'value')
        }
      });
      dx(jQuery('<div>').appendTo($group)).dxButton({
        text: 'Validate',
        validationGroup: $group,
        useSubmitBehavior: false,
        onClick: () => {
          dx($group).dxValidationGroup('validate');
        }
      });
    }
  },
  validationSummary: {
    label: 'ValidationSummary',
    init: $el => {
      dx($el).dxValidationSummary({});
    }
  },
  validator: {
    label: 'Validator',
    init: $el => {
      const $tb = jQuery('<div>').appendTo($el);
      dx($tb).dxTextBox({
        placeholder: 'Enter email'
      });
      dx(jQuery('<div>').appendTo($el)).dxValidator({
        validationRules: [{
          type: 'email',
          message: 'Enter a valid email'
        }],
        adapter: {
          getValue: () => dx($tb).dxTextBox('option', 'value')
        }
      });
    }
  },
  vectorMap: {
    label: 'VectorMap',
    init: $el => dx($el).dxVectorMap({
      height: 300
    })
  }
};

const themeKey = 'currentThemeId';
const themeLoaders = /* #__PURE__ */ Object.assign({"../artifacts/css/dx.carmine.compact.css": () => __vitePreload(() => import('./dx.carmine.compact-YllJu5_J.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.carmine.css": () => __vitePreload(() => import('./dx.carmine-C1YYn_Pr.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.common.css": () => __vitePreload(() => import('./dx.common-Cph7l5t5.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.contrast.compact.css": () => __vitePreload(() => import('./dx.contrast.compact-Bdix6ycS.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.contrast.css": () => __vitePreload(() => import('./dx.contrast-CCJfr63A.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.dark.compact.css": () => __vitePreload(() => import('./dx.dark.compact-O6E787Fw.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.dark.css": () => __vitePreload(() => import('./dx.dark-DcMkMmJv.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkmoon.compact.css": () => __vitePreload(() => import('./dx.darkmoon.compact-QaEi2_DF.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkmoon.css": () => __vitePreload(() => import('./dx.darkmoon-CkY3vlwz.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkviolet.compact.css": () => __vitePreload(() => import('./dx.darkviolet.compact-BP06fhf-.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkviolet.css": () => __vitePreload(() => import('./dx.darkviolet-BUVSS95y.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.dark.compact.css": () => __vitePreload(() => import('./dx.fluent.blue.dark.compact-BmKrEcsK.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.dark.css": () => __vitePreload(() => import('./dx.fluent.blue.dark-DPzmpIFd.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.light.compact.css": () => __vitePreload(() => import('./dx.fluent.blue.light.compact-5EkRDMg7.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.light.css": () => __vitePreload(() => import('./dx.fluent.blue.light-DwYbJb6s.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.dark.compact.css": () => __vitePreload(() => import('./dx.fluent.saas.dark.compact-D_zm3SEh.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.dark.css": () => __vitePreload(() => import('./dx.fluent.saas.dark-DaH3pB9D.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.light.compact.css": () => __vitePreload(() => import('./dx.fluent.saas.light.compact-CHQH74Ou.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.light.css": () => __vitePreload(() => import('./dx.fluent.saas.light-C5tQaRIq.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.greenmist.compact.css": () => __vitePreload(() => import('./dx.greenmist.compact-DNm8tlcv.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.greenmist.css": () => __vitePreload(() => import('./dx.greenmist-CYyv6lLW.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.light.compact.css": () => __vitePreload(() => import('./dx.light.compact-DxXnqUJb.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.light.css": () => __vitePreload(() => import('./dx.light-DNFvzA8L.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.dark.compact.css": () => __vitePreload(() => import('./dx.material.blue.dark.compact-D2SaaS3r.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.dark.css": () => __vitePreload(() => import('./dx.material.blue.dark-LMYrcgv3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.light.compact.css": () => __vitePreload(() => import('./dx.material.blue.light.compact-D-yGg2P5.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.light.css": () => __vitePreload(() => import('./dx.material.blue.light-JGZJeQXZ.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.dark.compact.css": () => __vitePreload(() => import('./dx.material.lime.dark.compact-DreUfwQE.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.dark.css": () => __vitePreload(() => import('./dx.material.lime.dark-BIdf2ltL.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.light.compact.css": () => __vitePreload(() => import('./dx.material.lime.light.compact-BhZppYYb.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.light.css": () => __vitePreload(() => import('./dx.material.lime.light-DwNfNtE3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.dark.compact.css": () => __vitePreload(() => import('./dx.material.orange.dark.compact-CsEKtEmX.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.dark.css": () => __vitePreload(() => import('./dx.material.orange.dark-z32eD6ru.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.light.compact.css": () => __vitePreload(() => import('./dx.material.orange.light.compact-_L81zkS6.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.light.css": () => __vitePreload(() => import('./dx.material.orange.light-_ROrgN8j.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.dark.compact.css": () => __vitePreload(() => import('./dx.material.purple.dark.compact-B12LVY9h.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.dark.css": () => __vitePreload(() => import('./dx.material.purple.dark-CHqDA5WC.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.light.compact.css": () => __vitePreload(() => import('./dx.material.purple.light.compact-BkB2Q6qf.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.light.css": () => __vitePreload(() => import('./dx.material.purple.light-CHcMxH3e.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.dark.compact.css": () => __vitePreload(() => import('./dx.material.teal.dark.compact-C6boEXn3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.dark.css": () => __vitePreload(() => import('./dx.material.teal.dark-leicWruz.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.light.compact.css": () => __vitePreload(() => import('./dx.material.teal.light.compact-rKSjL-pp.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.light.css": () => __vitePreload(() => import('./dx.material.teal.light-IwM9xBmn.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.softblue.compact.css": () => __vitePreload(() => import('./dx.softblue.compact-QiUNrA2R.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.softblue.css": () => __vitePreload(() => import('./dx.softblue-CD3XC5nY.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"])

});
const themeList = Object.keys(themeLoaders).map(path => {
  const match = path.match(/dx\.(.+)\.css$/);
  return match ? match[1] : null;
}).filter(Boolean);
function groupThemes(themes) {
  const groups = {};
  themes.forEach(theme => {
    const [group] = theme.split('.');
    const groupName = group.charAt(0).toUpperCase() + group.slice(1);
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(theme);
  });
  return groups;
}
const groupedThemes = groupThemes(themeList);
function initThemes(dropDownList) {
  Object.entries(groupedThemes).forEach(([group, themes]) => {
    const parent = document.createElement('optgroup');
    parent.label = group;
    themes.forEach(theme => {
      const child = document.createElement('option');
      child.value = theme;
      child.text = theme.replaceAll('.', ' ');
      parent.appendChild(child);
    });
    dropDownList.appendChild(parent);
  });
}
function loadThemeCss(themeId) {
  return new Promise((resolve, reject) => {
    const oldLink = document.getElementById('theme-stylesheet');
    if (oldLink) oldLink.remove();
    const key = Object.keys(themeLoaders).find(p => p.includes(`dx.${themeId}.css`));
    if (!key) {
      reject(new Error(`Theme not found: ${themeId}`));
      return;
    }
    themeLoaders[key]().then(cssUrl => {
      const link = document.createElement('link');
      link.id = 'theme-stylesheet';
      link.rel = 'stylesheet';
      link.href = cssUrl;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load theme: ${themeId}`));
      document.head.appendChild(link);
    });
  });
}
function setupThemeSelector(selectorId) {
  return new Promise(resolve => {
    const dropDownList = document.querySelector(`#${selectorId}`);
    if (!dropDownList) {
      resolve();
      return;
    }
    initThemes(dropDownList);
    const savedTheme = window.localStorage.getItem(themeKey) || themeList[0];
    dropDownList.value = savedTheme;
    loadThemeCss(savedTheme).then(() => {
      dropDownList.addEventListener('change', () => {
        const newTheme = dropDownList.value;
        window.localStorage.setItem(themeKey, newTheme);
        loadThemeCss(newTheme);
      });
      resolve();
    });
  });
}

const demosMeta = {"demos":{"DataGrid":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Simple Array","name":"SimpleArray","files":["data.js","index.html","index.js"]},{"title":"JSON Data","name":"AjaxRequest","files":["index.html","index.js"]},{"title":"Custom Data Source","name":"CustomDataSource","files":["index.html","index.js"]},{"title":"Web API Service","name":"WebAPIService","files":["index.html","index.js"]},{"title":"SignalR Service","name":"SignalRService","files":["index.html","index.js","styles.css"]},{"title":"Real-Time Updates","name":"RealTimeUpdates","files":["data.js","index.html","index.js","styles.css"]},{"title":"Filtering","name":"Filtering","files":["data.js","index.html","index.js","styles.css"]},{"title":"Filtering API","name":"FilteringAPI","files":["data.js","index.html","index.js","styles.css"]},{"title":"Filter Panel","name":"FilterPanel","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column Header Filter","name":"ColumnHeaderFilter","files":["data.js","index.html","index.js","styles.css"]},{"title":"Sorting","name":"MultipleSorting","files":["data.js","index.html","index.js","styles.css"]},{"title":"Row Editing","name":"RowEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Cell Editing","name":"CellEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Batch Editing","name":"BatchEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Form Editing","name":"FormEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Popup Editing","name":"PopupEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Editors","name":"CustomEditors","files":["data.js","index.html","index.js","styles.css"]},{"title":"Data Validation","name":"DataValidation","files":["index.html","index.js"]},{"title":"Cascading Lookups","name":"CascadingLookups","files":["data.js","index.html","index.js"]},{"title":"Collaborative Editing","name":"CollaborativeEditing","files":["index.html","index.js","styles.css"]},{"title":"Remote CRUD Operations","name":"RemoteCRUDOperations","files":["index.html","index.js","styles.css"]},{"title":"Batch Update Request","name":"BatchUpdateRequest","files":["index.html","index.js","styles.css"]},{"title":"Edit State Management","name":"EditStateManagement","files":["index.html","index.js","styles.css"]},{"title":"New Record Position","name":"NewRecordPosition","files":["data.js","index.html","index.js","styles.css"]},{"title":"Record Grouping","name":"RecordGrouping","files":["data.js","index.html","index.js","styles.css"]},{"title":"Remote Grouping","name":"RemoteGrouping","files":["index.html","index.js","styles.css"]},{"title":"Row Selection","name":"RowSelection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Record Selection","name":"MultipleRecordSelectionModes","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Record Selection API","name":"MultipleRecordSelectionAPI","files":["data.js","index.html","index.js","styles.css"]},{"title":"Deferred Selection","name":"DeferredSelection","files":["index.html","index.js","styles.css"]},{"title":"Focused Row","name":"FocusedRow","files":["data.js","index.html","index.js","styles.css"]},{"title":"Paging","name":"RecordPaging","files":["data.js","index.html","index.js","styles.css"]},{"title":"Local Virtual Scrolling","name":"VirtualScrolling","files":["data.js","index.html","index.js","styles.css"]},{"title":"Remote Virtual Scrolling","name":"RemoteVirtualScrolling","files":["index.html","index.js","styles.css"]},{"title":"Horizontal Virtual Scrolling","name":"HorizontalVirtualScrolling","files":["data.js","index.html","index.js","styles.css"]},{"title":"Infinite Scrolling","name":"InfiniteScrolling","files":["data.js","index.html","index.js","styles.css"]},{"title":"Auto-Populated Columns","name":"AutoPopulatedColumns","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multi-Level Headers (Bands)","name":"MultiRowHeadersBands","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column Reordering","name":"ColumnReordering","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column Resizing","name":"ColumnResizing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Fixed and Sticky Columns","name":"FixedAndStickyColumns","files":["data.js","index.html","index.js","styles.css"]},{"title":"Command Column Configuration","name":"CommandColumnConfiguration","files":["data.js","index.html","index.js"]},{"title":"Column Chooser","name":"ColumnChooser","files":["data.js","index.html","index.js","styles.css"]},{"title":"AI Columns","name":"AIColumns","files":["data.js","index.html","index.js","styles.css"]},{"title":"Master-Detail View","name":"MasterDetailView","files":["data.js","index.html","index.js","styles.css"]},{"title":"Master-Detail API","name":"MasterDetailAPI","files":["data.js","index.html","index.js","styles.css"]},{"title":"Advanced Master-Detail View","name":"AdvancedMasterDetailView","files":["index.html","index.js","styles.css"]},{"title":"Total Summaries","name":"GridSummaries","files":["data.js","index.html","index.js","styles.css"]},{"title":"Group Summaries","name":"GroupSummaries","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Summaries","name":"CustomSummaries","files":["data.js","index.html","index.js","styles.css"]},{"title":"Recalculate While Editing","name":"RecalculateWhileEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Local Reordering","name":"LocalReordering","files":["data.js","index.html","index.js","styles.css"]},{"title":"Remote Reordering","name":"RemoteReordering","files":["index.html","index.js","styles.css"]},{"title":"Drag & Drop Between Two Grids","name":"DnDBetweenGrids","files":["data.js","index.html","index.js","styles.css"]},{"title":"Overview","name":"PDFOverview","files":["data.js","index.html","index.js"]},{"title":"Cell Customization","name":"PDFCellCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Header and Footer","name":"PDFHeaderAndFooter","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Grids Export","name":"PDFExportMultipleGrids","files":["data.js","index.html","index.js","styles.css"]},{"title":"Image Export","name":"PDFExportImages","files":["data.js","index.html","index.js","styles.css"]},{"title":"Overview","name":"ExcelJSOverview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Cell Customization","name":"ExcelJSCellCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Header and Footer","name":"ExcelJSHeaderAndFooter","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Grids Export","name":"ExcelJSExportMultipleGrids","files":["data.js","index.html","index.js","styles.css"]},{"title":"Image Export","name":"ExcelJSExportImages","files":["data.js","index.html","index.js","styles.css"]},{"title":"Appearance","name":"Appearance","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column","name":"Column","files":["data.js","index.html","index.js","styles.css"]},{"title":"Row","name":"Row","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column 3rd Party Engine Template","name":"Column3RdPartyEngineTemplate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Row 3rd Party Engine Template","name":"Row3RdPartyEngineTemplate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Cell","name":"Cell","files":["data.js","index.html","index.js","styles.css"]},{"title":"Toolbar","name":"Toolbar","files":["data.js","index.html","index.js","styles.css"]},{"title":"State Persistence","name":"StatePersistence","files":["data.js","index.html","index.js","styles.css"]},{"title":"Overview","name":"GridAdaptabilityOverview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Columns Hiding Priority","name":"ColumnsHidingPriority","files":["data.js","index.html","index.js","styles.css"]},{"title":"Keyboard Navigation","name":"KeyboardNavigation","files":["data.js","index.html","index.js"]},{"title":"Customize Keyboard Navigation","name":"CustomizeKeyboardNavigation","files":["data.js","index.html","index.js","styles.css"]},{"title":"Right-To-Left Support","name":"RightToLeftSupport","files":["data.js","index.html","index.js","styles.css"]}],"TreeList":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Simple Array: Plain Structure","name":"SimpleArrayPlainStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Simple Array: Hierarchical Structure","name":"SimpleArrayHierarchicalStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Load Data on Demand","name":"LoadDataOnDemand","files":["index.html","index.js","styles.css"]},{"title":"Web API Service","name":"WebAPIService","files":["index.html","index.js","styles.css"]},{"title":"Search Panel","name":"SearchPanel","files":["data.js","index.html","index.js","styles.css"]},{"title":"Filter Row","name":"FilterRow","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column Header Filter","name":"ColumnHeaderFilter","files":["data.js","index.html","index.js","styles.css"]},{"title":"Filter Panel","name":"FilterPanel","files":["data.js","index.html","index.js","styles.css"]},{"title":"Filter Modes","name":"FilterModes","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Sorting","name":"MultipleSorting","files":["data.js","index.html","index.js","styles.css"]},{"title":"Row Editing","name":"RowEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Cell Editing","name":"CellEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Batch Editing","name":"BatchEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Form Editing","name":"FormEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Popup Editing","name":"PopupEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Single Row Selection","name":"SingleRowSelection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Row Selection","name":"MultipleRowSelection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Focused Row","name":"FocusedRow","files":["index.html","index.js","styles.css"]},{"title":"Paging","name":"Paging","files":["data.js","index.html","index.js"]},{"title":"Column Reordering","name":"Reordering","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column Resizing","name":"Resizing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Fixed and Sticky Columns","name":"FixedAndStickyColumns","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column Chooser","name":"ColumnChooser","files":["data.js","index.html","index.js","styles.css"]},{"title":"AI Columns","name":"AIColumns","files":["data.js","index.html","index.js","styles.css"]},{"title":"Node Drag & Drop","name":"LocalReordering","files":["data.js","index.html","index.js","styles.css"]},{"title":"State Persistence","name":"StatePersistence","files":["data.js","index.html","index.js","styles.css"]},{"title":"Adaptability","name":"Adaptability","files":["data.js","index.html","index.js","styles.css"]},{"title":"Keyboard Navigation","name":"KeyboardNavigation","files":["data.js","index.html","index.js"]},{"title":"Customize Keyboard Navigation","name":"CustomizeKeyboardNavigation","files":["data.js","index.html","index.js","styles.css"]}],"CardView":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Simple Array","name":"SimpleArray","files":["data.js","index.html","index.js"]},{"title":"Web API Service","name":"WebAPIService","files":["index.html","index.js"]},{"title":"Column Header Filter","name":"ColumnHeaderFilter","files":["data.js","index.html","index.js"]},{"title":"Filter Panel","name":"FilterPanel","files":["data.js","index.html","index.js"]},{"title":"Search Panel","name":"SearchPanel","files":["data.js","index.html","index.js"]},{"title":"Sorting","name":"Sorting","files":["data.js","index.html","index.js"]},{"title":"Popup Editing","name":"PopupEditing","files":["data.js","index.html","index.js"]},{"title":"Data Validation","name":"DataValidation","files":["data.js","index.html","index.js"]},{"title":"Selection","name":"Selection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Column Reordering","name":"ColumnReordering","files":["data.js","index.html","index.js"]},{"title":"Column Chooser","name":"ColumnChooser","files":["data.js","index.html","index.js","styles.css"]},{"title":"Card Template","name":"CardTemplate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Field Template","name":"FieldTemplate","files":["data.js","index.html","index.js","styles.css"]}],"PivotGrid":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Simple Array","name":"SimpleArray","files":["data.js","index.html","index.js","styles.css"]},{"title":"OLAP Data Source","name":"OLAPDataSource","files":["index.html","index.js","styles.css"]},{"title":"Web API Service","name":"WebAPIService","files":["index.html","index.js"]},{"title":"Integrated Field Chooser","name":"IntegratedFieldChooser","files":["index.html","index.js","styles.css"]},{"title":"Standalone Field Chooser","name":"StandaloneFieldChooser","files":["data.js","index.html","index.js","styles.css"]},{"title":"Field Panel","name":"FieldPanel","files":["data.js","index.html","index.js","styles.css"]},{"title":"Running Totals","name":"RunningTotals","files":["data.js","index.html","index.js","styles.css"]},{"title":"Summary Display Modes","name":"SummaryDisplayModes","files":["data.js","index.html","index.js","styles.css"]},{"title":"Drill Down","name":"DrillDown","files":["data.js","index.html","index.js","styles.css"]},{"title":"Filtering","name":"Filtering","files":["index.html","index.js","styles.css"]},{"title":"Virtual Scrolling","name":"VirtualScrolling","files":["data.js","index.html","index.js"]},{"title":"Remote Virtual Scrolling","name":"RemoteVirtualScrolling","files":["index.html","index.js","styles.css"]},{"title":"Overview","name":"ExcelJSOverview","files":["data.js","index.html","index.js"]},{"title":"Cell Customization","name":"ExcelJSCellCustomization","files":["data.js","index.html","index.js"]},{"title":"Header and Footer","name":"ExcelJsHeaderAndFooter","files":["data.js","index.html","index.js","styles.css"]},{"title":"Chart Integration","name":"ChartIntegration","files":["data.js","index.html","index.js","styles.css"]},{"title":"Customization","name":"Customization","files":["data.js","index.html","index.js","styles.css"]},{"title":"State Persistence","name":"StatePersistence","files":["data.js","index.html","index.js","styles.css"]}],"FilterBuilder":[{"title":"With Data Grid","name":"WithDataGrid","files":["data.js","index.html","index.js","styles.css"]},{"title":"With List","name":"WithList","files":["data.js","index.html","index.js","styles.css"]},{"title":"Customization","name":"Customization","files":["data.js","index.html","index.js","styles.css"]}],"Charts":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Simple Array","name":"SimpleArray","files":["data.js","index.html","index.js","styles.css"]},{"title":"JSON Data","name":"AjaxRequest","files":["index.html","index.js","styles.css"]},{"title":"Client-Side Data Processing","name":"ClientSideDataProcessing","files":["index.html","index.js","styles.css"]},{"title":"Server-Side Data Processing","name":"ServerSideDataProcessing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Dynamic Series","name":"DynamicSeries","files":["data.js","index.html","index.js","styles.css"]},{"title":"SignalR Service","name":"SignalRService","files":["index.html","index.js","styles.css"]},{"title":"Load Data On Demand","name":"LoadDataOnDemand","files":["index.html","index.js","styles.css"]},{"title":"Multiple Axes","name":"MultipleAxes","files":["data.js","index.html","index.js","styles.css"]},{"title":"Strips","name":"Strips","files":["data.js","index.html","index.js","styles.css"]},{"title":"Points Aggregation","name":"PointsAggregation","files":["data.js","index.html","index.js","styles.css"]},{"title":"Discrete Points Aggregation","name":"DiscretePointsAggregation","files":["data.js","index.html","index.js","styles.css"]},{"title":"Tooltip API","name":"TooltipAPI","files":["data.js","index.html","index.js","styles.css"]},{"title":"Tooltip Customization","name":"TooltipCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Selection","name":"Selection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Series Selection","name":"MultipleSeriesSelection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Point Selection","name":"MultiplePointSelection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Point Selection API","name":"PointSelectionAPI","files":["data.js","index.html","index.js","styles.css"]},{"title":"Axis Label Customization","name":"AxisLabelCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Legend Markers Customization","name":"LegendMarkersCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Panes","name":"MultiplePanes","files":["data.js","index.html","index.js","styles.css"]},{"title":"Error Bars","name":"ErrorBars","files":["data.js","index.html","index.js","styles.css"]},{"title":"Area Selection Zooming","name":"AreaSelectionZooming","files":["data.js","index.html","index.js","styles.css"]},{"title":"Zooming and Panning","name":"ZoomingAndScrolling","files":["data.js","index.html","index.js","styles.css"]},{"title":"Zooming and Panning API","name":"ZoomingAndScrollingAPI","files":["data.js","index.html","index.js"]},{"title":"Discrete Axis Zooming and Panning","name":"DiscreteAxisZoomingAndScrolling","files":["data.js","index.html","index.js","styles.css"]},{"title":"Polar Chart Zooming and Panning API","name":"PolarChartZoomingAndScrollingAPI","files":["data.js","index.html","index.js","styles.css"]},{"title":"Export and Printing API","name":"ExportAndPrintingAPI","files":["data.js","index.html","index.js","styles.css"]},{"title":"Export Several Charts","name":"ExportSeveralCharts","files":["data.js","index.html","index.js","styles.css"]},{"title":"Export Custom Markup","name":"ExportCustomMarkup","files":["data.js","index.html","index.js","styles.css"]},{"title":"Area","name":"Area","files":["data.js","index.html","index.js","styles.css"]},{"title":"Spline Area","name":"SplineArea","files":["data.js","index.html","index.js","styles.css"]},{"title":"Step Area","name":"StepArea","files":["data.js","index.html","index.js","styles.css"]},{"title":"Step Area with Gaps","name":"NullPointSupport","files":["data.js","index.html","index.js","styles.css"]},{"title":"Standard Bar","name":"StandardBar","files":["data.js","index.html","index.js","styles.css"]},{"title":"Side-by-Side Bar","name":"SideBySideBar","files":["data.js","index.html","index.js","styles.css"]},{"title":"Stacked Bar","name":"StackedBar","files":["data.js","index.html","index.js","styles.css"]},{"title":"Full Stacked Bar","name":"FullStackedBar","files":["data.js","index.html","index.js","styles.css"]},{"title":"Side-by-Side Stacked Bar","name":"SideBySideStackedBar","files":["data.js","index.html","index.js","styles.css"]},{"title":"Drill-Down","name":"BarDrillDown","files":["data.js","index.html","index.js","styles.css"]},{"title":"Side-by-Side Full-Stacked Bar","name":"SideBySideFullStackedBar","files":["data.js","index.html","index.js","styles.css"]},{"title":"Auto-Calculated Bar Width","name":"AutoCalculatedBarWidth","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Bar Width","name":"CustomBarWidth","files":["data.js","index.html","index.js","styles.css"]},{"title":"Bar Color Customization","name":"BarColorCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Customize Points and Labels","name":"CustomizePointsAndLabels","files":["data.js","index.html","index.js","styles.css"]},{"title":"Scale Breaks","name":"ScaleBreaks","files":["data.js","index.html","index.js","styles.css"]},{"title":"Bi-Directional Bar Chart","name":"BiDirectionalBarChart","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Annotations","name":"CustomAnnotations","files":["data.js","index.html","index.js","styles.css"]},{"title":"Bullets","name":"SimpleBullets","files":["index.html","index.js","styles.css"]},{"title":"Doughnut","name":"Doughnut","files":["data.js","index.html","index.js","styles.css"]},{"title":"Doughnut Selection","name":"DoughnutSelection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Doughnut with Top N Series","name":"DoughnutWithTopNSeries","files":["data.js","index.html","index.js","styles.css"]},{"title":"Doughnut with Multiple Series","name":"PieWithMultipleSeries","files":["data.js","index.html","index.js","styles.css"]},{"title":"Center Label Customization","name":"CenterLabelCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Stock","name":"Stock","files":["data.js","index.html","index.js","styles.css"]},{"title":"Candlestick","name":"Candlestick","files":["data.js","index.html","index.js","styles.css"]},{"title":"Points Aggregation","name":"PointsAggregationFinancialChart","files":["data.js","index.html","index.js","styles.css"]},{"title":"Annotations","name":"Annotation","files":["data.js","index.html","index.js","styles.css"]},{"title":"Funnel Chart","name":"FunnelChart","files":["data.js","index.html","index.js","styles.css"]},{"title":"Pyramid Chart","name":"PyramidChart","files":["data.js","index.html","index.js","styles.css"]},{"title":"Line","name":"Line","files":["data.js","index.html","index.js","styles.css"]},{"title":"Spline","name":"Spline","files":["data.js","index.html","index.js","styles.css"]},{"title":"Resolve Label Overlap","name":"ResolveLabelOverlap","files":["data.js","index.html","index.js","styles.css"]},{"title":"Hover Mode","name":"HoverMode","files":["data.js","index.html","index.js","styles.css"]},{"title":"Step Line","name":"StepLine","files":["data.js","index.html","index.js","styles.css"]},{"title":"Crosshair","name":"Crosshair","files":["data.js","index.html","index.js","styles.css"]},{"title":"Point Image","name":"PointImage","files":["data.js","index.html","index.js","styles.css"]},{"title":"Logarithmic vs Linear Axes","name":"LogarithmicVsLinearAxes","files":["data.js","index.html","index.js","styles.css"]},{"title":"Pareto Chart","name":"ParetoChart","files":["data.js","index.html","index.js","styles.css"]},{"title":"Pie","name":"Pie","files":["data.js","index.html","index.js","styles.css"]},{"title":"Equal Size Pies","name":"EqualSizePies","files":["data.js","index.html","index.js","styles.css"]},{"title":"Label Customization","name":"LabelCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Small Value Groups","name":"SmallValueGroups","files":["data.js","index.html","index.js","styles.css"]},{"title":"Resolve Label Overlap","name":"PieResolveLabelOverlap","files":["data.js","index.html","index.js","styles.css"]},{"title":"Palette","name":"Palette","files":["data.js","index.html","index.js","styles.css"]},{"title":"Annotations","name":"PieAnnotations","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Fill Styles","name":"CustomFillStyles","files":["data.js","index.html","index.js","styles.css"]},{"title":"Scatter","name":"Scatter","files":["index.html","index.js","styles.css"]},{"title":"Bubble","name":"Bubble","files":["data.js","index.html","index.js","styles.css"]},{"title":"Scatter Logarithmic Axis","name":"LogarithmicAxis","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Axis Position","name":"AxisCustomPosition","files":["data.js","index.html","index.js","styles.css"]},{"title":"Continuous Data","name":"ContinuousData","files":["data.js","index.html","index.js","styles.css"]},{"title":"Discrete Data","name":"DiscreteData","files":["data.js","index.html","index.js","styles.css"]},{"title":"Spider Web","name":"SpiderWeb","files":["data.js","index.html","index.js","styles.css"]},{"title":"Wind Rose","name":"WindRose","files":["data.js","index.html","index.js","styles.css"]},{"title":"Periodic Data","name":"PeriodicData","files":["data.js","index.html","index.js","styles.css"]},{"title":"Inverted Chart","name":"InvertedChart","files":["data.js","index.html","index.js","styles.css"]},{"title":"Annotations","name":"PolarChartAnnotations","files":["data.js","index.html","index.js","styles.css"]},{"title":"Range Bar","name":"RangeBar","files":["data.js","index.html","index.js","styles.css"]},{"title":"Timeline Chart","name":"Timeline","files":["data.js","index.html","index.js","styles.css"]},{"title":"Range Area","name":"RangeArea","files":["data.js","index.html","index.js","styles.css"]},{"title":"Overview","name":"SankeyChart","files":["data.js","index.html","index.js","styles.css"]},{"title":"Sparklines","name":"SimpleSparklines","files":["data.js","index.html","index.js","styles.css"]},{"title":"Area Sparklines","name":"AreaSparklines","files":["data.js","index.html","index.js","styles.css"]},{"title":"Bar Sparklines","name":"BarSparklines","files":["index.html","index.js","styles.css"]},{"title":"Winloss Sparklines","name":"WinlossSparklines","files":["data.js","index.html","index.js","styles.css"]},{"title":"Hierarchical Data Structure","name":"HierarchicalDataStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Plain Data Structure","name":"FlatDataStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Tiling Algorithms","name":"TilingAlgorithms","files":["data.js","index.html","index.js","styles.css"]},{"title":"Colorization","name":"Colorization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Drill Down","name":"DrillDown","files":["data.js","index.html","index.js","styles.css"]}],"Gauges":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]},{"title":"Circular Gauge","name":"CircularGauge","files":["data.js","index.html","index.js","styles.css"]},{"title":"Linear Gauge","name":"LinearGauge","files":["data.js","index.html","index.js","styles.css"]},{"title":"Bar Gauge","name":"BarGauge","files":["data.js","index.html","index.js","styles.css"]},{"title":"Labels Customization","name":"LabelsCustomization","files":["index.html","index.js","styles.css"]},{"title":"Palette","name":"Palette","files":["index.html","index.js","styles.css"]},{"title":"Tooltip and Legend","name":"Tooltip","files":["index.html","index.js","styles.css"]},{"title":"Variable Number of Bars","name":"VariableNumberOfBars","files":["data.js","index.html","index.js","styles.css"]},{"title":"Palette for Ranges","name":"PaletteForRanges","files":["index.html","index.js","styles.css"]},{"title":"Scale Minor Ticks","name":"ScaleMinorTicks","files":["index.html","index.js","styles.css"]},{"title":"Scale Label Formatting","name":"ScaleLabelFormatting","files":["index.html","index.js","styles.css"]},{"title":"Different Value Indicator Types","name":"DifferentValueIndicatorTypes","files":["index.html","index.js","styles.css"]},{"title":"Different Subvalue Indicator Types","name":"DifferentSubvalueIndicatorTypes","files":["index.html","index.js","styles.css"]},{"title":"Subvalue Indicator Text Formatting","name":"SubvalueIndicatorTextFormatting","files":["index.html","index.js","styles.css"]},{"title":"Custom Layout","name":"CustomLayout","files":["index.html","index.js","styles.css"]},{"title":"Angles Customization","name":"AnglesCustomization","files":["index.html","index.js","styles.css"]},{"title":"Title and Center Label Customization","name":"GaugeTitleCustomized","files":["index.html","index.js","styles.css"]},{"title":"Gauge Tooltip","name":"GaugeTooltip","files":["index.html","index.js","styles.css"]},{"title":"Value Indicators API","name":"ValueIndicatorsAPI","files":["index.html","index.js","styles.css"]},{"title":"Scale Custom Tick Interval","name":"ScaleCustomTickInterval","files":["index.html","index.js","styles.css"]},{"title":"Scale Custom Tick Values","name":"ScaleCustomTickValues","files":["index.html","index.js","styles.css"]},{"title":"Different Value Indicator Types","name":"DifferentValueIndicatorTypesLinearGauge","files":["index.html","index.js","styles.css"]},{"title":"Different Subvalue Indicator Types","name":"DifferentSubvalueIndicatorTypesLinearGauge","files":["index.html","index.js","styles.css"]},{"title":"Range Bar Base Value","name":"RangeBarBaseValue","files":["index.html","index.js","styles.css"]},{"title":"Custom Layout","name":"CustomLayoutLinearGauge","files":["index.html","index.js","styles.css"]},{"title":"Subvalue Indicators Runtime Customization","name":"SubvalueIndicatorsRuntimeCustomization","files":["data.js","index.html","index.js","styles.css"]}],"Diagram":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]},{"title":"Node and Edge Arrays","name":"NodesAndEdgesArrays","files":["data.js","index.html","index.js","styles.css"]},{"title":"Node List: Linear Array","name":"NodesArrayPlainStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Node List: Hierarchical Array","name":"NodesArrayHierarchicalStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Advanced Data Binding","name":"AdvancedDataBinding","files":["data.js","index.html","index.js","styles.css"]},{"title":"Web API Service","name":"WebAPIService","files":["index.html","index.js","styles.css"]},{"title":"Containers","name":"Containers","files":["index.html","index.js","styles.css"]},{"title":"OrgChart Shapes","name":"ImagesInShapes","files":["data.js","index.html","index.js","styles.css"]},{"title":"Background Images","name":"CustomShapesWithIcons","files":["index.html","index.js","styles.css"]},{"title":"Shapes with Base Type","name":"CustomShapesWithTexts","files":["data.js","index.html","index.js","styles.css"]},{"title":"Templates","name":"CustomShapesWithTemplates","files":["data.js","index.html","index.js","styles.css"]},{"title":"Templates with Editing","name":"CustomShapesWithTemplatesWithEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Read Only Mode","name":"ReadOnly","files":["index.html","index.js","styles.css"]},{"title":"Simple View","name":"SimpleView","files":["data.js","index.html","index.js","styles.css"]},{"title":"Item Selection","name":"ItemSelection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Editing Restrictions","name":"OperationRestrictions","files":["data.js","index.html","index.js","styles.css"]},{"title":"UI Customization","name":"UICustomization","files":["index.html","index.js","styles.css"]},{"title":"Adaptability","name":"Adaptability","files":["index.html","index.js","styles.css"]}],"Scheduler":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Simple Array","name":"SimpleArray","files":["data.js","index.html","index.js"]},{"title":"Web API Service","name":"WebAPIService","files":["index.html","index.js"]},{"title":"SignalR Service","name":"SignalRService","files":["index.html","index.js","styles.css"]},{"title":"Google Calendar Integration","name":"GoogleCalendarIntegration","files":["data.js","index.html","index.js","styles.css"]},{"title":"Basic Views","name":"BasicViews","files":["data.js","index.html","index.js"]},{"title":"Timeline","name":"Timelines","files":["data.js","index.html","index.js","styles.css"]},{"title":"Agenda","name":"Agenda","files":["data.js","index.html","index.js"]},{"title":"Recurring Appointments","name":"RecurringAppointments","files":["data.js","index.html","index.js"]},{"title":"Resources","name":"Resources","files":["data.js","index.html","index.js","styles.css"]},{"title":"Resolve Time Conflicts","name":"ResolveTimeConflicts","files":["data.js","index.html","index.js","styles.css"]},{"title":"All Day Panel Mode","name":"AllDayPanelMode","files":["data.js","index.html","index.js","styles.css"]},{"title":"Work Shifts","name":"WorkShifts","files":["data.js","index.html","index.js","styles.css"]},{"title":"Time Zone Support","name":"TimeZonesSupport","files":["data.js","index.html","index.js","styles.css"]},{"title":"Current Time Indicator","name":"CurrentTimeIndicator","files":["data.js","index.html","index.js","styles.css"]},{"title":"Disabled Date/Time Ranges","name":"CellTemplates","files":["data.js","index.html","index.js","styles.css"]},{"title":"Editing","name":"Editing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Grouping by Resources","name":"GroupingByResources","files":["data.js","index.html","index.js","styles.css"]},{"title":"Grouping by Date","name":"GroupByDate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Virtual Scrolling","name":"VirtualScrolling","files":["data.js","index.html","index.js","styles.css"]},{"title":"Drag & Drop","name":"DragAndDrop","files":["data.js","index.html","index.js","styles.css"]},{"title":"Edit Form and Templates","name":"Templates","files":["data.js","index.html","index.js","styles.css"]},{"title":"Toolbar","name":"Toolbar","files":["data.js","index.html","index.js"]},{"title":"Individual Views Customization","name":"IndividualViewsCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom View Duration","name":"CustomViewDuration","files":["data.js","index.html","index.js"]},{"title":"Appointment Count per Cell","name":"AppointmentCountPerCell","files":["data.js","index.html","index.js"]},{"title":"Context Menu","name":"ContextMenu","files":["data.js","index.html","index.js","styles.css"]},{"title":"Adaptability","name":"Adaptability","files":["data.js","index.html","index.js","styles.css"]}],"Gantt":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Data Binding","name":"DataBinding","files":["data.js","index.html","index.js","styles.css"]},{"title":"Filter Row","name":"FilterRow","files":["data.js","index.html","index.js","styles.css"]},{"title":"Header Filter","name":"HeaderFilter","files":["data.js","index.html","index.js","styles.css"]},{"title":"Sorting","name":"Sorting","files":["data.js","index.html","index.js","styles.css"]},{"title":"Strip Lines","name":"StripLines","files":["data.js","index.html","index.js","styles.css"]},{"title":"Export To PDF","name":"ExportToPDF","files":["data.js","index.html","index.js","styles.css"]},{"title":"Validation","name":"Validation","files":["data.js","index.html","index.js","styles.css"]},{"title":"Appearance","name":"Appearance","files":["data.js","index.html","index.js","styles.css"]},{"title":"Task Template","name":"TaskTemplate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Toolbar","name":"Toolbar","files":["data.js","index.html","index.js","styles.css"]},{"title":"Context Menu","name":"ContextMenu","files":["data.js","index.html","index.js","styles.css"]}],"Chat":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Edit and Delete Messages","name":"MessageEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"File Attachments","name":"FileAttachments","files":["data.js","index.html","index.js","styles.css"]},{"title":"Customization","name":"Customization","files":["data.js","index.html","index.js","styles.css"]},{"title":"AI and Chatbot Integration","name":"AIAndChatbotIntegration","files":["data.js","index.html","index.js","styles.css"]}],"HtmlEditor":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Mentions","name":"Mentions","files":["data.js","index.html","index.js","styles.css"]},{"title":"Tables","name":"Tables","files":["data.js","index.html","index.js","styles.css"]},{"title":"AI-powered Text Editing","name":"AITextEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Markdown Support","name":"MarkdownSupport","files":["data.js","index.html","index.js","styles.css"]},{"title":"Toolbar Customization","name":"ToolbarCustomization","files":["data.js","index.html","index.js","styles.css"]}],"Common":[{"title":"Overview","name":"FormsOverview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Overview","name":"EditorsOverview","files":["index.html","index.js","styles.css"]},{"title":"Custom Text Editor Buttons","name":"CustomTextEditorButtons","files":["index.html","index.js","styles.css"]},{"title":"Right-to-Left Support","name":"EditorsRightToLeftSupport","files":["data.js","index.html","index.js","styles.css"]},{"title":"Editor Appearance Variants","name":"EditorAppearanceVariants","files":["data.js","index.html","index.js","styles.css"]},{"title":"Overview","name":"PopupAndNotificationsOverview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Overview","name":"NavigationOverview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Overview","name":"ListsOverview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Right-to-Left Support","name":"NavigationRightToLeftSupport","files":["data.js","index.html","index.js","styles.css"]}],"Form":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Item Customization","name":"ItemCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Grouping","name":"Grouping","files":["data.js","index.html","index.js","styles.css"]},{"title":"Adaptability","name":"Adaptability","files":["data.js","index.html","index.js","styles.css"]},{"title":"Validation","name":"Validation","files":["data.js","index.html","index.js","styles.css"]},{"title":"Customize Fields at Runtime","name":"UpdateItemsDynamically","files":["data.js","index.html","index.js","styles.css"]},{"title":"Smart Paste","name":"SmartPaste","files":["data.js","index.html","index.js","styles.css"]}],"FieldSet":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"Validation":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"Calendar":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]},{"title":"Multiple Selection","name":"MultipleSelection","files":["index.html","index.js","styles.css"]}],"CheckBox":[{"title":"Overview","name":"Overview","files":["index.html","index.js"]}],"ColorBox":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"DateBox":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Formatting","name":"Formatting","files":["index.html","index.js","styles.css"]}],"DateRangeBox":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]},{"title":"Formatting","name":"Formatting","files":["index.html","index.js","styles.css"]}],"NumberBox":[{"title":"Overview","name":"Overview","files":["index.html","index.js"]},{"title":"Formatting","name":"Formatting","files":["index.html","index.js","styles.css"]}],"RadioGroup":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"RangeSelector":[{"title":"Numeric Scale (Lightweight)","name":"NumericScaleLightweight","files":["index.html","index.js","styles.css"]},{"title":"Numeric Scale","name":"NumericScale","files":["data.js","index.html","index.js","styles.css"]},{"title":"Date-Time Scale (Lightweight)","name":"DateTimeScaleLightweight","files":["index.html","index.js","styles.css"]},{"title":"Date-Time Scale","name":"DateTimeScale","files":["data.js","index.html","index.js","styles.css"]},{"title":"Logarithmic Scale","name":"LogarithmicScale","files":["index.html","index.js","styles.css"]},{"title":"Discrete scale","name":"DiscreteScale","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Formatting","name":"CustomFormatting","files":["index.html","index.js","styles.css"]},{"title":"Calculation","name":"Calculation","files":["index.html","index.js","styles.css"]},{"title":"Filter","name":"Filter","files":["data.js","index.html","index.js","styles.css"]},{"title":"Background Image","name":"BackgroundImage","files":["index.html","index.js","styles.css"]},{"title":"Embedded Chart","name":"EmbeddedChart","files":["index.html","index.js","styles.css"]},{"title":"Embedded Chart (Customized)","name":"EmbeddedChartCustomized","files":["index.html","index.js","styles.css"]},{"title":"Embedded Chart (Series Template)","name":"EmbeddedChartSeriesTemplate","files":["data.js","index.html","index.js","styles.css"]}],"RangeSlider":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"Slider":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"Switch":[{"title":"Overview","name":"Overview","files":["index.html","index.js"]}],"TextArea":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"TextBox":[{"title":"Overview","name":"Overview","files":["index.html","index.js"]}],"Autocomplete":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"DropDownBox":[{"title":"Single Selection","name":"SingleSelection","files":["index.html","index.js","styles.css"]},{"title":"Multiple Selection","name":"MultipleSelection","files":["index.html","index.js","styles.css"]}],"SelectBox":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Search and Editing","name":"SearchAndEditing","files":["data.js","index.html","index.js","styles.css"]},{"title":"Customize Drop-Down Button","name":"CustomizeDropDownButton","files":["data.js","index.html","index.js","styles.css"]},{"title":"Grouping","name":"Grouping","files":["data.js","index.html","index.js","styles.css"]}],"TagBox":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Grouping","name":"Grouping","files":["data.js","index.html","index.js","styles.css"]},{"title":"Tag Count Limitation","name":"TagCountLimitation","files":["data.js","index.html","index.js","styles.css"]}],"Lookup":[{"title":"Basics","name":"Basics","files":["data.js","index.html","index.js","styles.css"]},{"title":"Templates","name":"Templates","files":["data.js","index.html","index.js","styles.css"]},{"title":"Handle Value Change","name":"EventHandling","files":["data.js","index.html","index.js","styles.css"]}],"Button":[{"title":"Predefined Types","name":"PredefinedTypes","files":["index.html","index.js","styles.css"]},{"title":"Icons","name":"Icons","files":["index.html","index.js","styles.css"]}],"ButtonGroup":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"DropDownButton":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"SpeechToText":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"FloatingActionButton":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"FileManager":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]},{"title":"Physical File System","name":"BindingToFileSystem","files":["index.html","index.js"]},{"title":"Entity Framework ORM","name":"BindingToEF","files":["index.html","index.js"]},{"title":"Hierarchical JS Structure","name":"BindingToHierarchicalStructure","files":["data.js","index.html","index.js"]},{"title":"Custom Thumbnails","name":"CustomThumbnails","files":["data.js","index.html","index.js"]},{"title":"Toolbar and Context Menu","name":"UICustomization","files":["data.js","index.html","index.js"]}],"FileUploader":[{"title":"Form Upload","name":"FileSelection","files":["index.html","index.js","styles.css"]},{"title":"Async Upload","name":"FileUploading","files":["index.html","index.js","styles.css"]},{"title":"Validation","name":"Validation","files":["index.html","index.js","styles.css"]},{"title":"Chunk Upload","name":"ChunkUpload","files":["index.html","index.js","styles.css"]},{"title":"Custom Drop Zone","name":"CustomDropzone","files":["index.html","index.js","styles.css"]}],"Popover":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"Popup":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Scrolling","name":"Scrolling","files":["data.js","index.html","index.js","styles.css"]}],"Toast":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Stack","name":"Stack","files":["data.js","index.html","index.js","styles.css"]}],"Tooltip":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"Accordion":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"ActionSheet":[{"title":"Basics","name":"Basics","files":["data.js","index.html","index.js","styles.css"]},{"title":"Popover Mode","name":"PopoverMode","files":["data.js","index.html","index.js","styles.css"]}],"ContextMenu":[{"title":"Basics","name":"Basics","files":["data.js","index.html","index.js","styles.css"]},{"title":"Scrolling","name":"Scrolling","files":["data.js","index.html","index.js","styles.css"]},{"title":"Templates","name":"Templates","files":["data.js","index.html","index.js","styles.css"]}],"Menu":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Scrolling","name":"Scrolling","files":["data.js","index.html","index.js","styles.css"]}],"MultiView":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"Drawer":[{"title":"Left or Right Position","name":"LeftOrRightPosition","files":["data.js","index.html","index.js","styles.css"]},{"title":"Top or Bottom Position","name":"TopOrBottomPosition","files":["data.js","index.html","index.js","styles.css"]}],"TabPanel":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Drag & Drop","name":"DragAndDrop","files":["data.js","index.html","index.js","styles.css"]},{"title":"Templates","name":"Templates","files":["data.js","index.html","index.js","styles.css"]}],"Tabs":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Selection","name":"Selection","files":["data.js","index.html","index.js","styles.css"]}],"Toolbar":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Adaptability","name":"Adaptability","files":["data.js","index.html","index.js","styles.css"]}],"Stepper":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Form Integration","name":"FormIntegration","files":["data.js","index.html","index.js","styles.css"]},{"title":"Step Template","name":"StepTemplate","files":["data.js","index.html","index.js","styles.css"]}],"Pagination":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"List":[{"title":"Item Deletion","name":"ItemDeletion","files":["data.js","index.html","index.js","styles.css"]},{"title":"Grouping","name":"Grouping","files":["data.js","index.html","index.js","styles.css"]},{"title":"Item Template","name":"ItemTemplate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Item 3rd Party Engine Template","name":"Item3RdPartyEngineTemplate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Search","name":"Search","files":["data.js","index.html","index.js","styles.css"]},{"title":"Selection","name":"Selection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Drag & Drop","name":"DragAndDrop","files":["data.js","index.html","index.js","styles.css"]},{"title":"Web API Service","name":"WebAPI","files":["index.html","index.js"]}],"TreeView":[{"title":"Hierarchical Data Structure","name":"HierarchicalDataStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Plain Data Structure","name":"FlatDataStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Load Data on Demand","name":"LoadDataOnDemand","files":["index.html","index.js"]},{"title":"Virtual Mode","name":"VirtualMode","files":["data.js","index.html","index.js"]},{"title":"Selection and Customization","name":"ItemSelectionAndCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Search","name":"TreeViewWithSearchBar","files":["data.js","index.html","index.js","styles.css"]},{"title":"ContextMenu","name":"ContextMenuIntegration","files":["data.js","index.html","index.js","styles.css"]},{"title":"Plain Data Structure","name":"DragAndDropPlainDataStructure","files":["data.js","index.html","index.js","styles.css"]},{"title":"Hierarchical Data Structure","name":"DragAndDropHierarchicalDataStructure","files":["data.js","index.html","index.js","styles.css"]}],"TileView":[{"title":"Basics","name":"Basics","files":["data.js","index.html","index.js","styles.css"]},{"title":"Directions","name":"Directions","files":["data.js","index.html","index.js","styles.css"]},{"title":"Item Template","name":"ItemTemplate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Item 3rd Party Engine Template","name":"Item3RdPartyEngineTemplate","files":["data.js","index.html","index.js","styles.css"]}],"Splitter":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"Gallery":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Item Template","name":"ItemTemplate","files":["data.js","index.html","index.js","styles.css"]},{"title":"Item 3rd Party Engine Template","name":"Item3RdPartyEngineTemplate","files":["data.js","index.html","index.js","styles.css"]}],"ScrollView":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"Box":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"ResponsiveBox":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"Sortable":[{"title":"Kanban","name":"Kanban","files":["data.js","index.html","index.js","styles.css"]},{"title":"Customization","name":"Customization","files":["data.js","index.html","index.js","styles.css"]}],"Resizable":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"LoadIndicator":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"LoadPanel":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]}],"ProgressBar":[{"title":"Overview","name":"Overview","files":["index.html","index.js","styles.css"]}],"VectorMap":[{"title":"Overview","name":"Overview","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Map Data","name":"CustomMapData","files":["data.js","index.html","index.js","styles.css"]},{"title":"Floor Plan","name":"FloorPlan","files":["data.js","index.html","index.js","styles.css"]},{"title":"Multiple Layers","name":"MultipleLayers","files":["data.js","index.html","index.js","styles.css"]},{"title":"Image Markers","name":"ImageMarkers","files":["data.js","index.html","index.js","styles.css"]},{"title":"Bubble Markers","name":"BubbleMarkers","files":["data.js","index.html","index.js","styles.css"]},{"title":"Pie Markers","name":"PieMarkers","files":["data.js","index.html","index.js","styles.css"]},{"title":"Legend","name":"Legend","files":["data.js","index.html","index.js","styles.css"]},{"title":"Zooming and Centering","name":"ZoomingAndCentering","files":["data.js","index.html","index.js","styles.css"]},{"title":"Dynamic Viewport","name":"DynamicViewport","files":["data.js","index.html","index.js","styles.css"]},{"title":"Colors Customization","name":"ColorsCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Palette","name":"Palette","files":["data.js","index.html","index.js","styles.css"]},{"title":"Tooltips Customization","name":"TooltipsCustomization","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Projection","name":"CustomProjection","files":["data.js","index.html","index.js","styles.css"]},{"title":"Custom Annotations","name":"CustomAnnotations","files":["data.js","index.html","index.js","styles.css"]}],"Map":[{"title":"Providers and Types","name":"ProvidersAndTypes","files":["index.html","index.js","styles.css"]},{"title":"Markers","name":"Markers","files":["index.html","index.js","styles.css"]},{"title":"Routes","name":"Routes","files":["index.html","index.js","styles.css"]}],"Localization":[{"title":"Using Intl","name":"UsingIntl","files":["data.js","index.html","index.js","styles.css"]},{"title":"Using Globalize","name":"UsingGlobalize","files":["data.js","index.html","index.js","styles.css"]}]}};

const {
  demos: demosMap
} = demosMeta;
setLicenseCheckSkipCondition();
const RECENTS_KEY = 'dx-playground-recents';
const PINNED_KEY = 'dx-playground-pinned';
const PINNED_DEMOS_KEY = 'dx-playground-pinned-demos';
const RECENT_DEMOS_KEY = 'dx-playground-recent-demos';
const MAX_RECENTS = 5;
const MAX_RECENT_DEMOS = 20;
const widgetGroups = [{
  label: 'Grids',
  ids: ['dataGrid', 'cardView', 'treeList', 'filterBuilder', 'sortable', 'draggable']
}, {
  label: 'Scheduler',
  ids: ['scheduler', 'pivotGrid', 'pivotGridFieldChooser', 'pagination', 'gantt', 'recurrenceEditor']
}, {
  label: 'Editors',
  ids: ['autocomplete', 'calendar', 'chat', 'checkBox', 'colorBox', 'dateBox', 'dateRangeBox', 'dropDownBox', 'dropDownButton', 'fileUploader', 'htmlEditor', 'loadPanel', 'lookup', 'map', 'numberBox', 'popover', 'popup', 'progressBar', 'radioGroup', 'rangeSlider', 'selectBox', 'slider', 'switch', 'tagBox', 'textArea', 'textBox', 'toast', 'tooltip', 'validationGroup', 'validationSummary', 'validator']
}, {
  label: 'Navigation',
  ids: ['accordion', 'actionSheet', 'box', 'button', 'buttonGroup', 'contextMenu', 'diagram', 'drawer', 'fileManager', 'form', 'gallery', 'list', 'loadIndicator', 'menu', 'multiView', 'resizable', 'responsiveBox', 'scrollView', 'speedDialAction', 'splitter', 'stepper', 'tabPanel', 'tabs', 'tileView', 'toolbar', 'treeView', 'barGauge', 'bullet', 'chart', 'circularGauge', 'funnel', 'linearGauge', 'pieChart', 'polarChart', 'rangeSelector', 'sankey', 'sparkline', 'treeMap', 'vectorMap']
}];
function getPinned() {
  try {
    return JSON.parse(localStorage.getItem(PINNED_KEY) ?? '[]');
  } catch {
    return [];
  }
}
function isPinned(id) {
  return getPinned().includes(id);
}
function togglePin(id) {
  const pinned = getPinned();
  const idx = pinned.indexOf(id);
  if (idx === -1) {
    pinned.push(id);
  } else {
    pinned.splice(idx, 1);
  }
  localStorage.setItem(PINNED_KEY, JSON.stringify(pinned));
  renderPinned();
  buildNav(jQuery('#search').val());
}
function getPinnedDemos() {
  try {
    return JSON.parse(localStorage.getItem(PINNED_DEMOS_KEY) ?? '[]');
  } catch {
    return [];
  }
}
function isDemoPinned(widget, name) {
  return getPinnedDemos().some(d => d.widget === widget && d.name === name);
}
function toggleDemoPin(widget, name, title) {
  const demos = getPinnedDemos();
  const idx = demos.findIndex(d => d.widget === widget && d.name === name);
  if (idx === -1) {
    demos.push({
      widget,
      name,
      title
    });
  } else {
    demos.splice(idx, 1);
  }
  localStorage.setItem(PINNED_DEMOS_KEY, JSON.stringify(demos));
  renderPinned();
}
function renderPinned() {
  const $section = jQuery('#pinned-section');
  const $list = jQuery('#pinned-list');
  const pinned = getPinned().filter(id => registry[id]);
  const pinnedDemos = getPinnedDemos();
  $list.empty();
  if (pinned.length === 0 && pinnedDemos.length === 0) {
    $section.hide();
    return;
  }
  $section.show();
  const currentHash = location.hash.slice(1);
  pinned.forEach(id => {
    const entry = registry[id];
    const $li = jQuery('<li class="pinned-item">').appendTo($list);
    jQuery('<a>').attr('href', `#${id}`).text(entry.label).toggleClass('active', id === currentHash).appendTo($li);
    jQuery('<button class="btn-unpin" title="Unpin">×</button>').on('click', e => {
      e.preventDefault();
      togglePin(id);
    }).appendTo($li);
  });
  pinnedDemos.forEach(({
    widget,
    name,
    title
  }) => {
    const hash = `demo/${widget}/${name}`;
    const $li = jQuery('<li class="pinned-item pinned-demo">').appendTo($list);
    jQuery('<a>').attr('href', `#${hash}`).toggleClass('active', currentHash === hash).html(`<span class="pinned-demo-badge">${widget}</span>${title}`).appendTo($li);
    jQuery('<button class="btn-unpin" title="Unpin">×</button>').on('click', e => {
      e.preventDefault();
      toggleDemoPin(widget, name, title);
    }).appendTo($li);
  });
}
function getRecentDemos() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_DEMOS_KEY) ?? '[]');
  } catch {
    return [];
  }
}
function pushRecentDemo(widget, name) {
  const recents = getRecentDemos().filter(d => !(d.widget === widget && d.name === name));
  recents.unshift({
    widget,
    name
  });
  localStorage.setItem(RECENT_DEMOS_KEY, JSON.stringify(recents.slice(0, MAX_RECENT_DEMOS)));
}
function getDemoChipColors(widget, name) {
  const idx = getRecentDemos().findIndex(d => d.widget === widget && d.name === name);
  if (idx === -1) {
    return {
      borderColor: 'hsl(217, 8%, 78%)',
      color: 'hsl(217, 8%, 58%)',
      background: '#fff'
    };
  }
  const t = idx / Math.max(MAX_RECENT_DEMOS - 1, 1);
  const s = Math.round(78 - t * 58);
  const borderL = Math.round(54 + t * 18);
  const textL = Math.round(34 + t * 18);
  const bgL = Math.round(95 + t * 3);
  return {
    borderColor: `hsl(217, ${s}%, ${borderL}%)`,
    color: `hsl(217, ${s}%, ${textL}%)`,
    background: `hsl(217, ${s}%, ${bgL}%)`
  };
}
function getRecents() {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]');
  } catch {
    return [];
  }
}
function pushRecent(id) {
  const recents = getRecents().filter(r => r !== id);
  recents.unshift(id);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, MAX_RECENTS)));
  renderRecents();
}
function deleteRecent(id) {
  const recents = getRecents().filter(r => r !== id);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  renderRecents();
}
function renderRecents() {
  const $section = jQuery('#recents-section');
  const $list = jQuery('#recents-list');
  const recents = getRecents().filter(id => registry[id]);
  $list.empty();
  if (recents.length === 0) {
    $section.hide();
    return;
  }
  $section.show();
  const currentId = location.hash.slice(1);
  recents.forEach(id => {
    const entry = registry[id];
    const $li = jQuery('<li class="recent-item">').appendTo($list);
    jQuery('<a>').attr('href', `#${id}`).text(entry.label).toggleClass('active', id === currentId).appendTo($li);
    jQuery('<button class="btn-remove-recent" title="Remove">×</button>').on('click', e => {
      e.preventDefault();
      deleteRecent(id);
    }).appendTo($li);
  });
}
function buildNav(filter) {
  const $nav = jQuery('#groups-nav');
  $nav.empty();
  const lc = filter.toLowerCase();
  const currentId = location.hash.slice(1);
  widgetGroups.forEach(group => {
    const matching = group.ids.filter(id => {
      if (!registry[id]) return false;
      if (!lc) return true;
      return registry[id].label.toLowerCase().includes(lc) || id.toLowerCase().includes(lc);
    });
    if (matching.length === 0) return;
    const $details = jQuery('<details>').attr('open', '').appendTo($nav);
    jQuery('<summary class="group-summary">').text(group.label).appendTo($details);
    const $ul = jQuery('<ul class="group-list">').appendTo($details);
    matching.forEach(id => {
      const $li = jQuery('<li>').appendTo($ul);
      jQuery('<a>').attr('href', `#${id}`).text(registry[id].label).toggleClass('active', id === currentId).appendTo($li);
      jQuery('<button class="btn-pin" title="Pin">').text('◈').toggleClass('pinned', isPinned(id)).on('click', e => {
        e.preventDefault();
        togglePin(id);
      }).appendTo($li);
    });
  });
}
function setActiveLink(id) {
  jQuery('#groups-nav a, #recents-list a, #pinned-list a').removeClass('active');
  jQuery(`#groups-nav a[href="#${CSS.escape(id)}"], #recents-list a[href="#${CSS.escape(id)}"], #pinned-list a[href="#${CSS.escape(id)}"]`).addClass('active');
}
const $header = jQuery('#header');
const $container = jQuery('#container');
function getWidgetName(id) {
  return registry[id].label.replace(/\s/g, '');
}
function renderDemoLinks(id) {
  const widgetName = getWidgetName(id);
  const demos = demosMap[widgetName] ?? [];
  if (demos.length === 0) return;
  const $section = jQuery('<div class="demo-list">').appendTo($container);
  jQuery('<div class="demo-list-caption">').text('Official Demos').appendTo($section);
  const $chips = jQuery('<div class="demo-chips">').appendTo($section);
  demos.forEach(({
    title,
    name
  }) => {
    const colors = getDemoChipColors(widgetName, name);
    jQuery('<a class="demo-chip">').attr('href', `#demo/${widgetName}/${name}`).text(title).css({
      borderColor: colors.borderColor,
      color: colors.color,
      background: colors.background
    }).appendTo($chips);
  });
}
function loadWidget(id) {
  const entry = registry[id];
  if (!entry) return;
  setActiveLink(id);
  $header.text(entry.label);
  $container.empty();
  const $el = jQuery('<div>').appendTo($container);
  entry.init($el);
  renderDemoLinks(id);
  pushRecent(id);
  setActiveLink(id);
}
function loadDemo(widget, name) {
  const entry = demosMap[widget]?.find(d => d.name === name);
  const title = entry?.title ?? name;
  $header.empty();
  jQuery('<a class="demo-back">').attr('href', `#${findWidgetId(widget) ?? ''}`).text(`← ${widget}`).appendTo($header);
  jQuery('<span class="demo-header-title">').text(`\u00a0\u00a0${title}`).appendTo($header);
  jQuery('<button class="btn-pin-demo-header" title="Pin demo">').text('◈').toggleClass('pinned', isDemoPinned(widget, name)).on('click', function () {
    toggleDemoPin(widget, name, title);
    jQuery(this).toggleClass('pinned', isDemoPinned(widget, name));
  }).appendTo($header);
  $container.empty();
  jQuery('<iframe>').attr('src', `demos/${widget}/${name}/`).css({
    width: '100%',
    border: 'none',
    display: 'block',
    flex: '1'
  }).appendTo($container);
  pushRecentDemo(widget, name);
  renderPinned();
}
function findWidgetId(widgetName) {
  return Object.keys(registry).find(id => registry[id].label.replace(/\s/g, '') === widgetName);
}
jQuery('#search').on('input', function () {
  buildNav(this.value);
});
window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  if (hash.startsWith('demo/')) {
    const parts = hash.split('/');
    loadDemo(parts[1], parts[2]);
  } else {
    loadWidget(hash);
  }
});
setupThemeSelector('theme-selector').then(() => {
  buildNav('');
  renderPinned();
  renderRecents();
  const hash = location.hash.slice(1);
  if (hash.startsWith('demo/')) {
    const parts = hash.split('/');
    loadDemo(parts[1], parts[2]);
    return;
  }
  if (hash && registry[hash]) {
    loadWidget(hash);
  } else {
    const lastRecent = getRecents()[0];
    const target = lastRecent ?? widgetGroups[0].ids[0];
    location.hash = target;
  }
});
