$(() => {
  const myfunction = (data, name, element) => {
    const $fullText = $("<div>").text("");
    $fullText.addClass("contentParent");
    const $item = $("<div>").text(name);
    $item.addClass("paneClass");
    $fullText.append($item);
    const $state = $("<div>").text(
      `${data.resizable ? "Resizable " : "Non-Resizable"}${
        data.resizable && data.collapsible ? " and " : " and "
      }${data.collapsible ? " Collapsible" : "Non-Collapsible"}`
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
          collapsible: false,
          minSize: "60px",
          size:"140px",
          template: function (data, index, element) {
            myfunction(data, "Left Panel", element);
          }
        },
        {
          splitter: {
            orientation: "vertical",
            items: [
              {
                resizable: true,
                collapsible: true,
                maxSize: "75px",
                template: function (data, index, element) {
                  myfunction(data, "Central Panel", element);
                }
              },
              {
                collapsible: true,
                splitter: {
                  orientation: "horizontal",
                  items: [
                    {
                      resizable: true,
                      size: "30%",
                      minSize: "5%",
                      template: function (data, index, element) {
                        myfunction(data, "Nested Left Panel", element);
                      }
                    },
                    {
                      resizable: false,
                      collapsible: true,
                      template: function (data, index, element) {
                        myfunction(data, "Nested Central Panel", element);
                      }
                    },
                    {
                      resizable: true,
                      collapsible: true,
                      size: "30%",
                      minSize: "5%",
                      template: function (data, index, element) {
                        myfunction(data, "Nested Right Panel", element);
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          size:"140px",
          resizable: false,
          collapsible: false,
          template: function (data, index, element) {
            myfunction(data, "Right Panel", element);
          }
        }
      ]
    })
    .dxSplitter("instance");
});
