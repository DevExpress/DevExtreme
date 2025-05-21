import {
  getAppointmentResourceAccessor,
  getResourceIndex,
  type ResourceIdAccessor,
} from '../data_accessor/appointment_resource_data_accessor';
import { ResourceDataAccessor } from '../data_accessor/resource_data_accessor';
import { Loader } from './loader';
import type {
  RawResourceData,
  ResourceConfig,
  ResourceData,
} from './types';

export class ResourceLoader extends Loader<RawResourceData, ResourceData> {
  idsGetter: ResourceIdAccessor['idsGetter'];

  idsSetter: ResourceIdAccessor['idsSetter'];

  constructor(
    config: ResourceConfig,
    public dataAccessor = new ResourceDataAccessor(config),
    public allowMultiple = Boolean(config.allowMultiple),
    public useColorAsDefault = Boolean(config.useColorAsDefault),
    public resourceIndex = String(getResourceIndex(config)),
    public resourceName = config.label,
  ) {
    super(config, { pageSize: 0 });
    const accessor = getAppointmentResourceAccessor(config);

    this.idsGetter = accessor.idsGetter;
    this.idsSetter = accessor.idsSetter;
    this.onInit();
  }

  protected onLoadTransform(items: RawResourceData[]): ResourceData[] {
    return items.map((item) => ({
      id: this.dataAccessor.get('id', item),
      text: this.dataAccessor.get('text', item),
      color: this.dataAccessor.get('color', item),
    }));
  }

  protected onLoadError(): void {}

  protected onChange(): void {}
}
