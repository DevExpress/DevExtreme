testUtils.postponeUntil(() => testUtils.findElements('td, span').some((x) => (x.innerHTML || '').indexOf('Accessories') !== -1), 200, 20000).then(() => testUtils
  .postponeUntilFound('.dx-pivotgrid'));
