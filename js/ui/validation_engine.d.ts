import '../jquery_augmentation';

import {
    dxValidationGroupResult
} from './validation_group';

/**
 * @docid validationEngine
 * @section Core
 * @namespace DevExpress
 * @module ui/validation_engine
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class validationEngine {
    /**
     * @docid validationEngine.getGroupConfig
     * @section Core
     * @publicName getGroupConfig()
     * @return object
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static getGroupConfig(): any;
    /**
     * @docid validationEngine.getGroupConfig
     * @section Core
     * @publicName getGroupConfig(group)
     * @param1 group:string|object
     * @return object
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static getGroupConfig(group: string | any): any;
    /**
     * @docid validationEngine.registerModelForValidation
     * @publicName registerModelForValidation(model)
     * @param1 model:object
     * @static
     * @prevFileNamespace DevExpress.integration
     * @public
     */
    static registerModelForValidation(model: any): void;
    /**
     * @docid validationEngine.resetGroup
     * @section Core
     * @publicName resetGroup()
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static resetGroup(): void;
    /**
     * @docid validationEngine.resetGroup
     * @section Core
     * @publicName resetGroup(group)
     * @param1 group:string|object
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static resetGroup(group: string | any): void;
    /**
     * @docid validationEngine.unregisterModelForValidation
     * @publicName unregisterModelForValidation(model)
     * @param1 model:object
     * @static
     * @prevFileNamespace DevExpress.integration
     * @public
     */
    static unregisterModelForValidation(model: any): void;
    /**
     * @docid validationEngine.validateGroup
     * @section Core
     * @publicName validateGroup()
     * @return dxValidationGroupResult
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static validateGroup(): dxValidationGroupResult;
    /**
     * @docid validationEngine.validateGroup
     * @section Core
     * @publicName validateGroup(group)
     * @param1 group:string|object
     * @return dxValidationGroupResult
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static validateGroup(group: string | any): dxValidationGroupResult;
    /**
     * @docid validationEngine.validateModel
     * @publicName validateModel(model)
     * @param1 model:object
     * @return object
     * @static
     * @prevFileNamespace DevExpress.integration
     * @public
     */
    static validateModel(model: any): any;
}
