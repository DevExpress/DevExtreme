import Widget from '@js/ui/widget/ui.widget';

class WidgetObserver<T> extends Widget<T> {
  notifyObserver(subject, args) {
    const observer = this.option('observer') as any;

    if (observer) {
      observer.fire(subject, args);
    }
  }

  invoke() {
    const observer = this.option('observer') as any;

    if (observer) {
      return observer.fire.apply(observer, arguments);
    }
  }
}

export default WidgetObserver;
