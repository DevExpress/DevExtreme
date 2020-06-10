import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import Guid from 'devextreme/core/guid';
import { Subject } from 'rxjs';

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';

@Injectable()
export class CollaborativeEditingService {
    private storeChanged = new Subject<Array<Object>>();
    private groupId: string = new Guid().toJSON();
    private connection: Object;

    getStoreChangedObservable() {
        this.connection || this.initHubConnection();
        return this.storeChanged.asObservable();
    }

    createStatesStore() {
        return AspNetData.createStore({
            key: 'ID',
            loadUrl: BASE_PATH + 'api/DataGridStatesLookup'
        })
    }

    createStore() {
        const url = BASE_PATH + 'api/DataGridCollaborativeEditing';
        return AspNetData.createStore({
            key: 'ID',
            loadUrl: url,
            insertUrl: url,
            updateUrl: url,
            deleteUrl: url,
            onBeforeSend: (operation, ajaxSettings) => {
                ajaxSettings.data.groupId = this.groupId;
            }
        })
    }

    private initHubConnection() {
        const connection = this.createConnection();
        connection.start()
            .then(() => {
                connection.on('update', (key, data) => {
                    this.storeChanged.next([{ type: 'update', key: key, data: data }]);
                });

                connection.on('insert', data => {
                    this.storeChanged.next([{ type: 'insert', data: data }]);
                });

                connection.on('remove', key => {
                    this.storeChanged.next([{ type: 'remove', key: key }]);
                });
            });
    }

    private createConnection() {
        const hubUrl = `${BASE_PATH}dataGridCollaborativeEditingHub?GroupId=${this.groupId}`;
        return new HubConnectionBuilder()
            .withUrl(hubUrl, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .build();
    }
}