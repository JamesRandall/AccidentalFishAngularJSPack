angular.module('afServerValidation', []).directive('afServerValidation', function() {
    var d = {
        restrict: 'E',
        templateUrl: '/views/templates/afServerValidation.html',
        scope: {
            result: '=key'
        },
    }
    
    return d;
});