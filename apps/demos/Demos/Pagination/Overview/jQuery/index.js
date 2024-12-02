$(() => {
  const pagination = $('#pagination')
    .dxPagination({
      showInfo: true,
      lightModeEnabled: false,
      pagesNavigatorVisible: true,
      showNavigationButtons: true,
      allowedPageSizes: [4, 6],
      itemCount: employees.length,
      pageIndex: 1,
      pageSize: 4,
      onOptionChanged: (evt) => {
        if (evt.name === 'pageSize') {
          const pageSize = evt.value;
          const pageIndex = pagination.option('pageIndex');
          pagination.option('pageSize', pageSize);

          renderEmployeeGallery(pageSize, pageIndex);
        }

        if (evt.name === 'pageIndex') {
          const pageSize = pagination.option('pageSize');
          const pageIndex = evt.value;
          pagination.option('pageIndex', pageIndex);

          renderEmployeeGallery(pageSize, pageIndex);
        }
      },
    })
    .dxPagination('instance');
  
    const createEmployeeImg = (employee) => {
      const imageWrapper = $('<div>').addClass('employees__img-wrapper');
    
      const img = $('<img>').addClass('employees__img');
      img.attr({ src: employee.Picture, alt: employee.FullName });
      imageWrapper.append(img);
    
      return imageWrapper;
    };
    
    const createEmployeeInfo = (employee) => {
      const employeeInfo = $('<div>').addClass('employees__info');
    
      const fullNameWrapper = $('<div>').addClass('employees__info-row');
      const fullNameLabel = $('<span>').addClass('employees__info-label').text('Full Name:');
      const fullName = $('<span>').addClass('employees__info-value').text(employee.FullName);
      fullNameWrapper.append(fullNameLabel);
      fullNameWrapper.append(fullName);
    
      const positionWrapper = $('<div>').addClass('employees__info-row');
      const positionLabel = $('<span>').addClass('employees__info-label').text('Position:');
      const position = $('<span>').addClass('employees__info-value').text(employee.Title);
      positionWrapper.append(positionLabel);
      positionWrapper.append(position);
    
      const phoneWrapper = $('<div>').addClass('employees__info-row');
      const phoneLabel = $('<span>').addClass('employees__info-label').text('Phone:');
      const phone = $('<span>').addClass('employees__info-value').text(employee.MobilePhone);
      phoneWrapper.append(phoneLabel);
      phoneWrapper.append(phone);
    
      employeeInfo.append(fullNameWrapper);
      employeeInfo.append(positionWrapper);
      employeeInfo.append(phoneWrapper);
    
      return employeeInfo;
    };
    
    const createEmployeeCard = (employee) => {
      const cardEl = $('<div>').addClass('employees__card');
    
      const imageWrapper = createEmployeeImg(employee);
      const employeeInfo = createEmployeeInfo(employee);
    
      cardEl.append(imageWrapper);
      cardEl.append(employeeInfo);
    
      return cardEl;
    };
    
    const renderEmployeeGallery = (pageSize, pageIndex) => {
      const $employeesContainer = $('#employees');
      $employeesContainer.empty();
    
      if (pageSize === 4) {
        $employeesContainer.removeClass('employees--six');
        $employeesContainer.addClass('employees--forth');
      } else {
        $employeesContainer.removeClass('employees--forth');
        $employeesContainer.addClass('employees--six');
      }
    
      const pageEmployees = employees.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    
      pageEmployees.forEach((employee) => {
        const card = createEmployeeCard(employee);
        $employeesContainer.append(card);
      });
    };    
  
  renderEmployeeGallery(pagination.option('pageSize'), pagination.option('pageIndex'));
});
