import { Injectable } from '@angular/core';

export class MapSetting {
  key: string;

  name: string;
}

export type APIKey = {
  azure?: string;

  bing?: string;

  google?: string;

  googleStatic?: string;
};

const mapTypes: MapSetting[] = [{
  key: 'roadmap',
  name: 'Road Map',
}, {
  key: 'satellite',
  name: 'Satellite (Photographic) Map',
}, {
  key: 'hybrid',
  name: 'Hybrid Map',
}];

const mapProviders: MapSetting[] = [{
  key: 'azure',
  name: 'Azure',
}, {
  key: 'bing',
  name: 'Bing',
}, {
  key: 'google',
  name: 'Google',
}];

@Injectable()
export class Service {
  getMapTypes(): MapSetting[] {
    return mapTypes;
  }

  getMapProviders(): MapSetting[] {
    return mapProviders;
  }
}
