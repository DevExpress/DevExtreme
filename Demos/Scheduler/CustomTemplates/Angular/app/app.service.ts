import { Injectable } from '@angular/core';

export class MovieData {
    id: number;
    text: string;
    director: string;
	year: number;
    image: string;
    duration: number;
    color: string;
}

export class TheatreData {
    text: string;
    id: number;
}

export class Data {
    theatreId: number;
    movieId: number;
    price: number;
    startDate: Date;
    endDate: Date
}

let moviesData: MovieData[] = [{
    id: 1,
    text: "His Girl Friday",
    director: "Howard Hawks",
    year: 1940,
    image: "../../../../images/movies/HisGirlFriday.jpg",
    duration: 92,
    color: "#cb6bb2"
}, {
    id: 2,
    text: "Royal Wedding",
    director: "Stanley Donen",
    year: 1951,
    image: "../../../../images/movies/RoyalWedding.jpg",
    duration: 93,
    color: "#56ca85"
}, {
    id: 3,
    text: "A Star Is Born",
    director: "William A. Wellman",
    year: 1937,
    image: "../../../../images/movies/AStartIsBorn.jpg",
    duration: 111,
    color: "#1e90ff"
}, {
    id: 4,
    text: "The Screaming Skull",
    director: "Alex Nicol",
    year: 1958,
    image: "../../../../images/movies/ScreamingSkull.jpg",
    duration: 68,
    color: "#ff9747"
}, {
    id: 5,
    text: "It's a Wonderful Life",
    director: "Frank Capra",
    year: 1946,
    image: "../../../../images/movies/ItsAWonderfulLife.jpg",
    duration: 130,
    color: "#f05797"
}, {
    id: 6,
    text: "City Lights",
    director: "Charlie Chaplin",
    year: 1931,
    image: "../../../../images/movies/CityLights.jpg",
    duration: 87,
    color: "#2a9010"
}];

let theatreData: TheatreData[] = [{
        text: "Cinema Hall 1",
        id: 0
    }, {
        text: "Cinema Hall 2",
        id: 1
    }
];

