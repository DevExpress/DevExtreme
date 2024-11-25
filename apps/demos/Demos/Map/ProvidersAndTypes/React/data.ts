import { MapType, MapProvider } from 'devextreme/ui/map';

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

export const mapProviders: { key: MapProvider, name: string }[] = [{
  key: 'azure',
  name: 'Azure',
}, {
  key: 'google',
  name: 'Google',
}, {
  key: 'bing',
  name: 'Bing',
}];

export const mapTypeLabel = { 'aria-label': 'Map Type' };
export const mapProviderLabel = { 'aria-label': 'Map Provider' };
