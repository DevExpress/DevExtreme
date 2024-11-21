testUtils
  .postponeUntilFound('.dx-chat')
  .then(() => testUtils.findElements('.dx-chat').forEach((x) => { x.style.height = '700px'; }));
