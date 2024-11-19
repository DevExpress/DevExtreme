import { IRouteProps } from 'devextreme-react/map';

export const markersData = [{
  location: [40.755833, -73.986389],
}, {
  location: '40.7825, -73.966111',
}, {
  location: { lat: 40.753889, lng: -73.981389 },
}, {
  location: 'City Hall Park,New York,NY',
}];

export const routesData: IRouteProps[] = [{
  weight: 6,
  color: 'blue',
  opacity: 0.5,
  locations: [
    [40.782500, -73.966111],
    [40.755833, -73.986389],
    [40.753889, -73.981389],
    ['City Hall Park,New York,NY'],
  ],
}];

export const modeLabel = { 'aria-label': 'Mode' };
export const colorLabel = { 'aria-label': 'Color' };
