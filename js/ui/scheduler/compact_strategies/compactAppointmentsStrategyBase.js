import translator from "../../../animation/translator";

export class CompactAppointmentsStrategyBase {
    render(options, instance) {
        this.instance = instance;

        return this.renderCore(options);
    }

    renderCore(options) {

    }

    repaintExisting() {

    }


    setPosition(element, position) {
        translator.move(element, {
            top: position.top,
            left: position.left
        });
    }
}
