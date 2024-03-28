$(() => {
  const createElementWithClass = function (text, className) {
    return $('<div>').text(text).addClass(className);
  };

  const getStateText = function (data) {
    if (data.resizable !== false && !data.collapsible) {
      return 'Resizable only';
    }

    return `${data.resizable ? 'Resizable' : 'Non-resizable'} and ${data.collapsible ? 'collapsible' : 'non-collapsible'}`;
  };

  const paneContentTemplate = function (data, paneName) {
    const $content = createElementWithClass('', 'pane-content');

    $content.append(createElementWithClass(paneName, 'pane-title'));

    $content.append(createElementWithClass(getStateText(data), 'pane-state'));

    const dimensionOptions = new Set(['size', 'minSize', 'maxSize']);

    Object.entries(data)
      .filter(([key]) => dimensionOptions.has(key))
      .forEach(([key, value]) => {
        $content.append(createElementWithClass(`${key}: ${value}`, 'pane-option'));
      });

    return $content;
  };

  $('#splitter').dxSplitter({
    items: [
      {
        resizable: true,
        size: '140px',
        minSize: '70px',
        template(data) {
          return paneContentTemplate(data, 'Left Pane');
        },
      },
      {
        splitter: {
          orientation: 'vertical',
          items: [
            {
              resizable: true,
              collapsible: true,
              maxSize: '75%',
              template(data) {
                return paneContentTemplate(data, 'Central Pane');
              },
            },
            {
              collapsible: true,
              splitter: {
                orientation: 'horizontal',
                items: [
                  {
                    resizable: true,
                    collapsible: true,
                    size: '30%',
                    minSize: '5%',
                    template(data) {
                      return paneContentTemplate(data, 'Nested Left Pane');
                    },
                  },
                  {
                    collapsible: false,
                    template(data) {
                      return paneContentTemplate(data, 'Nested Central Pane');
                    },
                  },
                  {
                    resizable: true,
                    collapsible: true,
                    size: '30%',
                    minSize: '5%',
                    template(data) {
                      return paneContentTemplate(data, 'Nested Right Pane');
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        size: '140px',
        resizable: false,
        collapsible: false,
        template(data) {
          return paneContentTemplate(data, 'Right Pane');
        },
      },
    ],
  });
});
