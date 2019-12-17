const assert = require('chai').assert;
const LessTemplateLoader = require('../modules/less-template-loader');
const lessCompiler = require('less/lib/less-node');

const metadata = [ {
    'Name': '10. Text color',
    'Key': '@base-text-color',
}, {
    'Name': '20. Base background color',
    'Key': '@base-bg',
}, {
    'Key': '@datagrid-base-color'
}, {
    'Key': '@treelist-base-color'
}];


const emptyHeader = () => { return ''; };

describe('Migration LessTemplateLoader', () => {

    it('compileLess', () => {
        let config = {
            isBootstrap: false,
            lessCompiler: lessCompiler,
            outColorScheme: 'my-custom',
            makeSwatch: true,
        };

        let less = `
        div { color: @base-bg; }
        div { color: @base-text-color; }
        .dx-datagrid {
            color: @datagrid-base-color;
        }
        .dx-treelist {
            color: @treelist-base-color;
        }`;

        let metadataVariables = {};

        metadata.forEach(metaItem => {
            metadataVariables[metaItem.Key.replace('@', '')] = metaItem.Key;
        });

        let lessTemplateLoader = new LessTemplateLoader(config);
        lessTemplateLoader._makeInfoHeader = emptyHeader;
        return lessTemplateLoader.compileLess(less, {
            'base-bg': '#fff',
            'base-text-color': '#000',
            'datagrid-base-color': 'red',
            'treelist-base-color': 'green'
        }, metadataVariables).then(data => {
            assert.equal(data.css, `.dx-swatch-my-custom div {
  color: #fff;
}
.dx-swatch-my-custom div {
  color: #000;
}
.dx-swatch-my-custom .dx-datagrid {
  color: red;
}
.dx-swatch-my-custom .dx-treelist {
  color: green;
}

`);
        });
    });
});
