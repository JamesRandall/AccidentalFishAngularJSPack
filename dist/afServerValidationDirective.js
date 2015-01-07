angular.module('afServerValidation', []).directive('afServerValidation', function() {
    var d = {
        restrict: 'E',
        templateUrl: '/app/accidentalfishAngularJs/templates/afServerValidation.html',
        scope: {
            result: '=key'
        },
    }
    
    return d;
});