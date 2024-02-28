import { MapType } from 'devextreme/ui/map';

export const mapTypes: { key: MapType, name: string }[] = [{
  key: 'roadmap',
  name: 'Road Map',
}, {
  key: 'satellite',
  name: 'Satellite (Photographic) Map',
}, {
  key: 'hybrid',
  name: 'Hybrid Map',
}];

export const mapTypeLabel = { 'aria-label': 'Map Type' };
