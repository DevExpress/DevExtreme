export default class Semaphore {
    constructor() {
        this.counter = 0;
    }

    isFree() {
        return this.counter === 0;
    }

    take() {
        this.counter++;
    }

    release() {
        this.counter--;
        if(this.counter < 0) {
            this.counter = 0;
        }
    }
}
