var wifiModule = angular.module('wifiModule', [])
wifiModule.directive('fileModel', ['$parse', function ($parse) {
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

//angular.module('wifiModule')  //Notice remove []
//  .directive("angularjs-datetime-picker", function () {
//  });

wifiModule.filter('start', function () {
    return function (input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

wifiModule.directive('dateInput', function(){
    return {
        restrict : 'A',
        scope : {
            ngModel : '='
        },
        link: function (scope) {
            if (scope.ngModel) scope.ngModel = new Date(scope.ngModel);
        }
    }
});
wifiModule.filter('capitalize', function () {
    return function (input, scope) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});
wifiModule.filter('textdisplay', function () {
    return function(input) {
        if (input != null) {
            return input.replace(/(\n|\r|\r\n)/g, '<br>');
        }
    }
});

wifiModule.filter('utcToLocal', Filter);
function Filter($filter) {
    return function (utcDateString, format) {
        if (!utcDateString) {
            return;
        }

        // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
        //if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
            utcDateString += 'Z';
        //}

        return $filter('date')(utcDateString, format);
    };
}


//wifiModule.run(function ($http) {
//    var token = localStorage.getItem('hdncptoken');
//    alert("Module Run");
//    alert()
//    $http.defaults.headers.common.Authorization = 'Basic' + " " + token;
//});

//wifiModule.config(function ($httpProvider) {
//    $httpProvider.defaults.common['Authorization'] = localStorage.getItem('hdncptoken');
//    // For angular 1.5, use:  
//    // $httpProvider.defaults.headers.common['Authorization'] = token;        
//});

angular.module('wifiModule').run(function ($http) {
    if (localStorage.getItem('hdncptoken'))
        $http.defaults.headers.common['Auth-Token'] = 'Bearer' + " " + localStorage.getItem('hdncptoken').toString();
    }
);

wifiModule.run(function ($http) {
    if (localStorage.getItem('hdncptoken'))
    $http.defaults.headers.common.Authorization = 'Bearer' + " " + localStorage.getItem('hdncptoken').toString();
});

wifiModule.config(function ($provide) {
    $provide.decorator('$exceptionHandler', function ($delegate) {
        return function (exception, cause) {
            $delegate(exception, cause);
            toastr.error('Some Error occurred! Please contact admin.');
        };
    });
});

wifiModule.directive('loading', ['$http', function ($http)
{  
    return {  
        restrict: 'A',  
        template: '<div id="ajaxSpinnerContainer"><img src="/build/images/loading.gif" /> </div>',
        link: function (scope, elm, attrs)  
        {  
            scope.isLoading = function () {  
                return $http.pendingRequests.length > 0;  
            };  
  
            scope.$watch(scope.isLoading, function (v)  
            {  
                if(v){  
                    elm.show();  
                }else{  
                    elm.hide();  
                }  
            });  
        }  
    };  
}])  