let data: Data[] = [{
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-24T16:10:00.000Z"),
        endDate: new Date("2021-05-24T18:01:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-24T18:30:00.000Z"),
        endDate: new Date("2021-05-24T20:02:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 15,
        startDate: new Date("2021-05-24T20:30:00.000Z"),
        endDate: new Date("2021-05-24T22:21:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-24T23:00:00.000Z"),
        endDate: new Date("2021-05-25T00:08:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 10,
        startDate: new Date("2021-05-25T00:30:00.000Z"),
        endDate: new Date("2021-05-25T02:03:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 10,
        startDate: new Date("2021-05-25T02:30:00.000Z"),
        endDate: new Date("2021-05-25T04:02:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 10,
        startDate: new Date("2021-05-25T04:20:00.000Z"),
        endDate: new Date("2021-05-25T05:53:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-25T16:10:00.000Z"),
        endDate: new Date("2021-05-25T18:20:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-25T19:00:00.000Z"),
        endDate: new Date("2021-05-25T20:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 5,
        startDate: new Date("2021-05-25T21:00:00.000Z"),
        endDate: new Date("2021-05-25T22:51:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-25T23:20:00.000Z"),
        endDate: new Date("2021-05-26T00:28:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 10,
        startDate: new Date("2021-05-26T01:00:00.000Z"),
        endDate: new Date("2021-05-26T02:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 15,
        startDate: new Date("2021-05-26T03:00:00.000Z"),
        endDate: new Date("2021-05-26T04:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-26T04:50:00.000Z"),
        endDate: new Date("2021-05-26T05:58:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-26T16:00:00.000Z"),
        endDate: new Date("2021-05-26T17:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-26T18:00:00.000Z"),
        endDate: new Date("2021-05-26T19:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-26T20:20:00.000Z"),
        endDate: new Date("2021-05-26T22:11:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-05-26T22:45:00.000Z"),
        endDate: new Date("2021-05-27T00:55:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 10,
        startDate: new Date("2021-05-27T01:20:00.000Z"),
        endDate: new Date("2021-05-27T02:28:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 20,
        startDate: new Date("2021-05-27T03:00:00.000Z"),
        endDate: new Date("2021-05-27T05:10:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-27T16:00:00.000Z"),
        endDate: new Date("2021-05-27T17:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-27T18:00:00.000Z"),
        endDate: new Date("2021-05-27T19:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-27T20:20:00.000Z"),
        endDate: new Date("2021-05-27T22:11:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-27T22:45:00.000Z"),
        endDate: new Date("2021-05-28T00:55:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-28T01:20:00.000Z"),
        endDate: new Date("2021-05-28T02:28:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-05-28T03:00:00.000Z"),
        endDate: new Date("2021-05-28T05:10:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-28T16:30:00.000Z"),
        endDate: new Date("2021-05-28T18:03:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-28T18:30:00.000Z"),
        endDate: new Date("2021-05-28T20:02:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 5,
        startDate: new Date("2021-05-28T20:30:00.000Z"),
        endDate: new Date("2021-05-28T22:21:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-28T23:00:00.000Z"),
        endDate: new Date("2021-05-29T01:10:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-29T01:30:00.000Z"),
        endDate: new Date("2021-05-29T02:38:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 15,
        startDate: new Date("2021-05-29T03:20:00.000Z"),
        endDate: new Date("2021-05-29T05:11:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-29T16:30:00.000Z"),
        endDate: new Date("2021-05-29T18:03:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 10,
        startDate: new Date("2021-05-29T18:30:00.000Z"),
        endDate: new Date("2021-05-29T20:02:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-29T20:30:00.000Z"),
        endDate: new Date("2021-05-29T22:21:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-29T23:00:00.000Z"),
        endDate: new Date("2021-05-30T01:10:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 10,
        startDate: new Date("2021-05-30T01:30:00.000Z"),
        endDate: new Date("2021-05-30T02:38:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-30T03:20:00.000Z"),
        endDate: new Date("2021-05-30T05:11:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-30T16:30:00.000Z"),
        endDate: new Date("2021-05-30T18:03:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-30T18:30:00.000Z"),
        endDate: new Date("2021-05-30T20:02:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-30T20:30:00.000Z"),
        endDate: new Date("2021-05-30T22:21:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-05-30T23:00:00.000Z"),
        endDate: new Date("2021-05-31T01:10:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 10,
        startDate: new Date("2021-05-31T01:30:00.000Z"),
        endDate: new Date("2021-05-31T02:38:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 15,
        startDate: new Date("2021-05-31T03:20:00.000Z"),
        endDate: new Date("2021-05-31T05:11:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-31T16:30:00.000Z"),
        endDate: new Date("2021-05-31T18:03:00.000Z")
    }, {
        theatreId: 0,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-05-31T18:30:00.000Z"),
        endDate: new Date("2021-05-31T19:57:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-31T20:20:00.000Z"),
        endDate: new Date("2021-05-31T22:11:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-31T23:00:00.000Z"),
        endDate: new Date("2021-06-01T00:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 10,
        startDate: new Date("2021-06-01T01:00:00.000Z"),
        endDate: new Date("2021-06-01T02:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 6,
        price: 20,
        startDate: new Date("2021-06-01T03:00:00.000Z"),
        endDate: new Date("2021-06-01T04:27:00.000Z")
    }, {
        theatreId: 0,
        movieId: 4,
        price: 15,
        startDate: new Date("2021-06-01T04:50:00.000Z"),
        endDate: new Date("2021-06-01T05:58:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-02T02:00:00.000Z"),
        endDate: new Date("2021-06-01T17:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-01T18:30:00.000Z"),
        endDate: new Date("2021-06-01T20:03:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-01T20:30:00.000Z"),
        endDate: new Date("2021-06-01T22:21:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-01T22:30:00.000Z"),
        endDate: new Date("2021-06-02T00:21:00.000Z")
    }, {
        theatreId: 0,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-02T00:30:00.000Z"),
        endDate: new Date("2021-06-02T01:57:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-06-02T03:00:00.000Z"),
        endDate: new Date("2021-06-02T05:10:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-03T02:00:00.000Z"),
        endDate: new Date("2021-06-02T17:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-03T04:00:00.000Z"),
        endDate: new Date("2021-06-03T05:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-02T20:00:00.000Z"),
        endDate: new Date("2021-06-02T21:51:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-02T22:30:00.000Z"),
        endDate: new Date("2021-06-03T00:21:00.000Z")
    }, {
        theatreId: 0,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-03T00:30:00.000Z"),
        endDate: new Date("2021-06-03T01:57:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-06-03T03:00:00.000Z"),
        endDate: new Date("2021-06-03T05:10:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-03T16:00:00.000Z"),
        endDate: new Date("2021-06-03T17:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-03T18:00:00.000Z"),
        endDate: new Date("2021-06-03T19:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-03T20:00:00.000Z"),
        endDate: new Date("2021-06-03T21:51:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-03T22:30:00.000Z"),
        endDate: new Date("2021-06-04T00:21:00.000Z")
    }, {
        theatreId: 0,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-04T00:30:00.000Z"),
        endDate: new Date("2021-06-04T01:57:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-06-04T03:00:00.000Z"),
        endDate: new Date("2021-06-04T05:10:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-04T16:00:00.000Z"),
        endDate: new Date("2021-06-04T17:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-04T18:00:00.000Z"),
        endDate: new Date("2021-06-04T19:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-04T20:00:00.000Z"),
        endDate: new Date("2021-06-04T21:51:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-06-04T22:30:00.000Z"),
        endDate: new Date("2021-06-05T00:40:00.000Z")
    }, {
        theatreId: 0,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-05T01:00:00.000Z"),
        endDate: new Date("2021-06-05T02:27:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 15,
        startDate: new Date("2021-06-05T03:00:00.000Z"),
        endDate: new Date("2021-06-05T04:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-05T16:00:00.000Z"),
        endDate: new Date("2021-06-05T17:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-05T18:00:00.000Z"),
        endDate: new Date("2021-06-05T19:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-05T20:00:00.000Z"),
        endDate: new Date("2021-06-05T21:51:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-06-05T22:30:00.000Z"),
        endDate: new Date("2021-06-06T00:40:00.000Z")
    }, {
        theatreId: 0,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-06T01:00:00.000Z"),
        endDate: new Date("2021-06-06T02:27:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 15,
        startDate: new Date("2021-06-06T03:00:00.000Z"),
        endDate: new Date("2021-06-06T04:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-06T16:00:00.000Z"),
        endDate: new Date("2021-06-06T17:33:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-06T18:00:00.000Z"),
        endDate: new Date("2021-06-06T19:32:00.000Z")
    }, {
        theatreId: 0,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-06T20:00:00.000Z"),
        endDate: new Date("2021-06-06T21:51:00.000Z")
    }, {
        theatreId: 0,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-06-06T22:30:00.000Z"),
        endDate: new Date("2021-06-07T00:40:00.000Z")
    }, {
        theatreId: 0,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-07T01:00:00.000Z"),
        endDate: new Date("2021-06-07T02:27:00.000Z")
    }, {
        theatreId: 0,
        movieId: 1,
        price: 15,
        startDate: new Date("2021-06-07T03:00:00.000Z"),
        endDate: new Date("2021-06-07T04:32:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-25T02:30:00.000Z"),
        endDate: new Date("2021-05-24T18:21:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-24T19:00:00.000Z"),
        endDate: new Date("2021-05-24T20:32:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 15,
        startDate: new Date("2021-05-24T21:00:00.000Z"),
        endDate: new Date("2021-05-24T22:51:00.000Z")
    }, {
        theatreId: 1,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-24T23:10:00.000Z"),
        endDate: new Date("2021-05-25T00:18:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 10,
        startDate: new Date("2021-05-25T00:30:00.000Z"),
        endDate: new Date("2021-05-25T02:03:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 10,
        startDate: new Date("2021-05-24T16:30:00.000Z"),
        endDate: new Date("2021-05-25T04:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 10,
        startDate: new Date("2021-05-25T04:20:00.000Z"),
        endDate: new Date("2021-05-25T05:53:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-25T16:30:00.000Z"),
        endDate: new Date("2021-05-25T18:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-25T18:30:00.000Z"),
        endDate: new Date("2021-05-25T20:03:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-05-25T20:30:00.000Z"),
        endDate: new Date("2021-05-25T22:40:00.000Z")
    }, {
        theatreId: 1,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-25T23:00:00.000Z"),
        endDate: new Date("2021-05-26T00:08:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 10,
        startDate: new Date("2021-05-26T00:30:00.000Z"),
        endDate: new Date("2021-05-26T02:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 15,
        startDate: new Date("2021-05-26T02:40:00.000Z"),
        endDate: new Date("2021-05-26T04:13:00.000Z")
    }, {
        theatreId: 1,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-26T04:40:00.000Z"),
        endDate: new Date("2021-05-26T05:48:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-26T16:30:00.000Z"),
        endDate: new Date("2021-05-26T18:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-26T18:30:00.000Z"),
        endDate: new Date("2021-05-26T20:03:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-26T20:30:00.000Z"),
        endDate: new Date("2021-05-26T22:41:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-05-26T23:00:00.000Z"),
        endDate: new Date("2021-05-27T01:10:00.000Z")
    }, {
        theatreId: 1,
        movieId: 4,
        price: 10,
        startDate: new Date("2021-05-27T01:30:00.000Z"),
        endDate: new Date("2021-05-27T02:38:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 20,
        startDate: new Date("2021-05-27T03:20:00.000Z"),
        endDate: new Date("2021-05-27T05:30:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-27T16:30:00.000Z"),
        endDate: new Date("2021-05-27T18:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-27T18:30:00.000Z"),
        endDate: new Date("2021-05-27T20:03:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-27T20:30:00.000Z"),
        endDate: new Date("2021-05-27T22:41:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-27T23:00:00.000Z"),
        endDate: new Date("2021-05-28T01:10:00.000Z")
    }, {
        theatreId: 1,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-28T01:30:00.000Z"),
        endDate: new Date("2021-05-28T02:38:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-05-28T03:20:00.000Z"),
        endDate: new Date("2021-05-28T05:30:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-28T16:10:00.000Z"),
        endDate: new Date("2021-05-28T17:43:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-28T18:00:00.000Z"),
        endDate: new Date("2021-05-28T19:32:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 5,
        startDate: new Date("2021-05-28T20:10:00.000Z"),
        endDate: new Date("2021-05-28T22:01:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-28T22:40:00.000Z"),
        endDate: new Date("2021-05-29T00:50:00.000Z")
    }, {
        theatreId: 1,
        movieId: 4,
        price: 5,
        startDate: new Date("2021-05-29T01:20:00.000Z"),
        endDate: new Date("2021-05-29T02:28:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 15,
        startDate: new Date("2021-05-29T03:20:00.000Z"),
        endDate: new Date("2021-05-29T05:11:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-29T17:00:00.000Z"),
        endDate: new Date("2021-05-29T18:33:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 10,
        startDate: new Date("2021-05-29T19:00:00.000Z"),
        endDate: new Date("2021-05-29T20:32:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-29T21:00:00.000Z"),
        endDate: new Date("2021-05-29T22:51:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-05-29T23:30:00.000Z"),
        endDate: new Date("2021-05-30T01:40:00.000Z")
    }, {
        theatreId: 1,
        movieId: 4,
        price: 10,
        startDate: new Date("2021-05-30T02:00:00.000Z"),
        endDate: new Date("2021-05-30T03:08:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 20,
        startDate: new Date("2021-05-30T03:30:00.000Z"),
        endDate: new Date("2021-05-30T05:50:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-30T17:00:00.000Z"),
        endDate: new Date("2021-05-30T18:33:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-05-30T19:00:00.000Z"),
        endDate: new Date("2021-05-30T20:32:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-30T21:00:00.000Z"),
        endDate: new Date("2021-05-30T22:51:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-05-30T23:30:00.000Z"),
        endDate: new Date("2021-05-31T01:40:00.000Z")
    }, {
        theatreId: 1,
        movieId: 4,
        price: 10,
        startDate: new Date("2021-05-31T02:00:00.000Z"),
        endDate: new Date("2021-05-31T03:08:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-05-31T03:30:00.000Z"),
        endDate: new Date("2021-05-31T05:50:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-05-31T17:00:00.000Z"),
        endDate: new Date("2021-05-31T18:33:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-05-31T19:00:00.000Z"),
        endDate: new Date("2021-05-31T20:27:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-05-31T21:00:00.000Z"),
        endDate: new Date("2021-05-31T22:51:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 10,
        startDate: new Date("2021-05-31T23:30:00.000Z"),
        endDate: new Date("2021-06-01T01:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-06-01T01:30:00.000Z"),
        endDate: new Date("2021-06-01T03:40:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 20,
        startDate: new Date("2021-06-01T04:00:00.000Z"),
        endDate: new Date("2021-06-01T05:27:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-01T16:30:00.000Z"),
        endDate: new Date("2021-06-01T18:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 5,
        startDate: new Date("2021-06-01T19:00:00.000Z"),
        endDate: new Date("2021-06-01T20:27:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-01T21:00:00.000Z"),
        endDate: new Date("2021-06-01T22:51:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-01T23:30:00.000Z"),
        endDate: new Date("2021-06-02T01:21:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-01T16:00:00.000Z"),
        endDate: new Date("2021-06-02T03:27:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 15,
        startDate: new Date("2021-06-02T04:00:00.000Z"),
        endDate: new Date("2021-06-02T05:33:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-02T17:00:00.000Z"),
        endDate: new Date("2021-06-02T18:32:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 5,
        startDate: new Date("2021-06-02T19:00:00.000Z"),
        endDate: new Date("2021-06-02T20:27:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-02T21:00:00.000Z"),
        endDate: new Date("2021-06-02T22:51:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 10,
        startDate: new Date("2021-06-02T23:30:00.000Z"),
        endDate: new Date("2021-06-03T01:03:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-02T16:00:00.000Z"),
        endDate: new Date("2021-06-03T03:27:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 15,
        startDate: new Date("2021-06-02T18:00:00.000Z"),
        endDate: new Date("2021-06-02T19:33:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-03T16:30:00.000Z"),
        endDate: new Date("2021-06-03T18:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-03T18:30:00.000Z"),
        endDate: new Date("2021-06-03T20:03:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 10,
        startDate: new Date("2021-06-03T21:00:00.000Z"),
        endDate: new Date("2021-06-03T22:27:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-03T23:00:00.000Z"),
        endDate: new Date("2021-06-04T00:51:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-04T01:10:00.000Z"),
        endDate: new Date("2021-06-04T02:37:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 20,
        startDate: new Date("2021-06-04T03:30:00.000Z"),
        endDate: new Date("2021-06-04T05:40:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-04T16:30:00.000Z"),
        endDate: new Date("2021-06-04T18:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-04T18:30:00.000Z"),
        endDate: new Date("2021-06-04T20:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 10,
        startDate: new Date("2021-06-04T21:00:00.000Z"),
        endDate: new Date("2021-06-04T22:27:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-06-04T23:00:00.000Z"),
        endDate: new Date("2021-06-05T00:51:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-05T01:10:00.000Z"),
        endDate: new Date("2021-06-05T02:37:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 15,
        startDate: new Date("2021-06-05T03:20:00.000Z"),
        endDate: new Date("2021-06-05T05:30:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-05T16:30:00.000Z"),
        endDate: new Date("2021-06-05T18:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-05T18:30:00.000Z"),
        endDate: new Date("2021-06-05T20:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-05T20:30:00.000Z"),
        endDate: new Date("2021-06-05T22:21:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-06-05T23:00:00.000Z"),
        endDate: new Date("2021-06-06T01:10:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-06T01:30:00.000Z"),
        endDate: new Date("2021-06-06T02:57:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 15,
        startDate: new Date("2021-06-06T03:30:00.000Z"),
        endDate: new Date("2021-06-06T05:03:00.000Z")
    }, {
        theatreId: 1,
        movieId: 2,
        price: 5,
        startDate: new Date("2021-06-06T16:30:00.000Z"),
        endDate: new Date("2021-06-06T18:03:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 5,
        startDate: new Date("2021-06-06T18:30:00.000Z"),
        endDate: new Date("2021-06-06T20:02:00.000Z")
    }, {
        theatreId: 1,
        movieId: 3,
        price: 10,
        startDate: new Date("2021-06-06T20:30:00.000Z"),
        endDate: new Date("2021-06-06T22:21:00.000Z")
    }, {
        theatreId: 1,
        movieId: 5,
        price: 10,
        startDate: new Date("2021-06-06T23:00:00.000Z"),
        endDate: new Date("2021-06-07T01:10:00.000Z")
    }, {
        theatreId: 1,
        movieId: 6,
        price: 15,
        startDate: new Date("2021-06-07T01:30:00.000Z"),
        endDate: new Date("2021-06-07T02:57:00.000Z")
    }, {
        theatreId: 1,
        movieId: 1,
        price: 15,
        startDate: new Date("2021-06-07T03:30:00.000Z"),
        endDate: new Date("2021-06-07T05:02:00.000Z")
    }
];

@Injectable()
export class Service {
	getTheatreData() {
		return theatreData;
	}
    getMoviesData() {
		return moviesData;
	}
    getData() {
        return data;
    }
}
