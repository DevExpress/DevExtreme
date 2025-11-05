$(() => {
  const dataSource = [];

  vehicles.forEach((item) => {
    if (!dataSource.some((t) => t.ID === item.TrademarkID)) {
      dataSource.push({
        TLID: item.TrademarkID,
        Manufacturer: item.TrademarkName,
        Name: '',
        Price: '',
        CategoryName: '',
        BodyStyleName: '',
        ParentID: 0,
      });
    }

    dataSource.push({
      ...item,
      TLID: item.ID + 10000,
      ParentID: item.TrademarkID,
    });
  });

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

  const createTrademarkTemplate = (vehicle) => {
    const {
      ID,
      Name,
      TrademarkName,
      LicenseName,
      Author,
      Source,
      Edits,
      Manufacturer,
    } = vehicle;

    if (Manufacturer) {
      return $('<div>').text(Manufacturer);
    }

    if (!ID || !TrademarkName || !Name) {
      return $('<div>').text('');
    }

    const trademarkWrapper = $('<div>').addClass('trademark__wrapper');
    const imgWrapper = $('<div>').addClass('trademark__img-wrapper');
    const img = $('<img>').addClass('trademark__img');
    img.attr({
      src: `../../../../images/vehicles/image_${ID}.png`,
      alt: `${TrademarkName} ${Name}`,
    });

    const popoverId = `popover-${ID}`;
    const popoverWrapper = $('<div>');
    
    const licenseTitle = $('<div>')
      .addClass('license-info__title')
      .text('License Information');
    
    const licenseContent = $('<div>')
      .addClass('license-info__content');
    
    const imageParagraph = $('<p>')
      .append($('<strong>').text('Image: '))
      .append(`${TrademarkName} ${Name}`);
    
    const licenseParagraph = $('<p>')
      .append($('<strong>').text('Image licensed under: '))
      .append(LicenseName);
    
    const authorParagraph = $('<p>')
      .append($('<strong>').text('Author: '))
      .append(Author);
    
    const sourceLink = `https://${Source}`;
    const sourceParagraph = $('<p>')
      .append($('<strong>').text('Source link: '))
      .append(
        $('<a>', {
          href: sourceLink,
          target: '_blank',
        }).text(sourceLink)
      );
    
    const editsParagraph = $('<p>')
      .append($('<strong>').text('Edits: '))
      .append(Edits);
    
    licenseContent.append(imageParagraph, licenseParagraph, authorParagraph, sourceParagraph, editsParagraph);
    popoverWrapper.append(licenseTitle, licenseContent);

    img.attr('data-popover-target', popoverId);

    const popover = $('<div>').attr('id', popoverId).dxPopover({
      target: `[data-popover-target="${popoverId}"]`,
      showEvent: 'mouseenter',
      hideEvent: 'mouseleave',
      position: 'top',
      contentTemplate: () => popoverWrapper,
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

  const createCategoryTemplate = ({ CategoryName }) => {
    if (!CategoryName) {
      return $('<div>').text('');
    }

    return $('<div>').addClass('category__wrapper').text(CategoryName);
  };

  $('#gridContainer').dxTreeList({
    dataSource,
    keyExpr: 'TLID',
    parentIdExpr: 'ParentID',
    expandedRowKeys: [1, 3],
    aiIntegration,
    grouping: {
      contextMenuEnabled: false
    },
    groupPanel: {
      visible: false
    },
    columns: [
      {
        caption: 'Trademark',
        width: 260,
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
        name: 'origin',
        caption: 'Origin Country',
        type: 'ai',
        ai: {
          prompt: 'Identify the country where this vehicle model is originally manufactured or developed, based on its brand, model, and specifications. Respond with the country name and the country flag icon.',
          mode: 'auto',
          showHeaderMenu: true,
        },
        width: 200,
        fixed: true,
        fixedPosition: 'right',
        cellTemplate: ($container) => {
          $container.addClass('ai__cell');
        },
      },
    ],
  });
});
