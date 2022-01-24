import './ui.stub.secondary';
import registerComponent from './registrator';

registerComponent('hello', {});

class cls_ui_stub {
    fn_ui_stub() {
        console.log('fn.ui.stub.log');
    }
}

function useless_ui_stub() {
    console.log('useless_ui_stub.log');
}

const useles_arr_ui_stub = [];

export default cls_ui_stub;
