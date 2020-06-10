var cities = ["Los Angeles","Denver","Bentonville","Atlanta","Reno","Beaver","Malibu","Phoenix","San Diego","Little Rock","Pasadena","Boise","San Jose","Chatsworth","San Fernando","South Pasadena","San Fernando Valley","La Canada","St. Louis"];

var orders = [];

var ordersStore = new DevExpress.data.ArrayStore({
    key: "OrderID",
    data: orders
});

var products = [];
for(var i = 1; i <= 100; i++) {
    products.push({ ProductID: i, ProductName: "Product " + i, UnitPrice: Math.floor(Math.random() * 1000) + 1, Quantity: 0, Amount: 0, OrderCount: 0 });
}

var productsStore = new DevExpress.data.ArrayStore({
    key: "ProductID",
    data: products
});

function addOrder() {
    var product = products[Math.round(Math.random() * 99)];
    var order = {
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