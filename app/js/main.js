'use strict';

var fireTicToeApp = angular.module("fireTicToeApp", ["firebase", "fireTicToeApp2"]);
//console.debug(domain);

fireTicToeApp.controller("mainController", ['$scope', 'domain', function ($scope, domain) {
    $scope.cell = function (i, j) {
        //console.debug(domain.getVal(i,j));
        return domain.getVal(i, j);
    };
    $scope.move = function (i, j) {
        console.log('moving: ' + i + ',' + j)
        var playerid = 1;
        domain.setVal(i, j, playerid);
    };
}
]);