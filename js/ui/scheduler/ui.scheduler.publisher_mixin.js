var publisherMixin = {
    notifyObserver: function(subject, args) {
        var observer = this.option('observer');
        if(observer) {
            observer.fire(subject, args);
        }
    },
    invoke: function() {
        var observer = this.option('observer');

        if(observer) {
            return observer.fire.apply(observer, arguments);
        }
    }
};
module.exports = publisherMixin;
