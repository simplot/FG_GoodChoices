var app = angular.module('FallHarvestApp', []);

///////////////////////////////////////////////////////////////////////////////

app.controller('FallHarvestController', function($scope) {
    var vm = this;

    $scope.$on('someName', function(event) {
        console.log('event fired:', event);
    });
});

///////////////////////////////////////////////////////////////////////////////

// put emit-on-update="someName" on an ng-repeat and it will fire someName
// after the DOM settles down from rendering
app.directive('emitOnUpdate', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.emitOnUpdate);
                });
            }
        }
    }
});
