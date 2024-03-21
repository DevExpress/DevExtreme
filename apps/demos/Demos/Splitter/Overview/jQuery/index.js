$(() => {
  const renderPaneContent = ({ data, name, element }) => {
    const $fullText = $("<div>").addClass("contentParent");
    const $item = $("<div>").text(name).addClass("paneClass");
    const $state = $("<div>").addClass("stateClass").text(
      `${data.resizable ? "Resizable " : "Non-Resizable "}${
        data.resizable && data.collapsible ? " and " : " and "
      }${data.collapsible ? "Collapsible" : "Non-Collapsible"}`
    );

    $fullText.append($item, $state);

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "template" && key !== "resizable" && key !== "collapsible") {
        const $config = $("<div>").text(`${key}: ${value}`).addClass("optionClass");
        $fullText.append($config);
      }
    });
    element.append($fullText);
  };

  const paneData = [
    {
      name: "Left Pane",
      data: {
        resizable: true,
        collapsible: false,
        minSize: "60px",
        size: "140px"
      }
    },
    {
      nestedSplitter: {
        orientation: "vertical",
        items: [
          {
            name: "Central Pane",
            resizable: true,
            collapsible: true,
            maxSize: "75%",
          },
          {
            nestedSplitter: {
              orientation: "horizontal",
              items: [
                {
                  name: "Nested Left Panel",
                  resizable: true,
                  collapsible: true,
                  size: "30%",
                  minSize: "5%",
                },
                {
                  name: "Nested Central Panel",
                  resizable: false,
                  collapsible: true,
                },
                {
                  name: "Nested Right Panel",
                  resizable: true,
                  collapsible: true,
                  size: "30%",
                  minSize: "5%",
                }
              ]
            }
          }
        ]
      }
    },
    {
      name: "Right Pane",
      data: {
        size: "140px",
        resizable: false,
        collapsible: false
      }
    }
  ];

  
  const createSplitterItem = ({ name, nestedSplitter, ...data }) => {
    let item = data ;
    if (nestedSplitter) {
      const items = nestedSplitter.items.map(subItem => createSplitterItem(subItem));
      item.splitter = {
        orientation: nestedSplitter.orientation,
        items: items
      };
      return item
    } else {
      if(Object.keys({...data.data}).length>0){
        item = {...data.data};
      }
      item.template = (data, index, element) => renderPaneContent({ data, name, element });
    }
    return item;
  };


  const createSplitterItems = (paneData) => {
    return paneData.map(({ name, data, nestedSplitter }) => {
      if (nestedSplitter) {
        const items = nestedSplitter.items.map(subItem => createSplitterItem(subItem));
        return { name, splitter: { orientation: nestedSplitter.orientation, items } };
      } else {
        return createSplitterItem({ name, data });
      }
    });
  };

  const items = createSplitterItems(paneData);
console.log(items);
  const split2 = $("#splitter").dxSplitter({
    height: "100%",
    width: "100%",
    items: items
  }).dxSplitter("instance");
});
