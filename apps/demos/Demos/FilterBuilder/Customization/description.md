In this demo, a custom filter operation, *"anyof"*, is implemented. The [calculateFilterExpression](/Documentation/ApiReference/UI_Components/dxFilterBuilder/Configuration/customOperations/#calculateFilterExpression) function converts it into **DataSource**-compatible operations. The compatible and incompatible filter expressions are displayed under the FilterBuilder.

The set of available group operations is limited to *"and"* and *"or"* using the [groupOperations](/Documentation/ApiReference/UI_Components/dxFilterBuilder/Configuration/#groupOperations) array, and the groups&rsquo; maximum nesting level is limited to one using the
[maxGroupLevel](/Documentation/ApiReference/UI_Components/dxFilterBuilder/Configuration/#maxGroupLevel).
<!--split-->