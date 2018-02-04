define(['app'], function (app) {
    
    app.filter('text', function ($rootScope, $timeout) {
        return function (key, value) {

            if (key == undefined) {
                return value;
            }

            var result = "";

            if (key == "Dept") {
                result = $rootScope.deptNames[value];
            } else {
                result = $rootScope.baseEnum[$rootScope.currentBusiness.Key][value];
            }

            if (result == undefined) {
                return value
            }

            return result;
        };
    });
});