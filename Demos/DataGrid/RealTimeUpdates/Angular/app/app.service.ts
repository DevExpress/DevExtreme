import { Injectable } from '@angular/core';
import ArrayStore from 'devextreme/data/array_store';

export class Product {
    ProductID: number;
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    Amount: number;
    OrderCount: number;
}

export class Order {
    OrderID: number;
    ShipCity: string;
    ProductID: number;
    UnitPrice: number;
    OrderDate: Date;
    Quantity: number;
}

const cities = ["Los Angeles","Denver","Bentonville","Atlanta","Reno","Beaver","Malibu","Phoenix","San Diego","Little Rock","Pasadena","Boise","San Jose","Chatsworth","San Fernando","South Pasadena","San Fernando Valley","La Canada","St. Louis"];

let products: Product[] = [];

for(var i = 1; i <= 100; i++) {
    products.push({ 
        ProductID: i,
        ProductName: "Product " + i,
        UnitPrice: Math.floor(Math.random() * 1000) + 1,
        Quantity: 0,
        Amount: 0,
        OrderCount: 0
    });
}

let productsStore: ArrayStore = new ArrayStore({
    data: products,
    key: "ProductID"
});

let orders = [];

let ordersStore = new ArrayStore({
    key: "OrderID",
    data: orders
});

@Injectable()
export class Service {
    getProducts() {
        return productsStore;
    }

    getOrders() {
        return ordersStore;
    }

    getOrderCount() {
        return orders.length;
    }

    addOrder() {
        let product = products[Math.round(Math.random() * 99)];
        let order: Order = {
            OrderID: orders.length ? orders[orders.length - 1].OrderID + 1 : 20001,
            ShipCity: cities[Math.round(Math.random() * (cities.length - 1))],
            ProductID: product.ProductID,
            UnitPrice: product.UnitPrice,
            OrderDate: new Date(),
            Quantity: Math.round(Math.random() * 20) + 1
        };
    
        ordersStore.push([{ type: "insert", data: order }]);
    
        productsStore.push([{
            type: "update",
            key: order.ProductID,
            data: {
                OrderCount: product.OrderCount + 1,
                Quantity: product.Quantity + order.Quantity,
                Amount: product.Amount + order.UnitPrice * order.Quantity
            }
        }]);    
    }
}
