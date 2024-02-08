$(() => {
  $('#scrollview-content').html(longText);

  function updateContent(args, eventName) {
    setTimeout(() => {
      $(`<br /><div>Content has been updated on the ${eventName} event.</div><br />`)[eventName === 'PullDown' ? 'prependTo' : 'appendTo']('#scrollview-content');
      args.component.release();
    }, 500);
  }

  function updateBottomContent(e) {
    updateContent(e, 'ReachBottom');
  }

  function updateTopContent(e) {
    updateContent(e, 'PullDown');
  }

  const scrollViewWidget = $('#scrollview').dxScrollView({
    scrollByContent: true,
    scrollByThumb: true,
    showScrollbar: 'onScroll',
    onReachBottom: updateBottomContent,
    reachBottomText: 'Updating...',
  }).dxScrollView('instance');

  const showScrollbarModes = [{
    text: 'On Scroll',
    value: 'onScroll',
  }, {
    text: 'On Hover',
    value: 'onHover',
  }, {
    text: 'Always',
    value: 'always',
  }, {
    text: 'Never',
    value: 'never',
  }];

  $('#show-scrollbar-mode').dxSelectBox({
    items: showScrollbarModes,
    value: showScrollbarModes[0].value,
    inputAttr: { 'aria-label': 'Show Scrollbar Mode' },
    valueExpr: 'value',
    displayExpr: 'text',
    onValueChanged(data) {
      scrollViewWidget.option('showScrollbar', data.value);
    },
  });

  $('#use-reach-bottom').dxCheckBox({
    value: true,
    text: 'Update content on the ReachBottom event',
    onValueChanged(data) {
      scrollViewWidget.option('onReachBottom', data.value ? updateBottomContent : null);
    },
  });

  $('#use-pull-down-bottom').dxCheckBox({
    value: false,
    text: 'Update content on the PullDown event',
    onValueChanged(data) {
      scrollViewWidget.option('onPullDown', data.value ? updateTopContent : null);
      scrollViewWidget.option('bounceEnabled', data.value);
    },
  });

  $('#scroll-by-content').dxCheckBox({
    value: true,
    text: 'Scroll by content',
    onValueChanged(data) {
      scrollViewWidget.option('scrollByContent', data.value);
    },
  });

  $('#scroll-by-thumb').dxCheckBox({
    value: true,
    text: 'Scroll by thumb',
    onValueChanged(data) {
      scrollViewWidget.option('scrollByThumb', data.value);
    },
  });
});
