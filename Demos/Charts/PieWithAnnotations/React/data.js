const annotationSources = [{
  country: 'Russia',
  offsetX: 15,
  offsetY: 5
}, {
  country: 'Canada',
  offsetY: 10
}, {
  country: 'Czech Republic',
  offsetX: -5,
  offsetY: -35
}, {
  country: 'Sweden',
  offsetX: 20,
  offsetY: -25
}, {
  country: 'Finland',
  location: 'edge',
  offsetX: 45,
  offsetY: -85,
}, {
  country: 'United States',
  location: 'edge',
  offsetX: 85,
  offsetY: -45,
}, {
  country: 'Great Britain',
  location: 'edge',
  offsetX: 81,
  offsetY: 15
}, {
  country: 'Slovakia',
  location: 'edge',
  offsetX: 45,
  offsetY: 80
}];

const edgeAnnotationSettings = {
  color: '#aaaaaa',
  borderColor: '#aaaaaa',
  shadowOpacity: 0.3
};

export const dataSource = [{
  country: 'Russia',
  oldCountryName: 'Soviet Union',
  gold: 27,
  silver: 10,
  bronze: 10
}, {
  country: 'Canada',
  gold: 26,
  silver: 15,
  bronze: 9
}, {
  country: 'Czech Republic',
  oldCountryName: 'Czechoslovakia',
  gold: 12,
  silver: 13,
  bronze: 21
}, {
  country: 'Sweden',
  gold: 11,
  silver: 19,
  bronze: 17
}, {
  country: 'Finland',
  gold: 3,
  silver: 8,
  bronze: 3
}, {
  country: 'United States',
  gold: 2,
  silver: 9,
  bronze: 8
}, {
  country: 'Great Britain',
  gold: 1,
  silver: 2,
  bronze: 2
}, {
  country: 'Slovakia',
  gold: 1,
  silver: 2,
  bronze: 1
}];

export function getAnnotationSources() {
  const annotations = [];
  for(let i = 0; i < annotationSources.length; i++) {
    let annotation = annotationSources[i];
    const country = annotation.country;
    const image = `../../../../images/flags/3x2/${country.replace(/\s/, '')}.svg`;
    const data = { ...dataSource.filter(d => (d.country === country))[0] };

    annotations.push({
      ...annotation,
      image,
      data,
      ...(annotation.location === 'edge' ? edgeAnnotationSettings : {})
    });
  }

  return annotations;
}
