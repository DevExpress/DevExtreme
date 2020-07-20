$(function () {
  var tabPanel = $("#tabPanel").dxTabPanel({
    dataSource: employees.slice(0, 3),
    itemTitleTemplate: titleTemplate,
    itemTemplate: itemTemplate,
    height: 410,
    deferRendering: false,
    showNavButtons: true,
    repaintChangesOnly: true
  }).dxTabPanel("instance");

  $("#tabPanel").dxSortable({
    moveItemOnDrop: true,
    filter: ".dx-tab",
    itemOrientation: "horizontal",
    dragDirection: "horizontal",
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

  function titleTemplate(itemData, itemIndex, itemElement) {
    itemElement
      .append($("<span>").text(itemData.FirstName + " " + itemData.LastName));

      if(!itemData.isLast) {
        itemElement
          .append(
            $("<i>")
              .addClass("dx-icon")
              .addClass("dx-icon-close")
              .click(function(e) { closeButtonHandler(itemData); })
          );
      }
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

    var employeeTasks = tasks.filter(function(task) { return task.EmployeeID === itemData.ID });

    $("<div>")
      .addClass("task-list")
      .appendTo(itemElement)
      .dxList({
        dataSource: employeeTasks,
        selectionMode: "multiple",
        showSelectionControls: true,
        disabled: true,
        selectedItems: employeeTasks.filter(function(task) { return task.Status === "Completed" }),
        itemTemplate: function(itemData) { 
          return $("<div>" + itemData.Subject + "</div>");
        }
      });
  }

  function addButtonHandler() {
    var tabPanelItems = tabPanel.option("dataSource");
    var newItem = employees.filter(function(employee) { return tabPanelItems.indexOf(employee) === -1; })[0];

    tabPanelItems.push(newItem);

    updateButtonsState(tabPanelItems);

    tabPanel.option("dataSource", tabPanelItems);
    tabPanel.option("selectedIndex", tabPanelItems.length - 1);
  }

  function closeButtonHandler(itemData) {
    var index = tabPanel.option("dataSource").indexOf(itemData);
    var tabPanelItems = tabPanel.option("dataSource");
    tabPanelItems.splice(index, 1);

    updateButtonsState(tabPanelItems);

    tabPanel.option("dataSource", tabPanelItems);
    if(index >= tabPanelItems.length && index > 0) tabPanel.option("selectedIndex", index - 1);
  }

  function updateButtonsState(items) {
    addTabButton.option("disabled", items.length === employees.length);
    items[0].isLast = items.length === 1;
  }
});