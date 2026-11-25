import { Injectable } from '@angular/core';
import type { DxMapTypes } from 'devextreme-angular/ui/map';

interface MapSetting<TKey> {
  key: TKey;

  name: string;
}

export type MapTypeSetting = MapSetting<DxMapTypes.MapType>;

export type MapProviderSetting = MapSetting<DxMapTypes.MapProvider>;

export type APIKey = {
  azure?: string;

  bing?: string;

  google?: string;

  googleStatic?: string;
};

const mapTypes: MapTypeSetting[] = [{
  key: 'roadmap',
  name: 'Road Map',
}, {
  key: 'satellite',
  name: 'Satellite (Photographic) Map',
}, {
  key: 'hybrid',
  name: 'Hybrid Map',
}];

const mapProviders: MapProviderSetting[] = [{
  key: 'azure',
  name: 'Azure',
}, {
  key: 'google',
  name: 'Google',
}, {
  key: 'bing',
  name: 'Bing',
}];

@Injectable()
export class Service {
  getMapTypes(): MapTypeSetting[] {
    return mapTypes;
  }

  getMapProviders(): MapProviderSetting[] {
    return mapProviders;
  }
}
