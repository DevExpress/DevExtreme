/* tslint:disable:max-line-length */

import { <#= it.baseClass #> } from '<#= it.basePath #>';
import {
    Component,
} from '@angular/core';

<#? it.imports #><#~ it.imports :file #>import <#= file.importString #> from '<#= file.path #>';
<#~#><#?#>
@Component({
    template: ''
})
export abstract class <#= it.className #> extends <#= it.baseClass #> {<#~ it.properties :prop:i #>
    get <#= prop.name #>(): <#= prop.type #> {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: <#= prop.type #>) {
        this._setOption('<#= prop.name #>', value);
    }
<#~#>}
