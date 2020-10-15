import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import applyChanges from 'devextreme/data/apply_changes';

export class Order {
    OrderID: number;
    ShipName: string;
    ShipCountry: string;
    ShipCity: string;
    ShipAddress: string;
    OrderDate: string;
    Freight: number;
}

export class Change<T> {
    type: "insert" | "update" | "remove";
    key: any;
    data: Partial<T>;
}

@Injectable()
export class Service {
    private orders$ = new BehaviorSubject<Order[]>([]);
    private url = "https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi";

    constructor(private http: HttpClient) { }

    updateOrders(change: Change<Order>, data: Order) {
        change.data = data;
        const orders = applyChanges(this.orders$.getValue(), [change], { keyExpr: "OrderID" });
        this.orders$.next(orders);
    }

    getOrders(): Observable<Order[]> {
        this.http.get(`${this.url}/Orders?skip=700`, { withCredentials: true }).toPromise().then((data) => {
            this.orders$.next(data["data"]);
        });

        return this.orders$.asObservable();
    }

    async insert(change: Change<Order>): Promise<Order> {
        const httpParams = new HttpParams({ fromObject: { values: JSON.stringify(change.data) } });
        const httpOptions = { withCredentials: true, body: httpParams };
        const data = await this.http.post<Order>(`${this.url}/InsertOrder`, httpParams, httpOptions).toPromise();

        this.updateOrders(change, data);

        return data;
    }

    async update(change: Change<Order>): Promise<Order> {
        const httpParams = new HttpParams({ fromObject: { key: change.key, values: JSON.stringify(change.data) } });
        const httpOptions = { withCredentials: true, body: httpParams };
        const data = await this.http.put<Order>(`${this.url}/UpdateOrder`, httpParams, httpOptions).toPromise();

        this.updateOrders(change, data);

        return data;
    }

    async remove(change: Change<Order>): Promise<Order> {
        const httpParams = new HttpParams({ fromObject: { key: change.key } });
        const httpOptions = { withCredentials: true, body: httpParams };
        const data = await this.http.delete<Order>(`${this.url}/DeleteOrder`, httpOptions).toPromise();

        this.updateOrders(change, data);
        
        return data;
    }

    async saveChange(change: Change<Order>): Promise<Order> {
        switch (change.type) {
            case "insert":
                return this.insert(change);
            case "update":
                return this.update(change);
            case "remove":
                return this.remove(change);
        }
    }
};