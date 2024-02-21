$(() => {
  const options = {
    startScaleValue: 0,
    endScaleValue: 35,
    tooltip: {
      customizeTooltip(arg) {
        return {
          text: `Current t&#176: ${arg.value}&#176C<br>Average t&#176: ${arg.target}&#176C`,
        };
      },
    },
  };

  const junFirst = $.extend({ value: 23, target: 20, color: '#ebdd8f' }, options);
  const julFirst = $.extend({ value: 27, target: 24, color: '#e8c267' }, options);
  const augFirst = $.extend({ value: 20, target: 26, color: '#e55253' }, options);

  const junSecond = $.extend({ value: 24, target: 22, color: '#ebdd8f' }, options);
  const julSecond = $.extend({ value: 28, target: 24, color: '#e8c267' }, options);
  const augSecond = $.extend({ value: 30, target: 24, color: '#e55253' }, options);

  const junThird = $.extend({ value: 35, target: 24, color: '#ebdd8f' }, options);
  const julThird = $.extend({ value: 24, target: 26, color: '#e8c267' }, options);
  const augThird = $.extend({ value: 28, target: 22, color: '#e55253' }, options);

  const junFourth = $.extend({ value: 29, target: 25, color: '#ebdd8f' }, options);
  const julFourth = $.extend({ value: 24, target: 27, color: '#e8c267' }, options);
  const augFourth = $.extend({ value: 21, target: 21, color: '#e55253' }, options);

  $('.june-1').dxBullet(junFirst);
  $('.july-1').dxBullet(julFirst);
  $('.august-1').dxBullet(augFirst);

  $('.june-2').dxBullet(junSecond);
  $('.july-2').dxBullet(julSecond);
  $('.august-2').dxBullet(augSecond);

  $('.june-3').dxBullet(junThird);
  $('.july-3').dxBullet(julThird);
  $('.august-3').dxBullet(augThird);

  $('.june-4').dxBullet(junFourth);
  $('.july-4').dxBullet(julFourth);
  $('.august-4').dxBullet(augFourth);
});
