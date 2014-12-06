/***** NOTES *****/
// canvas can be directly manipulated by Game
// other page content is handled by Interface

// TODO:
    // Notifications
        // Note bug but agree with it



    // Point Scoring
        // Document in rules
        // Review for improvement
    // Leader board

    // Back-End
        // Validate form input
        // Call back for form errors
    // REFACTOR
    // COMMENT

// BIG FOCUS
// SEPARATION OF CONCERNS
// GAME OBJECT CONTROLLER

// INTERFACE WITH TAKES CARE OF MANIPULATING THE DOM

// OBJECT ORIENTATION
    // TRUE OOP has getters and setters and no direct manipulation of instance variables
    // See page 82 of Object Oriented Programming by Nicholas Zakas
    // Methods can be used on the object instance itself but it makes use overall less efficient
    // because now the object takes up more memory, benefit is private properties

    // THINK ABOUT DEPENDENCIES
    // READ SOURCEMAKING ON REFACTORING!!!

// Thnk about dependices
// Think about moving "checkWin" method to Game. Doesn't make sense for control of that to be on Player.
// the Game object is our master controller


/***** 
 * Game Settings & Constants
 *****/
var FINISH_LINE = 83,
    LEFT_WALL = -5,
    RIGHT_WALL = 500,
    TOP_WALL = -100,
    BOTTOM_WALL = 450;

var DEFAULT_LIVES = 3,
    DEFAULT_LEVEL = 1,
    DEFAULT_POINTS = 0;

var SPEED_MULTIPLIER = 100;

var PLAYER_START_X = 200,
    PLAYER_START_Y = 380,
    PLAYER_STEP_X = 101,
    PLAYER_STEP_Y = 83,
    PLAYER_FRAME = {
        "left offset": 20,
        "top offset": 100,
        "sprite width": 82,
        "sprite height": 170
    }

var ENEMY_X_STARTS = [-300, -200, -100, -50],
    ENEMY_Y_STARTS = [60, 140, 225],
    ENEMY_MAX_SPEED = 5,
    ENEMY_MIN_SPEED = 1,
    ENEMY_FRAME = {
        "left offset": 3,
        "top offset": 90,
        "sprite width": 100,
        "sprite height": 170 
    }

var GAME_OVER = false;



/***** Utilities *****/

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}



/***** Classes *****/

/** 
 * A Game
 * @constructor
 */

/**
 * Class making something fun and easy.
 * @constructor
 * @extends {goog.Disposable}
 */
var Game = function() {
    this.lives = DEFAULT_LIVES;
    this.level = DEFAULT_LEVEL;
    this.points = DEFAULT_POINTS;

    this.interface = new Interface();
    this.swarm = new Swarm();
}

