import { Component, computed, input } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

@Component({
  selector: 'detail-grid',
  templateUrl: './detail-grid.component.html',
  imports: [
    DxDataGridModule,
  ],
  providers: [],
})
export class DetailGridComponent {
  readonly key = input.required<number>();

  readonly dataSource = computed(() => new DataSource({
    store: AspNetData.createStore({
      loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/DataGridWebApi/OrderDetails',
      loadParams: { orderID: this.key() },
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    }),
  }));
}
