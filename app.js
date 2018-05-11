var app = angular.module('game', []);

app.controller('GameController', ['$scope', function ($scope) {

    $scope.whoWins = function (userClick) {
        var computerChoice = getRand();
        computerChoice = allGamePieces[computerChoice];
        var userChoice = allGamePieces[userClick];
        comparePieces(userChoice, computerChoice);
    };

    $scope.userScore = 0;
    $scope.compScore = 0;
    $scope.tieScore = 0;

    function gamePiece(type, beats, losesTo, picture) {
        this.type = type;
        this.beats = beats;
        this.losesTo = losesTo;
        this.picture = picture;
    };

    //    pre-defined rules for default rock-paper-scissors
    var rock = new gamePiece("rock", ["paper"], ["scissors", "hammer", "dynamite"], "img/rock.png");
    var paper = new gamePiece("paper", ["scissors", "hammer"], ["rock", "dynamite"], "img/paper.png");
    var scissors = new gamePiece("scissors", ["rock"], ["paper", "hammer", "dynamite"], "img/scissors.jpg");
    var hammer = new gamePiece("hammer", ["scissors", "rock"], ["paper", "dynamite"], "img/hammer.png");
    var dynamite = new gamePiece("dynamite", ["scissors", "rock", "paper", "hammer"], [], "img/dynamite.png");

    var resetAllGamePieces = [];
    var allGamePieces = [];
    allGamePieces[rock.type] = rock;
    allGamePieces[paper.type] = paper;
    allGamePieces[scissors.type] = scissors;
    allGamePieces[hammer.type] = hammer;
    allGamePieces[dynamite.type] = dynamite;
    
    resetAllGamePieces = allGamePieces;

    // input objects
    var possibleGamePieces = ["rock", "paper", "scissors", "hammer", "dynamite"];
    var rockInput = new gamePiece("rock", new Array(), new Array(), "img/rock.png");
    var paperInput = new gamePiece("paper", new Array(), new Array(), "img/paper.png");
    var scissorsInput = new gamePiece("scissors", new Array(), new Array(), "img/scissors.jpg");
    var hammerInput = new gamePiece("hammer", new Array(), new Array(), "img/hammer.png");
    var dynamiteInput = new gamePiece("dynamite", new Array(), new Array(), "img/dynamite.png");

    //    creating associative array for input
    var allGamePiecesInput = [];
    allGamePiecesInput[rock.type] = rockInput;
    allGamePiecesInput[paper.type] = paperInput;
    allGamePiecesInput[scissors.type] = scissorsInput;
    allGamePiecesInput[hammer.type] = hammerInput;
    allGamePiecesInput[dynamite.type] = dynamiteInput;

    var count = 0; //for checking all input fields have been checked

    function processInvalidPlaceholder(inputType) {
        var str = "Invalid Input";
        if(inputType == "rock") $scope.rockinvalidInput = str;
        else if(inputType == "paper") $scope.paperinvalidInput = str;
        else if(inputType == "scissors") $scope.scissorsinvalidInput = str;
        else if(inputType == "hammer") $scope.hammerinvalidInput = str;
        else if(inputType == "dynamite") $scope.dynamiteinvalidInput = str;
    }
    
    function processInput(idName, inputType, buttonType){
        var value = document.getElementById(idName).value;
        value = value.toLowerCase();
        value = value.split(/(?:,| )+/);
        if ($scope.verified(value, inputType)) {
                for (var i = 0; i < value.length; i++) {
                    allGamePiecesInput[inputType].beats.push(value[i].toString()); //beats
                    allGamePiecesInput[value[i].toString()].losesTo.push(inputType); //losesTo
                }
                document.getElementById(idName).disabled = true;
                document.getElementById(buttonType).disabled = true;
                count++;
            } else {
                document.getElementById(idName).value="";
                processInvalidPlaceholder(inputType);
            }        
    } 
    
    $scope.clearAll = function(){
        document.getElementById('rockInp').value="";
        document.getElementById('paperInp').value="";
        document.getElementById('scissorsInp').value="";
        document.getElementById('hammerInp').value="";
        document.getElementById('dynamiteInp').value="";
        document.getElementById('rockInp').disabled = false;
        document.getElementById('paperInp').disabled = false;
        document.getElementById('scissorsInp').disabled = false;
        document.getElementById('hammerInp').disabled = false;
        document.getElementById('dynamiteInp').disabled = false;
        document.getElementById('rockButton').disabled = false;
        document.getElementById('paperButton').disabled = false;
        document.getElementById('scissorsButton').disabled = false;
        document.getElementById('hammerButton').disabled = false;
        document.getElementById('dynamiteButton').disabled = false;
        count=0;
        $scope.submitMsg = "";
        allGamePieces = resetAllGamePieces;
        $scope.rockinvalidInput="";
        $scope.paperinvalidInput="";
        $scope.scissorsinvalidInput="";
        $scope.hammerinvalidInput="";
        $scope.dynamiteinvalidInput="";
    }
    
    $scope.getInput = function (inputType) {        
        if(inputType == "rockInp") processInput('rockInp', 'rock', 'rockButton');
        else if(inputType == "paperInp") processInput('paperInp', 'paper', 'paperButton');
        else if(inputType == "scissorsInp") processInput('scissorsInp', 'scissors', 'scissorsButton');
        else if(inputType == "hammerInp") processInput('hammerInp', 'hammer', 'hammerButton');
        else if(inputType == "dynamiteInp") processInput('dynamiteInp', 'dynamite', 'dynamiteButton');        
    }

    $scope.verified = function (value, notAllowedPiece) {
        if (value.includes(notAllowedPiece)) {
            return false;
        }
        for (var i = 0; i < value.length; i++) {
            if (!possibleGamePieces.includes(value[i]) || allGamePiecesInput[value[i]].beats.includes(notAllowedPiece)) {
                return false;
            }
        }
        return true;
    }

    $scope.submitRules = function () {
        if (count == 5) {
            allGamePieces = allGamePiecesInput;
            $scope.submitMsg = "Successful submission";
        } else
            $scope.submitMsg = "*Each input field is required";
    }
    
    function getRand() {
        var keysArray = Object.keys(allGamePieces);
        var max = keysArray.length,
            min = 0;
        var comPiece = Math.floor(Math.random() * (max - min));
        return keysArray[comPiece];
    }

    //final computation between user & computer
    function comparePieces(user, computer) {
        $scope.userselection = user.type;
        $scope.compselection = computer.type;
        
        $scope.userImage = user.picture;
        $scope.compImage = computer.picture;

        if (user.type == computer.type) {
            $scope.result = "Nobody wins, it's a TIE !!";
            $scope.tieScore++;
        } else if (user.beats.includes(computer.type) || (computer.losesTo.includes(user.type))) {
            $scope.result = "You win because " + user.type + " beats " + computer.type;
            $scope.userScore++;
        } else if (computer.beats.includes(user.type) || (user.losesTo.includes(computer.type))) {
            $scope.result = "Computer wins because " + computer.type + " beats " + user.type;
            $scope.compScore++;
        } else
            $scope.result = "No rule defined";
    }

}]);

app.directive('rock', function() {
    return {
      restrict: 'E'
    };
  });

app.directive('paper', function() {
    return {
      restrict: 'E'
    };
  });

app.directive('scissors', function() {
    return {
      restrict: 'E'
    };
  });

app.directive('hammer', function() {
    return {
      restrict: 'E'
    };
  });

app.directive('dynamite', function() {
    return {
      restrict: 'E'
    };
  });