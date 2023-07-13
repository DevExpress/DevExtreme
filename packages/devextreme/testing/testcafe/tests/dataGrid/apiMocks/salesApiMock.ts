import { RequestMock } from 'testcafe';

export const salesApiMock = RequestMock()
  .onRequestTo(/\/api\/data\?skip=0&take=20&requireTotalCount=true&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D/)
  .respond(
    {
      data: [{
        key: 'Contoso Albany Store', items: null, count: 2058,
      }, {
        key: 'Contoso Alexandria Store', items: null, count: 2021,
      }, {
        key: 'Contoso Amsterdam Store', items: null, count: 2064,
      }, {
        key: 'Contoso Anchorage Store', items: null, count: 2072,
      }, {
        key: 'Contoso Annapolis Store', items: null, count: 2131,
      }, {
        key: 'Contoso Appleton Store', items: null, count: 2045,
      }, {
        key: 'Contoso Arlington Store', items: null, count: 2049,
      }, {
        key: 'Contoso Ashgabat  No.2 Store', items: null, count: 3275,
      }, {
        key: 'Contoso Ashgabat No.1 Store', items: null, count: 3285,
      }, {
        key: 'Contoso Asia Online Store', items: null, count: 56357,
      }, {
        key: 'Contoso Asia Reseller', items: null, count: 38313,
      }, {
        key: 'Contoso Athens Store', items: null, count: 2218,
      }, {
        key: 'Contoso Atlantic City Store', items: null, count: 2104,
      }, {
        key: 'Contoso Attleboro Store', items: null, count: 2043,
      }, {
        key: 'Contoso Aurora Store', items: null, count: 2075,
      }, {
        key: 'Contoso Austin Store', items: null, count: 2029,
      }, {
        key: 'Contoso Back River Store', items: null, count: 2015,
      }, {
        key: 'Contoso Bacliff Store', items: null, count: 2100,
      }, {
        key: 'Contoso Baildon Store', items: null, count: 2144,
      }, {
        key: 'Contoso Baltimore Store', items: null, count: 2103,
      }],
      totalCount: 1000000,
      groupCount: 306,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=280&take=40&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D/)
  .respond(
    {
      data: [{
        key: 'Contoso Toulouse Store', items: null, count: 2207,
      }, {
        key: 'Contoso Trenton No.1 Store', items: null, count: 2078,
      }, {
        key: 'Contoso Trenton No.2 Store', items: null, count: 2106,
      }, {
        key: 'Contoso Urumqi Store', items: null, count: 3237,
      }, {
        key: 'Contoso Valletta Store', items: null, count: 2239,
      }, {
        key: 'Contoso Vancouver  No.1 Store', items: null, count: 2145,
      }, {
        key: 'Contoso Vancouver  No.2 Store', items: null, count: 2101,
      }, {
        key: 'Contoso Venezia Store', items: null, count: 157,
      }, {
        key: 'Contoso Veradale Store', items: null, count: 2041,
      }, {
        key: 'Contoso Vineland Store', items: null, count: 2057,
      }, {
        key: 'Contoso Virginia Beach Store', items: null, count: 2099,
      }, {
        key: 'Contoso Wapato Store', items: null, count: 2140,
      }, {
        key: 'Contoso Warsaw Store', items: null, count: 2205,
      }, {
        key: 'Contoso Waterbury Store', items: null, count: 2045,
      }, {
        key: 'Contoso Waukesha No.1 Store', items: null, count: 2064,
      }, {
        key: 'Contoso Waukesha No.2 Store', items: null, count: 2070,
      }, {
        key: 'Contoso West Yorkshire Store', items: null, count: 2238,
      }, {
        key: 'Contoso Westminster Store', items: null, count: 2037,
      }, {
        key: 'Contoso Wheat Ridge Store', items: null, count: 2149,
      }, {
        key: 'Contoso Winchester Store', items: null, count: 2060,
      }, {
        key: 'Contoso Worcester No.1 Store', items: null, count: 2142,
      }, {
        key: 'Contoso Worcester No.2 Store', items: null, count: 2096,
      }, {
        key: 'Contoso Yakima Store', items: null, count: 2058,
      }, {
        key: 'Contoso Yerevan Store', items: null, count: 3221,
      }, {
        key: 'Contoso Yokohama Store', items: null, count: 3220,
      }, {
        key: 'Contoso York Store', items: null, count: 2139,
      }],
      totalCount: 1000000,
      groupCount: 306,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=0&take=1&requireTotalCount=false&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22ProductCategoryName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D&filter=%5B%22StoreName%22%2C%22%3D%22%2C%22Contoso%20York%20Store%22%5D/)
  .respond(
    {
      data: [{
        key: 'Audio', items: null, count: 65,
      }],
      totalCount: 2139,
      groupCount: 8,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=280&take=32&requireTotalCount=true&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D/)
  .respond(
    {
      data: [{
        key: 'Contoso Toulouse Store', items: null, count: 2207,
      }, {
        key: 'Contoso Trenton No.1 Store', items: null, count: 2078,
      }, {
        key: 'Contoso Trenton No.2 Store', items: null, count: 2106,
      }, {
        key: 'Contoso Urumqi Store', items: null, count: 3237,
      }, {
        key: 'Contoso Valletta Store', items: null, count: 2239,
      }, {
        key: 'Contoso Vancouver  No.1 Store', items: null, count: 2145,
      }, {
        key: 'Contoso Vancouver  No.2 Store', items: null, count: 2101,
      }, {
        key: 'Contoso Venezia Store', items: null, count: 157,
      }, {
        key: 'Contoso Veradale Store', items: null, count: 2041,
      }, {
        key: 'Contoso Vineland Store', items: null, count: 2057,
      }, {
        key: 'Contoso Virginia Beach Store', items: null, count: 2099,
      }, {
        key: 'Contoso Wapato Store', items: null, count: 2140,
      }, {
        key: 'Contoso Warsaw Store', items: null, count: 2205,
      }, {
        key: 'Contoso Waterbury Store', items: null, count: 2045,
      }, {
        key: 'Contoso Waukesha No.1 Store', items: null, count: 2064,
      }, {
        key: 'Contoso Waukesha No.2 Store', items: null, count: 2070,
      }, {
        key: 'Contoso West Yorkshire Store', items: null, count: 2238,
      }, {
        key: 'Contoso Westminster Store', items: null, count: 2037,
      }, {
        key: 'Contoso Wheat Ridge Store', items: null, count: 2149,
      }, {
        key: 'Contoso Winchester Store', items: null, count: 2060,
      }, {
        key: 'Contoso Worcester No.1 Store', items: null, count: 2142,
      }, {
        key: 'Contoso Worcester No.2 Store', items: null, count: 2096,
      }, {
        key: 'Contoso Yakima Store', items: null, count: 2058,
      }, {
        key: 'Contoso Yerevan Store', items: null, count: 3221,
      }, {
        key: 'Contoso Yokohama Store', items: null, count: 3220,
      }, {
        key: 'Contoso York Store', items: null, count: 2139,
      }],
      totalCount: 1000000,
      groupCount: 306,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=0&requireTotalCount=false&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22ProductCategoryName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D&filter=%5B%22StoreName%22%2C%22%3D%22%2C%22Contoso%20York%20Store%22%5D/)
  .respond(
    {
      data: [{
        key: 'Audio', items: null, count: 65,
      }, {
        key: 'Cameras and camcorders ', items: null, count: 356,
      }, {
        key: 'Cell phones', items: null, count: 256,
      }, {
        key: 'Computers', items: null, count: 529,
      }, {
        key: 'Games and Toys', items: null, count: 56,
      }, {
        key: 'Home Appliances', items: null, count: 617,
      }, {
        key: 'Music, Movies and Audio Books', items: null, count: 87,
      }, {
        key: 'TV and Video', items: null, count: 173,
      }],
      totalCount: 2139,
      groupCount: 8,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=280&take=26&requireTotalCount=true&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D/)
  .respond(
    {
      data: [{
        key: 'Contoso Toulouse Store', items: null, count: 2207,
      }, {
        key: 'Contoso Trenton No.1 Store', items: null, count: 2078,
      }, {
        key: 'Contoso Trenton No.2 Store', items: null, count: 2106,
      }, {
        key: 'Contoso Urumqi Store', items: null, count: 3237,
      }, {
        key: 'Contoso Valletta Store', items: null, count: 2239,
      }, {
        key: 'Contoso Vancouver  No.1 Store', items: null, count: 2145,
      }, {
        key: 'Contoso Vancouver  No.2 Store', items: null, count: 2101,
      }, {
        key: 'Contoso Venezia Store', items: null, count: 157,
      }, {
        key: 'Contoso Veradale Store', items: null, count: 2041,
      }, {
        key: 'Contoso Vineland Store', items: null, count: 2057,
      }, {
        key: 'Contoso Virginia Beach Store', items: null, count: 2099,
      }, {
        key: 'Contoso Wapato Store', items: null, count: 2140,
      }, {
        key: 'Contoso Warsaw Store', items: null, count: 2205,
      }, {
        key: 'Contoso Waterbury Store', items: null, count: 2045,
      }, {
        key: 'Contoso Waukesha No.1 Store', items: null, count: 2064,
      }, {
        key: 'Contoso Waukesha No.2 Store', items: null, count: 2070,
      }, {
        key: 'Contoso West Yorkshire Store', items: null, count: 2238,
      }, {
        key: 'Contoso Westminster Store', items: null, count: 2037,
      }, {
        key: 'Contoso Wheat Ridge Store', items: null, count: 2149,
      }, {
        key: 'Contoso Winchester Store', items: null, count: 2060,
      }, {
        key: 'Contoso Worcester No.1 Store', items: null, count: 2142,
      }, {
        key: 'Contoso Worcester No.2 Store', items: null, count: 2096,
      }, {
        key: 'Contoso Yakima Store', items: null, count: 2058,
      }, {
        key: 'Contoso Yerevan Store', items: null, count: 3221,
      }, {
        key: 'Contoso Yokohama Store', items: null, count: 3220,
      }, {
        key: 'Contoso York Store', items: null, count: 2139,
      }],
      totalCount: 1000000,
      groupCount: 306,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=0&take=1&requireTotalCount=false&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22ProductCategoryName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D&filter=%5B%22StoreName%22%2C%22%3D%22%2C%22Contoso%20York%20Store%22%5D/)
  .respond(
    {
      data: [{
        key: 'Audio', items: null, count: 65,
      }],
      totalCount: 2139,
      groupCount: 8,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?take=13&requireTotalCount=false&requireGroupCount=false&sort=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%7D%2C%7B%22selector%22%3A%22ProductCategoryName%22%2C%22desc%22%3Afalse%7D%5D&filter=%5B%5B%22StoreName%22%2C%22%3D%22%2C%22Contoso%20York%20Store%22%5D%2C%22and%22%2C%5B%22ProductCategoryName%22%2C%22%3D%22%2C%22Audio%22%5D%5D/)
  .respond(
    {
      data: [{
        Id: 4870, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4G MP3 Player E400 Orange', UnitPrice: 59.9900, SalesQuantity: 4, SalesAmount: 227.9620, DateKey: '2007-08-06T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 27963, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 4GB Video Recording Pen X200 Red', UnitPrice: 296.0000, SalesQuantity: 8, SalesAmount: 2249.6000, DateKey: '2008-10-08T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 38125, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 8GB Clock & Radio MP3 Player X850 Green', UnitPrice: 299.2300, SalesQuantity: 8, SalesAmount: 2333.9940, DateKey: '2007-01-10T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 64437, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4G MP3 Player E400 Black', UnitPrice: 59.9900, SalesQuantity: 18, SalesAmount: 1061.8230, DateKey: '2009-08-23T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 66671, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 32GB Video MP3 Player M3200 Orange', UnitPrice: 255.0000, SalesQuantity: 10, SalesAmount: 2550.0000, DateKey: '2008-06-18T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 67817, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4GB Flash MP3 Player E401 White', UnitPrice: 77.6800, SalesQuantity: 12, SalesAmount: 932.1600, DateKey: '2008-02-03T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 87707, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 2GB Pulse Smart pen M100 White', UnitPrice: 199.9500, SalesQuantity: 8, SalesAmount: 1599.6000, DateKey: '2007-10-28T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 97183, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 8GB MP3 Player new model M820 Yellow', UnitPrice: 134.0000, SalesQuantity: 8, SalesAmount: 991.6000, DateKey: '2009-10-19T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 104203, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E102 White', UnitPrice: 47.9500, SalesQuantity: 4, SalesAmount: 172.6200, DateKey: '2007-12-18T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 111976, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 1GBPulse Smart pen E50 Black', UnitPrice: 149.9500, SalesQuantity: 10, SalesAmount: 1499.5000, DateKey: '2008-07-03T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 115455, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones M402 Black', UnitPrice: 99.9900, SalesQuantity: 12, SalesAmount: 1185.8814, DateKey: '2009-03-20T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 116190, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E102 Silver', UnitPrice: 47.9500, SalesQuantity: 5, SalesAmount: 239.7500, DateKey: '2007-05-28T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 118547, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 8GB Clock & Radio MP3 Player X850 Silver', UnitPrice: 299.2300, SalesQuantity: 10, SalesAmount: 2992.3000, DateKey: '2007-07-29T00:00:00', StoreName: 'Contoso York Store',
      }],
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=305&take=22&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D/)
  .respond(
    {
      data: [{
        key: 'Contoso York Store', items: null, count: 2139,
      }],
      totalCount: 1000000,
      groupCount: 306,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=0&requireTotalCount=false&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22ProductCategoryName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D&filter=%5B%22StoreName%22%2C%22%3D%22%2C%22Contoso%20York%20Store%22%5D/)
  .respond(
    {
      data: [{
        key: 'Audio', items: null, count: 65,
      }, {
        key: 'Cameras and camcorders ', items: null, count: 356,
      }, {
        key: 'Cell phones', items: null, count: 256,
      }, {
        key: 'Computers', items: null, count: 529,
      }, {
        key: 'Games and Toys', items: null, count: 56,
      }, {
        key: 'Home Appliances', items: null, count: 617,
      }, {
        key: 'Music, Movies and Audio Books', items: null, count: 87,
      }, {
        key: 'TV and Video', items: null, count: 173,
      }],
      totalCount: 2139,
      groupCount: 8,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=53&requireTotalCount=false&requireGroupCount=false&sort=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%7D%2C%7B%22selector%22%3A%22ProductCategoryName%22%2C%22desc%22%3Afalse%7D%5D&filter=%5B%5B%22StoreName%22%2C%22%3D%22%2C%22Contoso%20York%20Store%22%5D%2C%22and%22%2C%5B%22ProductCategoryName%22%2C%22%3D%22%2C%22Audio%22%5D%5D/)
  .respond(
    {
      data: [{
        Id: 725129, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Bluetooth Stereo Headphones E52 Blue', UnitPrice: 25.6900, SalesQuantity: 5, SalesAmount: 128.4500, DateKey: '2007-05-05T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 745557, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Bluetooth Stereo Headphones E52 Pink', UnitPrice: 25.6900, SalesQuantity: 5, SalesAmount: 128.4500, DateKey: '2007-05-14T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 802579, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 2G MP3 Player E200 Red', UnitPrice: 21.5700, SalesQuantity: 4, SalesAmount: 79.8090, DateKey: '2007-09-23T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 827973, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E302 Silver', UnitPrice: 40.5500, SalesQuantity: 10, SalesAmount: 405.5000, DateKey: '2008-05-12T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 847299, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4GB Flash MP3 Player E401 Blue', UnitPrice: 77.6800, SalesQuantity: 5, SalesAmount: 388.4000, DateKey: '2007-07-09T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 856245, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 2G MP3 Player E200 Red', UnitPrice: 21.5700, SalesQuantity: 24, SalesAmount: 514.6602, DateKey: '2009-03-07T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 897075, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 512MB MP3 Player E51 Blue', UnitPrice: 12.9900, SalesQuantity: 4, SalesAmount: 46.7640, DateKey: '2007-09-14T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 932043, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4GB Flash MP3 Player E401 Silver', UnitPrice: 77.6800, SalesQuantity: 4, SalesAmount: 295.1840, DateKey: '2007-09-10T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 939302, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E102 Black', UnitPrice: 47.9500, SalesQuantity: 5, SalesAmount: 239.7500, DateKey: '2007-07-22T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 967607, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 32GB Video MP3 Player M3200 Orange', UnitPrice: 255.0000, SalesQuantity: 10, SalesAmount: 2550.0000, DateKey: '2009-05-17T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 967769, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E102 Black', UnitPrice: 47.9500, SalesQuantity: 4, SalesAmount: 163.0300, DateKey: '2007-12-29T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 989968, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 1GBPulse Smart pen E50 Black', UnitPrice: 149.9500, SalesQuantity: 18, SalesAmount: 2639.1200, DateKey: '2009-08-06T00:00:00', StoreName: 'Contoso York Store',
      }],
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=305&take=2&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D/)
  .respond(
    {
      data: [{
        key: 'Contoso York Store', items: null, count: 2139,
      }],
      totalCount: 1000000,
      groupCount: 306,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=0&requireTotalCount=false&requireGroupCount=true&group=%5B%7B%22selector%22%3A%22ProductCategoryName%22%2C%22desc%22%3Afalse%2C%22isExpanded%22%3Afalse%7D%5D&filter=%5B%22StoreName%22%2C%22%3D%22%2C%22Contoso%20York%20Store%22%5D/)
  .respond(
    {
      data: [{
        key: 'Audio', items: null, count: 65,
      }, {
        key: 'Cameras and camcorders ', items: null, count: 356,
      }, {
        key: 'Cell phones', items: null, count: 256,
      }, {
        key: 'Computers', items: null, count: 529,
      }, {
        key: 'Games and Toys', items: null, count: 56,
      }, {
        key: 'Home Appliances', items: null, count: 617,
      }, {
        key: 'Music, Movies and Audio Books', items: null, count: 87,
      }, {
        key: 'TV and Video', items: null, count: 173,
      }],
      totalCount: 2139,
      groupCount: 8,
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  )
  .onRequestTo(/\/api\/data\?skip=33&requireTotalCount=false&requireGroupCount=false&sort=%5B%7B%22selector%22%3A%22StoreName%22%2C%22desc%22%3Afalse%7D%2C%7B%22selector%22%3A%22ProductCategoryName%22%2C%22desc%22%3Afalse%7D%5D&filter=%5B%5B%22StoreName%22%2C%22%3D%22%2C%22Contoso%20York%20Store%22%5D%2C%22and%22%2C%5B%22ProductCategoryName%22%2C%22%3D%22%2C%22Audio%22%5D%5D/)
  .respond(
    {
      data: [{
        Id: 326978, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 2G MP3 Player E200 Blue', UnitPrice: 21.5700, SalesQuantity: 12, SalesAmount: 255.8202, DateKey: '2008-02-22T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 330936, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E302 Pink', UnitPrice: 40.5500, SalesQuantity: 4, SalesAmount: 145.9800, DateKey: '2007-10-05T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 352370, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Bluetooth Stereo Headphones E52 Blue', UnitPrice: 25.6900, SalesQuantity: 8, SalesAmount: 200.3820, DateKey: '2008-01-22T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 382196, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 16GB New Generation MP5 Player M1650 Black', UnitPrice: 232.0000, SalesQuantity: 10, SalesAmount: 2320.0000, DateKey: '2009-05-04T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 389599, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 1GBPulse Smart pen E50 Black', UnitPrice: 149.9500, SalesQuantity: 8, SalesAmount: 1019.6600, DateKey: '2007-01-02T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 403430, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4G MP3 Player E400 Black', UnitPrice: 59.9900, SalesQuantity: 12, SalesAmount: 719.8800, DateKey: '2008-02-26T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 410926, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4GB Portable MP3 Player M450 Black', UnitPrice: 95.9500, SalesQuantity: 8, SalesAmount: 729.2200, DateKey: '2007-12-29T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 450485, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 2GB Pulse Smart pen M100 Black', UnitPrice: 199.9500, SalesQuantity: 9, SalesAmount: 1759.5600, DateKey: '2007-09-18T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 457320, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E102 Blue', UnitPrice: 47.9500, SalesQuantity: 9, SalesAmount: 412.3700, DateKey: '2008-08-04T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 458508, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 8GB Clock & Radio MP3 Player X850 Black', UnitPrice: 299.2300, SalesQuantity: 10, SalesAmount: 2992.3000, DateKey: '2007-05-03T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 483937, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 1GB Pulse Smart pen E50 White', UnitPrice: 149.9500, SalesQuantity: 9, SalesAmount: 1334.5550, DateKey: '2008-08-13T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 523948, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 8GB Clock & Radio MP3 Player X850 Black', UnitPrice: 299.2300, SalesQuantity: 10, SalesAmount: 2992.3000, DateKey: '2007-06-04T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 531053, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 8GB Clock & Radio MP3 Player X850 Black', UnitPrice: 299.2300, SalesQuantity: 12, SalesAmount: 3590.7600, DateKey: '2008-04-10T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 558587, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 1G MP3 Player E100 White', UnitPrice: 14.5200, SalesQuantity: 6, SalesAmount: 87.1200, DateKey: '2007-02-19T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 582407, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'WWI Stereo Bluetooth Headphones New Generation M370 Yellow', UnitPrice: 132.9900, SalesQuantity: 10, SalesAmount: 1329.9000, DateKey: '2009-06-28T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 629583, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 2G MP3 Player E200 Black', UnitPrice: 21.5700, SalesQuantity: 4, SalesAmount: 73.3380, DateKey: '2007-10-22T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 656144, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Transmitter and Bluetooth Headphones M150 Silver', UnitPrice: 149.9900, SalesQuantity: 9, SalesAmount: 1349.9100, DateKey: '2008-09-08T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 674318, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 1GB Digital Voice Recorder Pen E100 White', UnitPrice: 156.0000, SalesQuantity: 12, SalesAmount: 1872.0000, DateKey: '2008-04-16T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 676563, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'WWI Stereo Bluetooth Headphones New Generation M370 Blue', UnitPrice: 132.9900, SalesQuantity: 10, SalesAmount: 1329.9000, DateKey: '2009-05-21T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 697663, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 2GB Pulse Smart pen M100 Blue', UnitPrice: 199.9500, SalesQuantity: 8, SalesAmount: 1439.6400, DateKey: '2007-10-06T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 725129, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Bluetooth Stereo Headphones E52 Blue', UnitPrice: 25.6900, SalesQuantity: 5, SalesAmount: 128.4500, DateKey: '2007-05-05T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 745557, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Bluetooth Stereo Headphones E52 Pink', UnitPrice: 25.6900, SalesQuantity: 5, SalesAmount: 128.4500, DateKey: '2007-05-14T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 802579, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 2G MP3 Player E200 Red', UnitPrice: 21.5700, SalesQuantity: 4, SalesAmount: 79.8090, DateKey: '2007-09-23T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 827973, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E302 Silver', UnitPrice: 40.5500, SalesQuantity: 10, SalesAmount: 405.5000, DateKey: '2008-05-12T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 847299, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4GB Flash MP3 Player E401 Blue', UnitPrice: 77.6800, SalesQuantity: 5, SalesAmount: 388.4000, DateKey: '2007-07-09T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 856245, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 2G MP3 Player E200 Red', UnitPrice: 21.5700, SalesQuantity: 24, SalesAmount: 514.6602, DateKey: '2009-03-07T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 897075, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 512MB MP3 Player E51 Blue', UnitPrice: 12.9900, SalesQuantity: 4, SalesAmount: 46.7640, DateKey: '2007-09-14T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 932043, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 4GB Flash MP3 Player E401 Silver', UnitPrice: 77.6800, SalesQuantity: 4, SalesAmount: 295.1840, DateKey: '2007-09-10T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 939302, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E102 Black', UnitPrice: 47.9500, SalesQuantity: 5, SalesAmount: 239.7500, DateKey: '2007-07-22T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 967607, ProductCategoryName: 'Audio', ProductSubcategoryName: 'MP4&MP3', ProductName: 'Contoso 32GB Video MP3 Player M3200 Orange', UnitPrice: 255.0000, SalesQuantity: 10, SalesAmount: 2550.0000, DateKey: '2009-05-17T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 967769, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Bluetooth Headphones', ProductName: 'NT Wireless Bluetooth Stereo Headphones E102 Black', UnitPrice: 47.9500, SalesQuantity: 4, SalesAmount: 163.0300, DateKey: '2007-12-29T00:00:00', StoreName: 'Contoso York Store',
      }, {
        Id: 989968, ProductCategoryName: 'Audio', ProductSubcategoryName: 'Recording Pen', ProductName: 'WWI 1GBPulse Smart pen E50 Black', UnitPrice: 149.9500, SalesQuantity: 18, SalesAmount: 2639.1200, DateKey: '2009-08-06T00:00:00', StoreName: 'Contoso York Store',
      }],
    },
    200,
    {
      'access-control-allow-origin': '*',
    },
  );
