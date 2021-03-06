﻿'use strict';

angular.module("fireTicToeApp2", ["firebase"])
	.factory("domain", ['$firebaseArray', '$firebaseObject', '$timeout', function ($firebaseArray,$firebaseObject, $timeout) {
	    var ref = new Firebase("https://glowing-inferno-9282.firebaseio.com/tictoe/");

	    var remoteBoard = $firebaseObject(ref.child("game1").child('board'));
	    //console.debug(remoteBoard);
	    var players = $firebaseArray(ref.child("player"));

	    var board = [];
	    var resetting = false;
	    var createBoard = function () {
	        if (typeof (remoteBoard[0]) == 'undefined') {
	            reset();
	        }
	    }

	    var reset = function () {
	        for (var i = 0; i < 3; i++) {
	            remoteBoard[i] = {};
	            for (var j = 0; j < 3; j++) {
	                remoteBoard[i][j] = 0;
	            }
	            remoteBoard.$save();
	        }
	    }

	    var populateBoard = function () {
	        board = [];
	        for (var i = 0; i < 3; i++) {
	            var row = [];
	            for (var j = 0; j < 3; j++) {
	                row.push(remoteBoard[i][j]);
	            }
	            board.push(row);
	        }
	    };

	    //return winner id (1,2), 0 if not finished, -1 Deuce
	    var winnerId = function () {
	        var found = true;

	        //horizontal
	        for (var i = 0; i < 3; i++) {
	            found = true;
	            for (var j = 1; j < 3; j++) {
	                if (board[i][j] == 0) {
	                    found = false;
	                    break;
	                }
	                if (board[i][j - 1] != board[i][j]) {
	                    found = false;
	                    break;
	                }
	            }
	            if (found) {
	                return board[i][0];
	            }
	        }

	        //vertical
	        for (var i = 0; i < 3; i++) {
	            found = true;
	            for (var j = 1; j < 3; j++) {
	                if (board[j][i] == 0) {
	                    found = false;
	                    break;
	                }
	                if (board[j-1][i] != board[j][i]) {
	                    found = false;
	                    break;
	                }
	            }
	            if (found) {
	                return board[0][i];
	            }
	        }

	        //cross
	        found = true;
	        for (var j = 1; j < 3; j++) {
	            if (board[j - 1][j - 1] != board[j][j]) {
	                found = false;
	                break;
	            }
	            if (board[j][j] == 0) {
	                found = false;
	                break;
	            }
	        }
	        if (found) {
	            return board[0][0];
	        }

	        found = true;
	        for (var j = 1; j < 3; j++) {
	            if (board[j - 1][3 - j] != board[j][2 - j]) {
	                found = false;
	                break;
	            }
	            if (board[j][2 - j] == 0) {
	                found = false;
	                break;
	            }
	        }
	        if (found) {
	            return board[0][2];
	        }

            //check deuce
	        var finished = true;
	        for (var i = 0; i < 3; i++) {
	            for (var j = 0; j < 3; j++) {
	                if (board[i][j] == 0) {
	                    finished = false;
	                    break;
	                }
	            }
	            if (!finished)
	                break;
	        }
	        return finished ? -1 : 0;
	    };

	    var sp = {
	        getVal: function (i, j) {
	            if (typeof (board[i]) == 'undefined')
	                return '';
	            return board[i][j];
	        },
	        setVal: function (i, j, v) {
	            if (typeof (board[0]) == 'undefined')
	                return;
	            if (resetting)
	                return;

	            var val = sp.getVal(i, j);
	            if (val > 0 || v > 2) {
	                return;
	            }

	            board[i][j] = v;
	            remoteBoard[i] = remoteBoard[i] || {};
	            remoteBoard[i][j] = v;
	            remoteBoard.$save();
	        },
	        getPlayerId: function (uid) {
	            for (var i = 0 ; i < players.length; i++) {
	                if (players[i].Uid == uid)
	                    return i + 1;
	            };
	            return 0;
	        },
	        isMyTurn: function (id) {
	            var sum = 0;
	            for (var i = 0; i < 3; i++)
	                for (var j = 0; j < 3; j++)
	                    sum += remoteBoard[i][j];

	            //console.log(sum);
	            return sum % 3 == (id-1);
	        },
	        getWinnerId: function () {
	            return winnerId();
	        }

	    };

	    var isFinished = function () {
	        return (winnerId() != 0);
	    };

	    //reset game with all cells as 0 
	    var prepareReset = function () {
            //using transaction to avoid dupcliated resetting
	        var refReset = new Firebase("https://glowing-inferno-9282.firebaseio.com/tictoe/game1/state");
	        $firebaseObject(refReset).$loaded().then(function () {
	            refReset.transaction(function (currentData) {
	                console.log("currentData" , currentData);
	                if (currentData != null && currentData != 1) {
	                    return 1;
	                }
	                else {
	                    console.log("resetting already started");
	                    return;
	                }
	            }, function (error, committed, snapshot) {
	                if (error) {
	                    console.log('Transaction failed abnormally!', error);
	                } else if (!committed) {
	                    console.log('We aborted the transaction (because 1 already exists).');
	                } else {
	                    console.log('preparing to reset in 10 sec..');
	                    $timeout(function () {
	                        console.log('resetting..');
	                        reset();
	                        populateBoard();
	                        refReset.transaction(function () {
	                            return "0";
	                        });
	                    }, 10 * 1000);
	                }
	                console.log("data: ", snapshot.val());
	            });
	        });
	    };

	    var boardChanged = function () {
	        console.log('boardChanged');
	        populateBoard();

	        if (isFinished()) {
	            prepareReset();
	        }
	    };

	    var init = function () {
	        console.log("loaded");
	        createBoard();
	        populateBoard();
	        remoteBoard.$watch(boardChanged);
	        if (isFinished()) {
	            prepareReset();
	        }
	    };

	    remoteBoard.$loaded(init, function(error) {
	        console.error("Error:", error);
	    });

	    return sp;
	}]);