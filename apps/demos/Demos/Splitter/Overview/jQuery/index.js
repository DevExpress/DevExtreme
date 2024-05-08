$(() => {
  const createElementWithClass = function (text, className) {
    return $('<div>').text(text).addClass(className);
  };

  const getStateText = function (data) {
    if (data.resizable !== false && !data.collapsible) {
      return 'Resizable only';
    }
    const resizableText = data.resizable ? 'Resizable' : 'Non-resizable';
    const collapsibleText = data.collapsible ? 'collapsible' : 'non-collapsible';

    return `${resizableText} and ${collapsibleText}`;
  };

  const paneContentTemplate = function (data, element, paneName) {
    $(element).attr({ tabIndex: 0 });

    const $content = createElementWithClass('', 'pane-content');

    $content.append(createElementWithClass(paneName, 'pane-title'));

    $content.append(createElementWithClass(getStateText(data), 'pane-state'));

    const dimensionOptions = new Set(['size', 'minSize', 'maxSize', 'collapsedSize']);

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
        template(data, index, element) {
          return paneContentTemplate(data, element, 'Left Pane');
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
              collapsedSize: '8%',
              template(data, index, element) {
                return paneContentTemplate(data, element, 'Central Pane');
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
                    template(data, index, element) {
                      return paneContentTemplate(data, element, 'Nested Left Pane');
                    },
                  },
                  {
                    collapsible: false,
                    template(data, index, element) {
                      return paneContentTemplate(data, element, 'Nested Central Pane');
                    },
                  },
                  {
                    resizable: true,
                    collapsible: true,
                    size: '30%',
                    minSize: '5%',
                    template(data, index, element) {
                      return paneContentTemplate(data, element, 'Nested Right Pane');
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
        template(data, index, element) {
          return paneContentTemplate(data, element, 'Right Pane');
        },
      },
    ],
  });
});
