export const coordLinesData = {
  type: 'FeatureCollection',
  features: []
};

//add meridians
for (let longitude = -180; longitude <= 180; longitude += 30) {
  const lineCoords = [];
  for (let latitude = -90; latitude <= 90; latitude += 5) {
    lineCoords.push([longitude, latitude]);
  }

  coordLinesData.features.push({
    geometry: {
      type: 'LineString',
      coordinates: lineCoords
    }
  });
}

//add parallels
for (let latitude = -90; latitude <= 90; latitude += 30) {
  coordLinesData.features.push({
    geometry: {
      type: 'LineString',
      coordinates: [[ -180, latitude ], [ 180, latitude]]
    }
  });
}
