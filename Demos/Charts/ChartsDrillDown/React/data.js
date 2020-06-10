const data = [
  { arg: 'Asia', val: 3007613498, parentID: '' },
  { arg: 'North America', val: 493603615, parentID: '' },
  { arg: 'Europe', val: 438575293, parentID: '' },
  { arg: 'Africa', val: 381331438, parentID: '' },
  { arg: 'South America', val: 331126555, parentID: '' },
  { arg: 'Nigeria', val: 181562056, parentID: 'Africa' },
  { arg: 'Egypt', val: 88487396, parentID: 'Africa' },
  { arg: 'Congo', val: 77433744, parentID: 'Africa' },
  { arg: 'Morocco', val: 33848242, parentID: 'Africa' },
  { arg: 'China', val: 1380083000, parentID: 'Asia' },
  { arg: 'India', val: 1306687000, parentID: 'Asia' },
  { arg: 'Pakistan', val: 193885498, parentID: 'Asia' },
  { arg: 'Japan', val: 126958000, parentID: 'Asia' },
  { arg: 'Russia', val: 146804372, parentID: 'Europe' },
  { arg: 'Germany', val: 82175684, parentID: 'Europe' },
  { arg: 'Turkey', val: 79463663, parentID: 'Europe' },
  { arg: 'France', val: 66736000, parentID: 'Europe' },
  { arg: 'United Kingdom', val: 63395574, parentID: 'Europe' },
  { arg: 'United States', val: 325310275, parentID: 'North America' },
  { arg: 'Mexico', val: 121005815, parentID: 'North America' },
  { arg: 'Canada', val: 36048521, parentID: 'North America' },
  { arg: 'Cuba', val: 11239004, parentID: 'North America' },
  { arg: 'Brazil', val: 205737996, parentID: 'South America' },
  { arg: 'Colombia', val: 48400388, parentID: 'South America' },
  { arg: 'Venezuela', val: 30761000, parentID: 'South America' },
  { arg: 'Peru', val: 28220764, parentID: 'South America' },
  { arg: 'Chile', val: 18006407, parentID: 'South America' }
];

export default {
  filterData(name) {
    return data.filter(function(item) {
      return item.parentID === name;
    });
  }
};
