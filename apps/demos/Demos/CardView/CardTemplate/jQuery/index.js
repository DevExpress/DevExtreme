$(() => {
  const popup = $('#popup').dxPopup({
    width: 350,
    height: 240,
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
      Price,
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

    const priceInfo = $('<div>').addClass('vehicle__price').text(`$${Price}`);

    const typeContainer = $('<div>').addClass('vehicle__type-container');
    const typeInfo = $('<div>').addClass('vehicle__type').text(`${CategoryName}`);
    typeContainer.append(typeInfo);

    const specContainer = $('<div>').addClass('vehicle__spec-container');
    const modificationInfo = $('<div>').addClass('vehicle__modification').text(`${Modification}`);
    const bodyInfo = $('<div>').addClass('vehicle__modification').text(`${BodyStyleName}`);
    const horsepowerInfo = $('<div>').addClass('vehicle__modification').text(` ${Horsepower} h.p.`);
    specContainer.append(modificationInfo);
    specContainer.append(bodyInfo);
    specContainer.append(horsepowerInfo);

    const popupContentTemplate = function () {
      const sourceLink = `https://${Source}`;
      return $('<div>').append(
        $(`<p><b>Image licensed under:</b> <span>${LicenseName}</span></p>`),
        $(`<p><b>Author:</b> <span>${Author}</span></p>`),
        $(`<p><b>Source link:</b> <a href='${sourceLink}'>${sourceLink}</a></p>`),
        $(`<p><b>Edits:</b> <span>${Edits}</span></p>`),
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
      paging: {
        pageSize: 12,
      },
      columns: [
        "TrademarkName",
        "Name",
        {
          dataField: "Price",
          format: 'currency',
          headerFilter: {
            groupInterval: 20000,
          }
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
