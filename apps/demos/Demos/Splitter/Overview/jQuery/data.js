
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