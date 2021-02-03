/* tslint:disable:max-line-length */

import { <#= it.baseClass #> } from '<#= it.basePath #>';

<#? it.imports #><#~ it.imports :file #>import <#= file.importString #> from '<#= file.path #>';
<#~#><#?#>
export abstract class <#= it.className #> extends <#= it.baseClass #> {<#~ it.properties :prop:i #>
    get <#= prop.name #>(): <#= prop.type #> {
        return this._getOption('<#= prop.name #>');
    }
    set <#= prop.name #>(value: <#= prop.type #>) {
        this._setOption('<#= prop.name #>', value);
    }
<#~#>}
