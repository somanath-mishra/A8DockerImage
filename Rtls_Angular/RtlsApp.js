var RtlsModule = angular.module('RtlsModule', []);
RtlsModule.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
angular.module('RtlsModule').run(function ($http) {
    if (localStorage.getItem('hdnrtlstoken'))
        $http.defaults.headers.common['Auth-Token'] = 'Bearer' + " " + localStorage.getItem('hdnrtlstoken').toString();
});
RtlsModule.run(function ($http) {
    if (localStorage.getItem('hdnrtlstoken'))
    $http.defaults.headers.common.Authorization = 'Bearer' + " " + localStorage.getItem('hdnrtlstoken').toString();
});





