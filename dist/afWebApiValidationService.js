'use strict';
(function ( window, angular, undefined ) {
    var webValidationService = angular.module('WebValidationModule', []);
    webValidationService.provider('afWebApiValidationService', function () {

        this.$get = [function() {
            return {
                defaultModel: function() {
                    return {
                        attemptedSave: false,
                        status: 200,
                        message: null,
                        isModelError: false,
                        errors: null,
                        errorList: null,
                        data: null,
                        savedSuccessfully: false
                    };
                },
                handleSuccess: function (response) {
                    return {
                        status: 200,
                        attemptedSave: true,
                        message: response.message,
                        isModelError: false,
                        savedSuccessfully: true,
                        data: response.data,
                        errors: null,
                        errorList: null
                    };

                },
                handleError: function (response) {
                    var result;
                    if (response.status == 400 && response.data !== undefined) {
                        // modelstate error
                        result = {
                            attemptedSave: true,
                            status: response.status,
                            message: response.data.Message,
                            isModelError: true,
                            savedSuccessfully: false,
                            data: null,
                            errors: {

                            },
                            errorList: []
                        };

                        for (var propertyName in response.data.ModelState) {
                            if (propertyName.indexOf('model.') === 0 || propertyName === '') {
                                var key = propertyName.substring(6);
                                var messages = response.data.ModelState[propertyName];
                                result.errors[key] = messages;
                                angular.forEach(messages, function (value) {
                                    result.errorList.push(value);
                                });
                            }
                        }
                    } else {
                        // not a modelstate error
                        result = {
                            attemptedSave: true,
                            status: response.status,
                            message: response.statusText,
                            isModelError: false,
                            savedSuccessfully: false,
                            data: null,
                            errors: {
                                "": "Unexpected error: " + response.statusText
                            },
                            errorList: ["Unexpected error: " + response.statusText]
                        };
                    }
                    return result;
                }
            };
        }];
    });
})(window, window.angular);