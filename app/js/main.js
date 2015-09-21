'use strict';

var fireTicToeApp = angular.module("fireTicToeApp", ["firebase", "fireTicToeApp2"]);
//console.debug(domain);
var user = {
    uid: null,
    id: 0
};

fireTicToeApp.controller("mainController", ['$scope', 'domain', '$firebaseAuth', function ($scope, domain, $firebaseAuth) {

    var ref = new Firebase("https://glowing-inferno-9282.firebaseio.com");
    $scope.authObj = $firebaseAuth(ref);

    $scope.login = function (email) {
        $scope.authObj.$authWithPassword({
            email: email,
            password: "1"
        }).then(function (authData) {
            console.log("Logged in as:", authData.uid);
            loadUser(authData);
        }).catch(function (error) {
            console.error("Authentication failed:", error);
        });
    };

    var loadUser = function (authData) {
        if (authData == null) {
            $scope.user == null;
            return;
        }

        user.uid = authData.uid;
        user.id = domain.getPlayerId(user.uid);
        $scope.user = user;
    };
    loadUser($scope.authObj.$getAuth());

    $scope.cell = function (i, j) {
        //console.debug(domain.getVal(i,j));
        return domain.getVal(i, j);
    };
    $scope.move = function (i, j) {
        if (user == null)
            return;

        if (user.id == 0) {
            user.id = domain.getPlayerId(user.uid);
        }

        if (user.id == 0)
            return;
        console.log('moving: ' + i + ',' + j)
        domain.setVal(i, j, user.id);
    };
}
]);