$(() => {
  const popup = $('#popup').dxPopup({
    width: 350,
    height: 190,
    visible: false,
    dragEnabled: false,
    hideOnOutsideClick: true,
    showCloseButton: false,
    showTitle: false,
    position: {
      at: 'center',
      my: 'center',
      collision: 'fit',
    },
  }).dxPopup('instance');

  const createVehicleCard = (card) => {
    const cardEl = $('<div>').addClass('vehicle__card');

    const imageWrapper = createVehicleImg(card.data);
    const vehicleInfo = createVehicleInfo(card);

    cardEl.append(imageWrapper);
    cardEl.append(vehicleInfo);

    return cardEl;
  };

  const createVehicleImg = (vehicle) => {
    const imageWrapper = $('<div>').addClass('vehicle__img-wrapper');
    const img = $('<img>').addClass('vehicle__img');
    img.attr({
      src: `../../../../images/vehicles/image_${vehicle.ID}.png`,
      alt: `${vehicle.TrademarkName} ${vehicle.Name}`,
    });

    imageWrapper.append(img);

    return imageWrapper;
  };

  const createVehicleInfo = (card) => {
    const vehicleInfo = $('<div>').addClass('vehicle__info');

    const trademarkColumn = card.columns.find(col => col.name === 'TrademarkName');
    const modelColumn = card.columns.find(col => col.name === 'Name');
    const name = `${card.data[trademarkColumn.name]} ${card.data[modelColumn.name]}`;
    const vehicleName = $('<div>').addClass('vehicle__name').text(name).attr('title', name);

    const priceColumn = card.columns.find(col => col.name === 'Price');
    const priceInfo = $('<div>').addClass('vehicle__price').text(`$${card.data[priceColumn.name]}`);

    const typeColumn = card.columns.find(col => col.name === 'CategoryName');
    const typeContainer = $('<div>').addClass('vehicle__type-container');
    const typeInfo = $('<div>').addClass('vehicle__type').text(`${card.data[typeColumn.name]}`);
    typeContainer.append(typeInfo);

    const modificationColumn = card.columns.find(col => col.name === 'Modification');
    const bodyStyleNameColumn = card.columns.find(col => col.name === 'BodyStyleName');
    const horsepowerColumn = card.columns.find(col => col.name === 'Horsepower');

    const specContainer = $('<div>').addClass('vehicle__spec-container');
    const modificationInfo = $('<div>').addClass('vehicle__modification').text(`${card.data[modificationColumn.name]}`);
    const bodyInfo = $('<div>').addClass('vehicle__modification')
      .text(`${card.data[bodyStyleNameColumn.name]} ${card.data[horsepowerColumn.name]} h.p.`);
    specContainer.append(modificationInfo);
    specContainer.append(bodyInfo);

    const popupContentTemplate = function () {
      const sourceLink = `http://${card.data.Source}`;
      return $('<div>').append(
        $(`<p><b>Image licensed under:</b> <span>${card.data['License Name']}</span></p>`),
        $(`<p><b>Author:</b> <span>${card.data.Author}</span></p>`),
        $(`<p><b>Source link:</b> <a href='${sourceLink}' class='license__link'>${sourceLink}</a></p>`),
        $(`<p><b>Edits:</b> <span>${card.data.Edits}</span></p>`),
      );
    };

    const footerContainer = $('<div>').addClass('vehicle__footer-container');
    const footerButton = $('<div>').dxButton({
      text: 'Image Info',
      type: 'default',
      width: '100%',
      onClick() {
        popup.option({
          contentTemplate: () => popupContentTemplate(),
        });
        popup.show();
      },
    });
    footerContainer.append(footerButton);

    vehicleInfo.append(vehicleName);
    vehicleInfo.append(priceInfo);
    vehicleInfo.append(typeContainer);
    vehicleInfo.append(specContainer);
    vehicleInfo.append(footerContainer);

    return vehicleInfo;
  };

  $(function () {
    $("#card-view").dxCardView({
      dataSource: vehicles,
      cardsPerRow: 'auto',
      cardMinWidth: 260,
      cardMaxWidth: 260,
      paging: {
        pageSize: 12,
      },
      columns: [
        "TrademarkName",
        "Name",
        {
          dataField: "Price",
          format: 'currency',
        },
        "CategoryName",

        "Modification",
        "BodyStyleName",
        "Horsepower",
      ],
      headerFilter: {
        visible: true,
      },
      searchPanel: {
        visible: true,
      },
      cardTemplate: (info) => {
        return createVehicleCard(info.card);
      },
    });
  });
});