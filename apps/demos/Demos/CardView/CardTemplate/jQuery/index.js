$(() => {
  const popup = $('#popup').dxPopup({
    width: 360,
    height: 260,
    visible: false,
    dragEnabled: false,
    hideOnOutsideClick: true,
    title: 'Image Info',
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
    const {
      ID,
      Name,
      TrademarkName,
    } = vehicle;
    const imageWrapper = $('<div>').addClass('vehicle__img-wrapper');
    const img = $('<img>').addClass('vehicle__img');
    img.attr({
      src: `../../../../images/vehicles/image_${ID}.png`,
      alt: `${TrademarkName} ${Name}`,
    });

    imageWrapper.append(img);

    return imageWrapper;
  };

  const createVehicleInfo = (card) => {
    const {
      TrademarkName,
      Name,
      CategoryName,
      Modification,
      BodyStyleName,
      Horsepower,
      Source,
      LicenseName,
      Author,
      Edits,
    } = card.data;
    const vehicleInfo = $('<div>').addClass('vehicle__info');

    const name = `${TrademarkName} ${Name}`;
    const vehicleName = $('<div>').addClass('vehicle__name').text(name).attr('title', name);

    const priceText = card.fields.find((f) => f.column.dataField === 'Price')?.text;
    const priceInfo = $('<div>').addClass('vehicle__price').text(priceText);

    const typeContainer = $('<div>').addClass('vehicle__type-container');
    const typeInfo = $('<div>').addClass('vehicle__type').text(CategoryName);
    typeContainer.append(typeInfo);

    const specContainer = $('<div>').addClass('vehicle__spec-container');
    const modificationInfo = $('<div>').addClass('vehicle__modification').text(Modification);
    const bodyInfo = $('<div>').addClass('vehicle__modification').text(BodyStyleName);
    const horsepowerInfo = $('<div>').addClass('vehicle__modification').text(`${Horsepower} h.p.`);
    specContainer.append(modificationInfo);
    specContainer.append(bodyInfo);
    specContainer.append(horsepowerInfo);

    const popupContentTemplate = function () {
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
    $('#card-view').dxCardView({
      dataSource: vehicles,
      height: 1120,
      cardsPerRow: 'auto',
      cardMinWidth: 240,
      paging: {
        pageSize: 12,
      },
      columns: [
        {
          dataField: 'TrademarkName',
          caption: 'Trademark',
        },
        {
          dataField: 'Name',
          caption: 'Model',
        },
        {
          dataField: 'Price',
          format: 'currency',
          headerFilter: {
            groupInterval: 20000,
          },
        },
        {
          dataField: 'CategoryName',
          caption: 'Category',
        },
        'Modification',
        {
          dataField: 'BodyStyleName',
          caption: 'Body Style',
        },
        'Horsepower',
      ],
      headerFilter: {
        visible: true,
      },
      searchPanel: {
        visible: true,
      },
      cardTemplate: (info) => createVehicleCard(info.card),
    });
  });
});
