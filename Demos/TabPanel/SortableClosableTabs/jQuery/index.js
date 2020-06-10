$(function () {
  var tabPanel = $("#tabPanel").dxTabPanel({
    dataSource: employees.slice(0, 3),
    itemTitleTemplate: titleTemplate,
    itemTemplate: itemTemplate,
    height: 472,
    deferRendering: false,
    showNavButtons: true,
    repaintChangesOnly: true,
    animationEnabled: true,
    swipeEnabled: true
  }).dxTabPanel("instance");

  $("#tabPanel").dxSortable({
    moveItemOnDrop: true,
    filter: ".dx-tab",
    itemOrientation: "horizontal",
    onReorder: function(e) {
      var tabPanelItems = tabPanel.option("dataSource");
      var itemData = tabPanelItems.splice(e.fromIndex, 1)[0];

      tabPanelItems.splice(e.toIndex, 0, itemData);
      tabPanel.option("dataSource", tabPanelItems);
      tabPanel.option("selectedIndex", e.toIndex);
    }
  });

  var addTabButton = $("#addButton").dxButton({
    icon: "add",
    text: "Add Tab",
    type: "default",
    onClick: addButtonHandler
  }).dxButton("instance");

  var removeTabButton = $("#removeButton").dxButton({
    icon: "trash",
    text: "Remove Tab",
    type: "danger",
    stylingMode: "outlined",
    onClick: function() {
      closeButtonHandler(tabPanel.option("selectedItem"));
    }
  }).dxButton("instance");

  function titleTemplate(itemData, itemIndex, itemElement) {
    itemElement
      .append($("<span>").text(itemData.FirstName + " " + itemData.LastName))
      .append(' ')
      .append(
        $("<i>")
          .addClass("dx-icon")
          .addClass("dx-icon-close")
          .click(function () { closeButtonHandler(itemData); })
      );
  }

  function itemTemplate(itemData, itemIndex, itemElement) {
    $("<div>")
      .addClass("employeeInfo")
      .append($('<img class="employeePhoto" src="' + itemData.Picture + '"/>'))
      .append($("<p>").addClass("employeeNotes").append($("<b>Position: " + itemData.Position + "</b><br/>")).append(itemData.Notes))
      .appendTo(itemElement);

    $("<div>")
      .addClass("caption")
      .text(itemData.FirstName + " " + itemData.LastName + "'s Tasks:")
      .appendTo(itemElement);

    $("<div>")
      .dxDataGrid({
        columnAutoWidth: true,
        showBorders: false,
        rowAlternationEnabled: true,
        showColumnLines: false,
        columns: ["Subject", {
          dataField: "StartDate",
          dataType: "date"
        }, {
          dataField: "DueDate",
          dataType: "date"
        }, "Priority", {
          caption: "Completed",
          dataType: "boolean",
          calculateCellValue: function(rowData) {
            return rowData.Status == "Completed";
          }
        }],
        dataSource: new DevExpress.data.DataSource({
          store: new DevExpress.data.ArrayStore({
            key: "ID",
            data: tasks
          }),
          filter: ["EmployeeID", "=", itemData.ID]
        })
      })
      .appendTo(itemElement);
  }

  function addButtonHandler() {
    var tabPanelItems = tabPanel.option("dataSource");
    var newItem = employees.filter(function(employee) { return tabPanelItems.indexOf(employee) === -1; })[0];

    tabPanelItems.push(newItem);
    tabPanel.option("dataSource", tabPanelItems);
    tabPanel.option("selectedItem", newItem);

    updateButtonsAppearance(tabPanelItems);
  }

  function closeButtonHandler(itemData) {
    if(!itemData) return;

    var index = tabPanel.option("dataSource").indexOf(itemData);
    var tabPanelItems = tabPanel.option("dataSource");
    tabPanelItems.splice(index, 1);

    tabPanel.option("dataSource", tabPanelItems);
    if(index >= tabPanelItems.length && index > 0) tabPanel.option("selectedIndex", index - 1);

    updateButtonsAppearance(tabPanelItems);
  }

  function updateButtonsAppearance(items) {
    addTabButton.option("disabled", items.length === employees.length);
    removeTabButton.option("disabled", items.length === 0);
  }
});