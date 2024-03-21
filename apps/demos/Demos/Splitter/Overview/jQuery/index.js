$(() => {
  const myfunction = (data, index, element) => {
    const $fullText = $("<div>").text("");
    $fullText.addClass("contentParent");
    const $item = $("<div>").text("Pane " + index);
    $item.addClass("paneClass");
    $fullText.append($item);
    const $state = $("<div>").text(
      `${data.resizable ? "Resizable " : ""}${
        data.resizable && data.collapsible ? "and" : ""
      }${data.collapsible ? " Collapsible" : ""}`
    );

    $state.addClass("stateClass");
    $fullText.append($state);
    for (const [key, value] of Object.entries(data)) {
      const $config = $("<div>").text(`${key}: ${value}`);
      $config.addClass("optionClass");
      if (key != "template" && key != "resizable" && key != "collapsible") {
        $fullText.append($config);
      }
    }
    element.append($fullText);
  };

  let split2 = $("#splitter")
    .dxSplitter({
      height: "100%",
      width: "100%",
      items: [
        {
          resizable: true,
          minSize: "60px",
          size:"140px",
          template: function (data, index, element) {
            myfunction(data, 1, element);
          }
        },
        {
          splitter: {
            orientation: "vertical",
            items: [
              {
                resizable: true,
                collapsible: true,
                minSize: "60px",
                template: function (data, index, element) {
                  myfunction(data, 2, element);
                }
              },
              {
                collapsible: true,
                splitter: {
                  orientation: "horizontal",
                  items: [
                    {
                      resizable: true,
                      size: "33.3%",
                      minSize: "10px",
                      template: function (data, index, element) {
                        myfunction(data, 3, element);
                      }
                    },
                    {
                      resizable: true,
                      collapsible: true,
                      size: "33.3%",
                      minSize: "10px",
                      template: function (data, index, element) {
                        myfunction(data, 4, element);
                      }
                    },
                    {
                      resizable: true,
                      collapsible: true,
                      minSize: "10px",
                      template: function (data, index, element) {
                        myfunction(data, 5, element);
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          minSize: "60px",
          size:"170px",
          resizable: false,
          collapsible: false,
          template: function (data, index, element) {
            myfunction(data, 6, element);
          }
        }
      ]
    })
    .dxSplitter("instance");
});
