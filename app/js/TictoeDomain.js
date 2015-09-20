angular.module("fireTicToeApp", [])
	.factory("TictoeDomain", function () {
	    var ref = new Firebase("https://glowing-inferno-9282.firebaseio.com//tictoe/game1/");
	    var game = ref.game();
	    var board = [];

	    var populateBoard = function () {
	        board = [];
	        for (var i = 0; i < 3; i++) {
	            var row = [];
	            for (var j = 0; j < 3; j++) {
	                row.push(game[i][j]);
	            }
	            board.push(row);
	        }
	    };

        //return winner id (1,2), 0 if not finished, -1 due
	    var winnerId = function () {
	        var found = true;

	        //vertical
	        for (var i = 0; i < 3; i++) {
	            found = true;
	            for (var j = 1; j < 3; j++) {
	                if (board[i][j - 1] != board[i][j]) {
	                    found = false;
	                    break;
	                }
	                if (board[i][j] == 0) {
	                    found = false;
	                    break;
	                }
	            }
	            if (found) {
	                return board[i][0];
	            }
	        }

	        //horizontal
	        for (var i = 1; i < 3; i++) {
	            found = true;
	            for (var j = 0; j < 3; j++) {
	                if (board[j][i - 1] != board[j][i]) {
	                    found = false;
	                    break;
	                }
	                if (board[j][i] == 0) {
	                    found = false;
	                    break;
	                }
	            }
	            if (found) {
	                return board[0][j];
	            }
	        }

	        //cross
	        found = true;
	        for (var j = 1; j < 3; j++) {
	            if (board[j-1][j - 1] != board[j][j]) {
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
	            if (board[j - 1][3-j] != board[j][2-j]) {
	                found = false;
	                break;
	            }
	            if (board[j][2-j] == 0) {
	                found = false;
	                break;
	            }
	        }
	        if (found) {
	            return board[0][2];
	        }

	        var finished = true;
	        for (var i = 0; i < 3; i++) {
	            for (var j = 1; j < 3; j++) {
	                if (board[i][j] == 0) {
	                    finished = false;
	                    break;
	                }
	            }
	            if (!finished)
	                break;
	        }
	        return finished?-1:0;
	    };


	    var prepareReset = function () {
	        console.log('preparing to reset in ~15 sec..');
	        $timeout(function () {
	            console.log('resetting..');
	            for (var i = 0; i < 3; i++) {
	                for (var j = 0; j < 3; j++) {
	                    game[i][j] = 0;
	                }
	            }
	            game.$save();
	            populateBoard();
	        }, 10 * 1000 + Math.random() * 10);
	    };

	    var boardChanged = function () {
	        console.log('boardChanged');

	        if (isFinished()) {
	            prepareReset();
	        }
	    };

	    var init = function () {
	        populateBoard();
	        sudoku.$watch(boardChanged);
	        if (isFinished()) {
	            prepareReset();
	        }
	    };

	    init();
	});