/**
 * Operates on an instance of Game and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Game.prototype.addLevel = function() {
    this.level++;

    this.increaseDifficulty();

    this.addPoints();

    this.interface.updateLevel(this.level);
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Game.prototype.increaseDifficulty = function() {
    switch (this.level) {
        case 1:
        case 2:
        case 3:
        case 4:
            // More enemies!!!
            allEnemies.push(new Enemy());
            break;
        case 5:
            this.swarm.spawn("pattern1", 2);
            break;
        case 6:
            this.swarm.spawn("pattern2", 3);
            break;
        case 7:
            this.swarm.spawn("pattern2", 4)
            break;
        case 8:
            this.swarm.spawn("pattern3", 3);
            break;
        case 9:
            this.swarm.spawn("pattern3", 4);
            break;
        case 10:
            // More speed!!!
            ENEMY_MAX_SPEED++;
            // Less slow pokes!!!
            ENEMY_MIN_SPEED++;
            
            // Toast the swarms
            allEnemies = [
                new Enemy(),
                new Enemy(),
                new Enemy(),
                new Enemy()
            ];
            break;
        case 13:
            allEnemies.pop();
            console.log("level 13");
            break;
        case 15:
            allEnemies.pop();
            break;
        default:
            // More speed!!!
            ENEMY_MAX_SPEED++;
            // Less slow pokes!!!
            ENEMY_MIN_SPEED++;
    }
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Game.prototype.addPoints = function() {
    var pointsEarned = 25;
    // Bonus time?
    if (this.level % 4 === 0) {
        if (this.lives === 3) {
            // Reward no lives lost
            pointsEarned += 50;
        } else {
            // Throw a dog a bone
            this.addLife();
        }
    }

    this.points += pointsEarned;

    this.interface.updatePoints(pointsEarned);
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Game.prototype.addLife = function() {
    // Add life
    this.lives++;

    // Update the Dom
    this.interface.updateLife(this.lives);
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Game.prototype.subtractLife = function() {
    // Subtract life
    this.lives--;

    // Update the DOM
    this.interface.updateLife(this.lives, true);

    // Check for end of game
    if (this.lives === 0) {
        this.endGame();
    }
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Game.prototype.endGame = function() {
    // Remove all enemies
    allEnemies = [];

    // Flag prevents player movement
    GAME_OVER = true;  

    // Update DOM
    this.interface.endGame();  
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Game.prototype.reset = function() {
    // End sure game over protocol trickles down
    GAME_OVER = true;

    // Reset properties
    this.level = DEFAULT_LEVEL;
    this.lives = DEFAULT_LIVES;
    this.points = DEFAULT_POINTS;

    // Reset DOM interface
    this.interface.reset();

    // Reset game constants
    GAME_OVER = false;
    ENEMY_MAX_SPEED = 5;
    ENEMY_MIN_SPEED = 1;

    // Reset canvas
    allEnemies = [];
    allEnemies.push(new Enemy());

    // Notify user ready to go!
    this.interface.showAlert("good", "New Game!");
}





/**
 * Class making something fun and easy.
 * @param {string} arg1 An argument that makes this more interesting.
 * @param {Array.<number>} arg2 List of numbers to be processed.
 * @constructor
 * @extends {goog.Disposable}
 */
