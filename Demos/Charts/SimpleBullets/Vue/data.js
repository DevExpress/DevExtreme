
const weeksData = [{
  weekCount: 'First',
  bulletsData: [{
    value: 23,
    target: 20,
    color: '#ebdd8f'
  }, {
    value: 27,
    target: 24,
    color: '#e8c267'
  }, {
    value: 20,
    target: 26,
    color: '#e55253'
  }]
}, {
  weekCount: 'Second',
  bulletsData: [{
    value: 24,
    target: 22,
    color: '#ebdd8f'
  }, {
    value: 28,
    target: 24,
    color: '#e8c267'
  }, {
    value: 30,
    target: 24,
    color: '#e55253'
  }]
}, {
  weekCount: 'Third',
  bulletsData: [{
    value: 35,
    target: 24,
    color: '#ebdd8f'
  }, {
    value: 24,
    target: 26,
    color: '#e8c267'
  }, {
    value: 28,
    target: 22,
    color: '#e55253'
  }]
}, {
  weekCount: 'Fourth',
  bulletsData: [{
    value: 29,
    target: 25,
    color: '#ebdd8f'
  }, {
    value: 24,
    target: 27,
    color: '#e8c267'
  }, {
    value: 21,
    target: 21,
    color: '#e55253'
  }]
}];

export const service = {
  getWeeksData() {
    return weeksData;
  }
};
