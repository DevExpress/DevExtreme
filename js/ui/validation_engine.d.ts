import {
    dxValidationGroupResult
} from './validation_group';

/**
 * @docid
 * @section Core
 * @namespace DevExpress
 * @module ui/validation_engine
 * @export default
 * @public
 */
export default class validationEngine {
    /**
     * @docid
     * @section Core
     * @publicName getGroupConfig()
     * @return object
     * @static
     * @public
     */
    static getGroupConfig(): any;
    /**
     * @docid
     * @section Core
     * @publicName getGroupConfig(group)
     * @param1 group:string|object
     * @return object
     * @static
     * @public
     */
    static getGroupConfig(group: string | any): any;
    /**
     * @docid
     * @publicName registerModelForValidation(model)
     * @param1 model:object
     * @static
     * @public
     */
    static registerModelForValidation(model: any): void;
    /**
     * @docid
     * @section Core
     * @publicName resetGroup()
     * @static
     * @public
     */
    static resetGroup(): void;
    /**
     * @docid
     * @section Core
     * @publicName resetGroup(group)
     * @param1 group:string|object
     * @static
     * @public
     */
    static resetGroup(group: string | any): void;
    /**
     * @docid
     * @publicName unregisterModelForValidation(model)
     * @param1 model:object
     * @static
     * @public
     */
    static unregisterModelForValidation(model: any): void;
    /**
     * @docid
     * @section Core
     * @publicName validateGroup()
     * @return dxValidationGroupResult
     * @static
     * @public
     */
    static validateGroup(): dxValidationGroupResult;
    /**
     * @docid
     * @section Core
     * @publicName validateGroup(group)
     * @param1 group:string|object
     * @return dxValidationGroupResult
     * @static
     * @public
     */
    static validateGroup(group: string | any): dxValidationGroupResult;
    /**
     * @docid
     * @publicName validateModel(model)
     * @param1 model:object
     * @return object
     * @static
     * @public
     */
    static validateModel(model: any): any;
}