var Interface = function() {
    // Cache DOM objects
    this.$level = $("#game-level");
    this.$points = $("#game-points");
    this.$lifeBox = $("#life-icon-box");

    this.$alert = $(".gm-alert-box");

    this.$formContainer = $(".gm-form-box");
    this.$form = $("#score-form");

    this.$scoreInput = $("#score");
    this.$btnRestart = $(".gm-form-box .btn-restart");
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Interface.prototype.updateLevel = function(level) {
    // Prevent notification showing on game reset 
    if (!GAME_OVER) {
        this.showAlert("good", "WICKED - Level up!");
    }

    // Update DOM with current level
    this.$level.text(level);
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Interface.prototype.updateLife = function(numLifes, isBad) {
    // Prevent notification showing on game reset 
    if (!GAME_OVER) {
        if (isBad) {
            this.showAlert("bad", "Life lost!"); 
        } 
    }

    var htmlHeart = '<i class="fa fa-heart fa-fw gm-heart"></i>';

    this.$lifeBox.empty();
    for (var i = 0; i < numLifes; i++) {
        this.$lifeBox.append(htmlHeart);
    }   
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Interface.prototype.updatePoints = function(newPoints) {
    var points = parseInt(this.$points.text());
    var target = points + newPoints;
    var gmPt = document.getElementById("game-points");
    
    function render() {
        gmPt.innerHTML = points;
        if (points >= target) {
            clearInterval(interval);
        }
        points++; 
    }
    // Roll score
    var interval = setInterval(render, 1);

    // Update hidden score form input
    this.$scoreInput.val(target);
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Interface.prototype.showAlert = function(type, msg) {
    // Apply appropriate css class
    if (type === "good") {
        this.$alert.removeClass("alert-negative");
        this.$alert.addClass("alert-positive");
    } else if (type === "bad") {
        this.$alert.removeClass("alert-positive");
        this.$alert.addClass("alert-negative");
    }

    // Construct HTML message
    var htmlMsg = '<h1>' + msg + '</h1>';

    // Remove previous message from the Alert
    this.$alert.empty();

    // Add message to DOM
    this.$alert.append(htmlMsg);

    // If game is not over flash the alert to user
    // else alert stays static on canvas
    this.$alert.fadeIn(100);
    if (!GAME_OVER) {
        this.$alert.fadeOut(1000, "swing");
    }
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Interface.prototype.displayForm = function(bool) {
    if (bool) {
        this.$formContainer.removeClass("hidden");
    } else {
        this.$formContainer.addClass("hidden");
    }
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Interface.prototype.endGame = function() {
    this.showAlert("bad", "GAME OVER");
    this.displayForm(true);
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Interface.prototype.reset = function() {
    // Reset DOM games
    this.updateLevel(DEFAULT_LEVEL);
    this.updateLife(DEFAULT_LIVES);

    this.displayForm(false);

    this.$points.text('0');
    this.$form.show();

    $("#score-form input").attr("disabled", false);
    $("#myButton").attr("disabled", false).text("Submit");

    this.$btnRestart.hide();
}



/** 
 * A Sprite
 * @constructor
 */

/**
 * Class making something fun and easy.
 * @param {string} arg1 An argument that makes this more interesting.
 * @param {Array.<number>} arg2 List of numbers to be processed.
 * @constructor
 * @extends {goog.Disposable}
 */
var Sprite = function() {
    // Enemy and Player prototype chains points here
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Sprite.prototype.setCollisionFrame = function(settings) {
    this.left = this.x + settings["left offset"];
    this.right = this.x + settings["sprite width"];
    this.top = this.y + settings["top offset"];
    this.bottom = this.y + settings["sprite height"];   
}

/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Sprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}









/** 
 * An Enemy
 * @constructor
 */

/**
 * Class making something fun and easy.
 * @param {string} arg1 An argument that makes this more interesting.
 * @param {Array.<number>} arg2 List of numbers to be processed.
 * @constructor
 * @extends {goog.Disposable}
 */
var Enemy = function() {
    this.x = this.getRandomX();
    this.y = this.getRandomY();
    this.speed = this.getRandomSpeed();
    
    this.setCollisionFrame(ENEMY_FRAME);

    this.sprite = 'images/enemy-bug.png';
}

Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Enemy.prototype.update = function(dt) {
    var newX = (this.speed * SPEED_MULTIPLIER * dt) + this.x;

    if (newX > RIGHT_WALL) {
        this.reset();
        this.setCollisionFrame(ENEMY_FRAME);
    }
    else {
        this.x = newX;   
        this.setCollisionFrame(ENEMY_FRAME);
    }
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Enemy.prototype.reset = function() {
    this.x = this.getRandomX();
    this.y = this.getRandomY();
    this.speed = this.getRandomSpeed();
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Enemy.prototype.getRandomX = function() {
    // Get valid random index for ENEMY_X_STARTS array
    var len = ENEMY_X_STARTS.length;
    var rand = getRandomInt(0, len);

    return ENEMY_X_STARTS[rand];
}



/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Enemy.prototype.getRandomY = function() {
    // Get valid random index for ENEMY_Y_STARTS array
    var len = ENEMY_Y_STARTS.length;
    var rand = getRandomInt(0, len);

    return ENEMY_Y_STARTS[rand];
}



/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Enemy.prototype.getRandomSpeed = function() {
    // Get random int within min and max speed constraints
    return getRandomInt(ENEMY_MIN_SPEED, ENEMY_MAX_SPEED);
}



/** 
 * A Swarm
 * @constructor
 */

/**
 * Class making something fun and easy.
 * @param {string} arg1 An argument that makes this more interesting.
 * @param {Array.<number>} arg2 List of numbers to be processed.
 * @constructor
 * @extends {goog.Disposable}
 */
var Swarm = function() {
    // Factory of Swarmees

}

/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Swarm.prototype.spawn = function(pattern, speed) {
    // Handler for creation
    var patterns = {
        pattern1: {
            xCoords: [-150, -100, -50],
            yCoords: ENEMY_Y_STARTS,
            speed: speed
        },
        pattern2: {
            xCoords: [-50, -100, -150],
            yCoords: ENEMY_Y_STARTS,
            speed: speed
        },
        pattern3: {
            xCoords: [-125, -50, -125],
            yCoords: ENEMY_Y_STARTS,
            speed: speed
        }
    };

    allEnemies = [];
    this.createPattern(patterns[pattern]);
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Swarm.prototype.createPattern = function(options) {
    for (var i = 0; i < 3; i++) {
        var swarmee = new Swarmee({
            x: options.xCoords[i],
            y: options.yCoords[i],
            speed: options.speed
        });

        allEnemies.push(swarmee);
    }
}







/** 
 * A Swarmee
 * @constructor
 */

 /**
 * Class making something fun and easy.
 * @param {string} arg1 An argument that makes this more interesting.
 * @param {Array.<number>} arg2 List of numbers to be processed.
 * @constructor
 * @extends {goog.Disposable}
 */
var Swarmee = function(options) {
    this.x = options.x;
    this.y = options.y;
    this.speed = options.speed;

    this.startX = this.x;

    this.sprite = 'images/enemy-bug.png';
}
Swarmee.prototype = Object.create(Enemy.prototype);
Swarmee.prototype.constructor = Swarmee;

/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Swarmee.prototype.reset = function() {
    this.x = this.startX;
}



/** 
 * A Player
 * @constructor
 */

/**
 * Class making something fun and easy.
 * @param {string} arg1 An argument that makes this more interesting.
 * @param {Array.<number>} arg2 List of numbers to be processed.
 * @constructor
 * @extends {goog.Disposable}
 */
var Player = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    
    this.setCollisionFrame(PLAYER_FRAME);
    
    this.sprite = 'images/char-boy.png';
}

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;



/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Player.prototype.update = function(axis, step) {
    var collisionDetected = this.checkForCollisions();

    if (collisionDetected) {
        game.subtractLife();

        // Reset players position on canvas
        this.reset();
    }

    if (axis === "x") {
        var newX = this.x + step;
        if (newX <= RIGHT_WALL && newX >= LEFT_WALL) {
            this.x = newX;
            this.setCollisionFrame(PLAYER_FRAME);
        }
    }
    else if (axis === "y") {
        var newY = this.y + step;
        if (newY >= TOP_WALL && newY <= BOTTOM_WALL) {
            this.y = newY;  
            this.setCollisionFrame(PLAYER_FRAME);
            this.checkWin();
        }
    }
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */

// Conditional Check Source: http://silentmatt.com/rectangle-intersection/
Player.prototype.checkForCollisions = function() {
    for (var i in allEnemies) {
        var enemy = allEnemies[i];

        if (this.left < enemy.right &&
            this.right > enemy.left &&
            this.top < enemy.bottom &&
            this.bottom > enemy.top) {
            return true;
        }
    }

    return false;
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Player.prototype.checkWin = function() {
    if (this.top < FINISH_LINE) {
        this.reset();
        game.addLevel();
    }
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Player.prototype.reset = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;

    this.setCollisionFrame(PLAYER_FRAME);
}






/**
 * Operates on an instance of MyClass and returns something.
 * @param {project.MyClass} obj Instance of MyClass which leads to a long
 *     comment that needs to be wrapped to two lines.
 * @return {boolean} Whether something occurred.
 */
Player.prototype.handleInput = function(direction) {
    if (!GAME_OVER) {
        switch (direction) {
            case "left":
                this.update("x", -PLAYER_STEP_X);
                break;
            case "right":
                this.update("x", PLAYER_STEP_X)
                break;
            case "up":
                this.update("y", -PLAYER_STEP_Y)
                break;
            case "down":
                this.update("y", PLAYER_STEP_Y);
                break;
            default:
                return;
        }
    }
}



/***** Game Play *****/

// Instantiate all necessary game objects.
var game = new Game();

var player = new Player();

var allEnemies = [new Enemy()];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});