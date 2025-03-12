import { type DxMapTypes } from "devextreme-vue/map";

export const mapTypes: {
  key: DxMapTypes.MapType,
  name: string,
}[] = [{
  key: 'roadmap',
  name: 'Road Map',
}, {
  key: 'satellite',
  name: 'Satellite (Photographic) Map',
}, {
  key: 'hybrid',
  name: 'Hybrid Map',
}];

export const mapProviders: {
  key: DxMapTypes.MapProvider,
  name: string,
}[] = [{
  key: 'azure',
  name: 'Azure',
}, {
  key: 'google',
  name: 'Google',
}, {
  key: 'bing',
  name: 'Bing',
}];
