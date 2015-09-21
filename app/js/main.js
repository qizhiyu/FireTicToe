'use strict';

var fireTicToeApp = angular.module("fireTicToeApp", ["firebase", "fireTicToeApp2"]);
//console.debug(domain);
var user = {
    uid: null,
    id: 0
};

fireTicToeApp.controller("mainController", ['$scope', 'domain', '$firebaseAuth', '$interval',
    function ($scope, domain, $firebaseAuth, $interval) {
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

        //load username
        var stop;
        loadUser($scope.authObj.$getAuth());

        //in Autologin case, waiting for players list in domain get ready
        if (user.uid != null && user.id == 0) {
            stop = $interval(function () {
                loadUser($scope.authObj.$getAuth());
                if (user.id > 0) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            }, 1000);
        }

        $scope.getUserName = function () {
            if (user == null)
                return "Please login";

            switch (user.id) {
                case 2: return "Dad";
                case 1: return "Guo";
                default:
                    return "Loading...";
            }
        };

        $scope.cell = function (i, j) {
            return domain.getVal(Math.floor(i), j);
        };

        var gameEnd = function (winnerId, id) {
            if (id == 0 || winnerId == 0)
                return;
            var message = '';
        
            switch(winnerId){
                case -1:
                    message = 'Deuce! Have another try.';
                    break;
                default:
                    message = (winnerId == id)? 'Congratulations! You win this game.':'Sorry! You lose this game.';
            }
            BootstrapDialog.show({
                title: 'Game end',
                message: message + '\nGame will reset in 10 seconds..',
                buttons: [{
                    label: 'Close',
                    action: function (dialogItself) {
                        dialogItself.close();
                    }
                }]
            });
        };

        $scope.move = function (i, j) {
            if (user == null || user.id == 0)
                return;
            if (!domain.isMyTurn(user.id))
                return;

            console.log('moving: ' + i + ',' + j)
            domain.setVal(i, j, user.id);
            gameEnd(domain.getWinnerId(), user.id);
        };

        $scope.isMyTurn = function () {
            if (user == null || user.id == 0)
                return false;
            return domain.isMyTurn(user.id);
        };
        $scope.getWinnerId = function () {
            return domain.getWinnerId();
        };
    }
]);