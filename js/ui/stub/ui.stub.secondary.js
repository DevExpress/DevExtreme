import registerComponent from './registrator';

class cls_ui_stub_secondary {
    fn_ui_stub_secondary() {
        console.log('ui.stub.secondary.log');
    }
}

function useless_ui_stub_secondary() {
    console.log('useless_ui_stub_secondary.log');
}

const useles_arr_ui_stub_secondary = [];

registerComponent('ui.stub.secondary', cls_ui_stub_secondary);

export default cls_ui_stub_secondary;
