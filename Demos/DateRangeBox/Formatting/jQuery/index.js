$(() => {
  const msInDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const startDate = new Date(now.getTime() - msInDay * 3);
  const endDate = new Date(now.getTime() + msInDay * 3);

  $('#default').dxDateRangeBox(getDateRangeBoxProps({
    startDatePlaceholder: '12/31/2018',
    endDatePlaceholder: '12/31/2018',
  }));

  $('#constant').dxDateRangeBox(getDateRangeBoxProps({
    displayFormat: 'shortdate',
    startDate,
    endDate,
  }));

  $('#pattern').dxDateRangeBox(getDateRangeBoxProps({
    displayFormat: 'EEEE, d of MMM, yyyy',
    startDate,
    endDate,
  }));

  $('#escape').dxDateRangeBox(getDateRangeBoxProps({
    displayFormat: "'Year': yyyy, 'Month': MMM, 'Day': d",
    startDate,
    endDate,
  }));

  function getDateRangeBoxProps(props) {
    return {
      showClearButton: true,
      useMaskBehavior: true,
      openOnFieldClick: false,
      ...props,
    };
  }
});
