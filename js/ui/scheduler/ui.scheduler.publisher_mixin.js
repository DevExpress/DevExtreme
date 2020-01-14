const publisherMixin = {
    notifyObserver: function(subject, args) {
        const observer = this.option('observer');
        if(observer) {
            observer.fire(subject, args);
        }
    },
    invoke: function() {
        const observer = this.option('observer');

        if(observer) {
            return observer.fire.apply(observer, arguments);
        }
    }
};
module.exports = publisherMixin;
