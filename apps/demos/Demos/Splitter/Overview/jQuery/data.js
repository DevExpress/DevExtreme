const paneData = [
    {
      resizable: true,
      minSize: "60px",
      size:"140px",
      template: function (data) {
        return $.fn.paneContentTemplate(data, 'Left Panel');
      }
    },
    {
      minSize: "20%",
      splitter: {
        orientation: "vertical",
        items: [
          {
            resizable: true,
            collapsible: true,
            maxSize: "75%",
            template: function (data) {
                return $.fn.paneContentTemplate(data, 'Central Panel');
            }
          },
          {
            collapsible: true,
            splitter: {
              orientation: "horizontal",
              items: [
                {
                  resizable: true,
                  collapsible: true,
                  size: "30%",
                  minSize: "5%",
                  template: function (data) {
                    return $.fn.paneContentTemplate(data, 'Nested Left Panel');
                  }
                },
                {
                  collapsible: true,
                  template: function (data) {
                    return $.fn.paneContentTemplate(data, 'Nested Central Panel');
                  }
                },
                {
                  resizable: true,
                  collapsible: true,
                  size: "30%",
                  minSize: "5%",
                  template: function (data) {
                    return $.fn.paneContentTemplate(data, 'Nested Right Panel');
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
      template: function (data) {
        return $.fn.paneContentTemplate(data, 'Right Panel');
      }
    }
  ];