$(() => {
  const arabicColumns = [
    {
      dataField: "nameAr",
      caption: "الدولة",
    },
    {
      dataField: "capitalAr",
      caption: "عاصمة",
    },
    {
      dataField: "population",
      format: {
        type: "fixedPoint",
        precision: 0,
      },
      caption: "عدد السكان (نسمة) 2013",
    },
    {
      dataField: "area",
      caption: "منطقة",
    },
    {
      dataField: "accession",
      visible: false,
    },
  ];

  const englishColumns = [
    {
      dataField: "nameEn",
      caption: "Name",
    },
    {
      dataField: "capitalEn",
      caption: "Capital",
    },
    {
      dataField: "population",
      format: {
        type: "fixedPoint",
        precision: 0,
      },
    },
    {
      dataField: "area",
    },
    {
      dataField: "accession",
      visible: false,
    },
  ];

  const cardView = $("#cardViewContainer")
    .dxCardView({
      dataSource: europeanUnion,
      keyExpr: "nameEn",
      cardsPerRow: 3,
      columns: englishColumns,
    })
    .dxCardView("instance");

  const languages = ["Arabic (Right-to-Left direction)", "English (Left-to-Right direction)"];

  $("#select-language").dxSelectBox({
    items: languages,
    value: languages[1],
    inputAttr: { "aria-label": "Language" },
    width: 250,
    onValueChanged(data) {
      const isRTL = data.value === languages[0];
      cardView.option("rtlEnabled", isRTL);
      cardView.option("columns", isRTL ? arabicColumns : englishColumns);
    },
  });
});
