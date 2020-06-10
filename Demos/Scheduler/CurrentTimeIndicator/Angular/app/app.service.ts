import { Injectable } from "@angular/core";

export class Appointment {
    startDate: Date;
    endDate: Date;
    movieId: number;
    recurrenceRule?: string;
}

export class MovieData {
    id: number;
    text: string;
    image: string;
}

let today = new Date();
today.setHours(0, 0, 0, 0);
today.setDate(today.getDate() - today.getDay() + 3);

let appointments: Appointment[] = [
    {
        movieId: 1,
        startDate: new Date(today.getTime() - 113.5 * 3600000),
        endDate: new Date(today.getTime() - 111.5 * 3600000),
        recurrenceRule: "FREQ=HOURLY;INTERVAL=15;COUNT=15"
    }, {
        movieId: 2,
        startDate: new Date(today.getTime() - 110.5 * 3600000),
        endDate: new Date(today.getTime() - 108.5 * 3600000),
        recurrenceRule: "FREQ=HOURLY;INTERVAL=15;COUNT=15"
    }, {
        movieId: 3,
        startDate: new Date(today.getTime() - 106.5 * 3600000),
        endDate: new Date(today.getTime() - 104.5 * 3600000),
        recurrenceRule: "FREQ=HOURLY;INTERVAL=15;COUNT=15"
    }, {
        movieId: 4,
        startDate: new Date(today.getTime() - 104 * 3600000),
        endDate: new Date(today.getTime() - 102 * 3600000),
        recurrenceRule: "FREQ=HOURLY;INTERVAL=15;COUNT=15"
    }, {
        movieId: 5,
        startDate: new Date(today.getTime() - 101 * 3600000),
        endDate: new Date(today.getTime() - 99 * 3600000),
        recurrenceRule: "FREQ=HOURLY;INTERVAL=15;COUNT=15"
    }
];

let moviesData: MovieData[] = [{
    id: 1,
    text: "His Girl Friday",
    image: "../../../../images/movies/HisGirlFriday.jpg"
}, {
    id: 2,
    text: "Royal Wedding",
    image: "../../../../images/movies/RoyalWedding.jpg"
}, {
    id: 3,
    text: "A Star Is Born",
    image: "../../../../images/movies/AStartIsBorn.jpg"
}, {
    id: 4,
    text: "The Screaming Skull",
    image: "../../../../images/movies/ScreamingSkull.jpg"
}, {
    id: 5,
    text: "It's a Wonderful Life",
    image: "../../../../images/movies/ItsAWonderfulLife.jpg"
}];

@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }

    getMoviesData(): MovieData[] {
        return moviesData;
    }
}
