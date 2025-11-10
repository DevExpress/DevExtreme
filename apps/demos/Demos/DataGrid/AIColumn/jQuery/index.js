$(() => {
  const aiService = new AzureOpenAI({
    dangerouslyAllowBrowser: true,
    deployment,
    endpoint,
    apiVersion,
    apiKey,
  });

  async function getAIResponse(messages, signal) {
    const params = {
      messages,
      model: deployment,
      max_tokens: 1000,
      temperature: 0.7,
    };
    const response = await aiService.chat.completions.create(params, { signal });
    const result = response.choices[0].message?.content;

    return result;
  }

  const aiIntegration = new DevExpress.aiIntegration({
    sendRequest({ prompt }) {
      const controller = new AbortController();
      const signal = controller.signal;

      const aiPrompt = [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ];

      const promise = getAIResponse(aiPrompt, signal);

      const result = {
        promise,
        abort: () => {
          controller.abort();
        },
      };

      return result;
    },
  });

  const popoverContentTemplate = function (vehicle) {
    const {
      Source,
      LicenseName,
      Author,
      Edits,
    } = vehicle;
    const sourceLink = `https://${Source}`;
    return $('<div>').append(
      $('<p>')
        .append($('<b>').text('Image licensed under: '))
        .append($('<span>').text(LicenseName)),
      $('<p>')
        .append($('<b>').text('Author: '))
        .append($('<span>').text(Author)),
      $('<p>')
        .append($('<b>').text('Source link: '))
        .append(
          $('<a>', {
            href: sourceLink,
            target: '_blank',
          })
            .text(sourceLink),
        ),
      $('<p>')
        .append($('<b>').text('Edits: '))
        .append($('<span>').text(Edits)),
    );
  };

  const createTrademarkTemplate = (vehicle) => {
    const {
      ID,
      Name,
      TrademarkName,
    } = vehicle;
    const trademarkWrapper = $('<div>').addClass('trademark__wrapper');
    const imgWrapper = $('<div>').addClass('trademark__img-wrapper');
    const img = $('<img>').addClass('trademark__img');
    img.attr({
      src: `../../../../images/vehicles/image_${ID}.png`,
      alt: `${TrademarkName} ${Name}`,
    });

    const popoverId = `popover-${ID}`;
    img.attr('data-popover-target', popoverId);

    const popover = $('<div>').attr('id', popoverId).dxPopover({
      target: `[data-popover-target="${popoverId}"]`,
      showEvent: 'mouseenter',
      hideEvent: {
        name: 'mouseleave',
        delay: 1000,
      },
      position: 'top',
      showTitle: true,
      title: 'License Information',
      contentTemplate: () => popoverContentTemplate(vehicle),
    });

    imgWrapper.append(img, popover);
    trademarkWrapper.append(imgWrapper);

    const textWrapper = $('<div>').addClass('trademark__text-wrapper');
    const trademarkText = $('<div>').addClass('trademark__text trademark__text--title').text(TrademarkName);
    const nameText = $('<div>').addClass('trademark__text trademark__text--subtitle').text(Name);

    textWrapper.append(trademarkText, nameText);
    trademarkWrapper.append(textWrapper);

    return trademarkWrapper;
  };

  const createCategoryTemplate = ({ CategoryName }) => $('<div>').addClass('category__wrapper').text(CategoryName);

  $('#gridContainer').dxDataGrid({
    dataSource: vehicles,
    keyExpr: 'ID',
    paging: {
      pageSize: 10,
    },
    aiIntegration,
    grouping: {
      contextMenuEnabled: false,
    },
    groupPanel: {
      visible: false,
    },
    columns: [
      {
        caption: 'Trademark',
        width: 220,
        cellTemplate: (container, options) => {
          const vehicle = options.data;
          const imageWrapper = createTrademarkTemplate(vehicle);
          container.append(imageWrapper);
        },
      },
      {
        dataField: 'Price',
        format: 'currency',
        width: 100,
      },
      {
        caption: 'Category',
        cellTemplate: (container, options) => {
          const category = options.data;
          const categoryWrapper = createCategoryTemplate(category);
          container.append(categoryWrapper);
        },
        minWidth: 180,
      },
      {
        dataField: 'Modification',
        width: 180,
      },
      {
        dataField: 'Horsepower',
        width: 140,
      },
      {
        dataField: 'BodyStyleName',
        caption: 'Body Style',
        width: 180,
      },
      {
        name: 'AI column',
        caption: 'AI Column',
        type: 'ai',
        ai: {
          prompt: 'Identify the country where this vehicle model is originally manufactured or developed, based on its brand, model, and specifications. Respond with the country name and the country flag icon.',
          mode: 'auto',
        },
        width: 200,
        fixed: true,
        fixedPosition: 'right',
        cssClass: 'ai__cell',
      },
    ],
  });
});
