import Widget from '../../widget/ui.widget';

class WidgetObserver extends Widget {
    notifyObserver(subject, args) {
        const observer = this.option('observer');
        if(observer) {
            observer.fire(subject, args);
        }
    }

    invoke() {
        const observer = this.option('observer');

        if(observer) {
            return observer.fire.apply(observer, arguments);
        }
    }
}

export default WidgetObserver;
