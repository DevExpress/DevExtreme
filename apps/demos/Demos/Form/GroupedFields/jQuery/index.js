$(() => {

  function groupCaptionTemplate($icon){
    return (data) => {
      return $(`<i class='dx-icon dx-icon-${$icon}'></i><span>${data.caption}</span>`);
    }
  }

  $('#form').dxForm({
    formData: employees,
    colCount: 2,
    items: [{
      itemType: 'group',
      captionTemplate: groupCaptionTemplate('info'),
      caption: 'System Information',
      items: ['ID', {
        itemType: 'group',
        captionTemplate: groupCaptionTemplate('user'),
        caption: 'Main Information',
        items: ['FirstName', 'LastName', 'HireDate', 'Position', 'OfficeNo'],
      }],
    }, {
      itemType: 'group',
      captionTemplate: groupCaptionTemplate('card'),
      caption: 'Personal Data',
      items: ['BirthDate', {
        itemType: 'group',
        captionTemplate: groupCaptionTemplate('home'),
        caption: 'Home Address',
        items: ['Address', 'City', 'State', 'Zipcode'],
      }],
    }, {
      itemType: 'group',
      captionTemplate: groupCaptionTemplate('tel'),
      caption: 'Contact Information',

      items: [{
        itemType: 'tabbed',
        tabPanelOptions: {
          deferRendering: false,
        },
        tabs: [{
          title: 'Phone',
          items: ['Phone'],
        }, {
          title: 'Skype',
          items: ['Skype'],
        }, {
          title: 'Email',
          items: ['Email'],
        }],
      }],
    }],
  });
});
