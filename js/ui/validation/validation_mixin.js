const VALIDATION_STATUS_VALID = "valid",
    VALIDATION_STATUS_INVALID = "invalid",
    VALIDATION_STATUS_PENDING = "pending";

const ValidationMixin = {
    _findGroup() {
        let group = this.option("validationGroup"),
            $dxGroup;

        if(!group) {
            // try to find out if this control is child of validation group
            $dxGroup = this.$element().parents(".dx-validationgroup").first();
            if($dxGroup.length) {
                group = $dxGroup.dxValidationGroup("instance");
            } else {
                // Trick to be able to securely get ViewModel instance ($data) in Knockout
                group = this._modelByElement(this.$element());
            }
        }

        return group;
    },

    _initValidationOptions(options) {
        if(options) {
            const syncOptions = ["isValid", "validationStatus", "validationError", "validationErrors"];
            syncOptions.forEach((prop) => {
                if(prop in options) {
                    this._synchronizeValidationOptions({ name: prop, value: options[prop] });
                }
            });
        }
    },

    _synchronizeValidationOptions({ name, value }) {
        if(name === "validationStatus") {
            const isValid = value === VALIDATION_STATUS_VALID || value === VALIDATION_STATUS_PENDING;
            this.option("isValid") !== isValid && this.option("isValid", isValid);
            return;
        }
        if(name === "isValid") {
            const validationStatus = this.option("validationStatus");
            let newStatus = validationStatus;
            if(value && validationStatus === VALIDATION_STATUS_INVALID) {
                newStatus = VALIDATION_STATUS_VALID;
            } else if(!value && validationStatus !== VALIDATION_STATUS_INVALID) {
                newStatus = VALIDATION_STATUS_INVALID;
            }
            newStatus !== validationStatus && this.option("validationStatus", newStatus);
            return;
        }

        if(name === "validationErrors") {
            let validationError = !value || !value.length ? null : value[0];
            this.option("validationError") !== validationError && this.option("validationError", validationError);
            return;
        }
        if(name === "validationError") {
            const validationErrors = this.option("validationErrors");
            if(!value && validationErrors) {
                this.option("validationErrors", null);
            } else if(value && !validationErrors) {
                this.option("validationErrors", [value]);
            } else if(value && validationErrors && value !== validationErrors[0]) {
                validationErrors[0] = value;
                this.option("validationErrors", validationErrors.slice());
            }
        }
    }
};

module.exports = ValidationMixin;
