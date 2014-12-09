/*----------------- Game Settings & Constants -----------------*/

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

var SWARM_PATTERNS = {
    pattern1: {
        xCoords: [-150, -100, -50],
        yCoords: ENEMY_Y_STARTS,
        speed: 1
    },
    pattern2: {
        xCoords: [-50, -100, -150],
        yCoords: ENEMY_Y_STARTS,
        speed: 1
    },
    pattern3: {
        xCoords: [-125, -50, -125],
        yCoords: ENEMY_Y_STARTS,
        speed: 1
    }
};

var GAME_OVER = false;





/*----------------- Utilities -----------------*/

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}





/*----------------- Classes -----------------*/

/**
 * Game - Controls game functionality
 * @constructor
 */
var Game = function() {
    this.lives = DEFAULT_LIVES;
    this.level = DEFAULT_LEVEL;
    this.points = DEFAULT_POINTS;

    this.interface = new Interface();
    this.swarm = new Swarm();
}

/**
 * Operates on an instance of Game
 */
Game.prototype.addLevel = function() {
    this.level++;

    this.increaseDifficulty();

    this.addPoints();

    this.interface.updateLevel(this.level);
}


/**
 * Operates on an instance of Game
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
 * Operates on an instance of Game
 */
Game.prototype.addPoints = function() {
    var pointsEarned = 25;
    
    // Add bonus points or life every fourth level
    if (this.level % 4 === 0) {
        if (this.lives === 3) {
            // Reward for no lives lost
            pointsEarned += 50;
        } else {
            // Help a person out
            this.addLife();
        }
    }

    this.points += pointsEarned;

    this.interface.updatePoints(pointsEarned);
}


/**
 * Operates on an instance of Game
 */
Game.prototype.addLife = function() {
    // Add life
    this.lives++;

    // Update the Dom
    this.interface.updateLife(this.lives);
}


/**
 * Operates on an instance of Game
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
 * Operates on an instance of Game
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
 * Operates on an instance of Game
 */
Game.prototype.reset = function() {
    // Ensure game over protocol trickles down
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
    this.interface.showAlert("positive", "New Game!");
}





/**
 * Interface - Controls interaction with DOM objects
 * @constructor
 */
var Interface = function() {
    // Cache DOM objects
    this.$level = $("#game-level");
    this.$points = $("#game-points");
    this.$lifeBox = $("#life-icon-box");

    this.$alert = $(".gm-alert-box");

    // Form related jQuery objects
    this.$formContainer = $(".gm-form-box");
    this.$form = $("#score-form");
    this.$scoreInput = $("#score");
    this.$btnRestart = $("#form-reset-btn");
}


/**
 * Operates on an instance of Interface
 * @param {int} level Current level player is on
 */
Interface.prototype.updateLevel = function(level) {
    // Prevent notification showing on game reset 
    if (!GAME_OVER) {
        // Flash alert
        this.showAlert("positive", "WICKED - Level up!");
    }

    // Update DOM scoreboard with current level
    this.$level.text(level);
}


/**
 * Operates on an instance of Interface
 * @param {int} numLifes Number of lives player should have
 * @param {boolean} isBad Flag to note life was lost rather than gained
 */
Interface.prototype.updateLife = function(numLifes, isBad) {
    // Prevent alert showing on game reset 
    if (!GAME_OVER) {
        // Alert user only when life is lost
        if (isBad) {
            this.showAlert("negative", "Life lost!"); 
        } 
    }

    // Construct html FontAwesome heart element
    var htmlHeart = '<i class="fa fa-heart fa-fw gm-heart"></i>';

    // Remove all elements from life box
    this.$lifeBox.empty();

    // Add the correct number of hearts to life box
    for (var i = 0; i < numLifes; i++) {
        this.$lifeBox.append(htmlHeart);
    }   
}


/**
 * Operates on an instance of Interface
 * @param {int} newPoints Number of points to add to score 
 */
Interface.prototype.updatePoints = function(newPoints) {
    var points = parseInt(this.$points.text());
    var target = points + newPoints;

    // Get around 'this' closure scope context issue
    var tempPointsRef = this.$points;

    function render() {
        tempPointsRef.text(points);
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
 * Operates on an instance of Interface
 * @param {string} type Determines style applied
 * @param {string} msg Text shown in alert
 */
Interface.prototype.showAlert = function(type, msg) {
    // Apply appropriate css class
    if (type === "positive") {
        this.$alert.removeClass("alert-negative");
        this.$alert.addClass("alert-positive");
    } else if (type === "negative") {
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
 * Operates on an instance of Interface
 * @param {bool} bool flag value if true show form else hide
 */
Interface.prototype.displayForm = function(bool) {
    if (bool) {
        this.$formContainer.removeClass("hidden");
    } else {
        this.$formContainer.addClass("hidden");
    }
}


/**
 * Operates on an instance of Interface
 */
Interface.prototype.endGame = function() {
    this.showAlert("negative", "GAME OVER");

    // Only display submit score form if user has actually scored
    var points = parseInt(this.$points.text());
    if (points !== 0) {
        this.displayForm(true);
    }
}


/**
 * Operates on an instance of Interface
 */
Interface.prototype.reset = function() {
    // Reset DOM elements to game constants
    this.updateLevel(DEFAULT_LEVEL);
    this.updateLife(DEFAULT_LIVES);
    this.$points.text(DEFAULT_POINTS);
    
    // Hide form container 
    this.displayForm(false);
}





/** 
 * Sprite - Contains standard methods for a game sprite
 * @constructor
 */
var Sprite = function() {
    // Enemy and Player prototype chains points here
}


/**
 * Operates on an instance of Sprite
 * @param {obj} settings Contains offset values to assist in creating
 *      box frame used to detect collisions
 */
Sprite.prototype.setCollisionFrame = function(settings) {
    this.left = this.x + settings["left offset"];
    this.right = this.x + settings["sprite width"];
    this.top = this.y + settings["top offset"];
    this.bottom = this.y + settings["sprite height"];   
}


/**
 * Operates on an instance of Sprite
 */
Sprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}





/**
 * Enemy - Bug object that streams across the page
 * @constructor
 * @extends {Sprite}
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


/**
 * Operates on an instance of Enemy - Update the enemy's position
 * @param {float} dt A time delta between ticks
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
 * Operates on an instance of Enemy - resets position on canvas
 */
Enemy.prototype.reset = function() {
    this.x = this.getRandomX();
    this.y = this.getRandomY();
    this.speed = this.getRandomSpeed();
}


/**
 * Operates on an instance of Enemy
 * @return {int} x coordinate to be used for position on canvas
 */
Enemy.prototype.getRandomX = function() {
    // Get valid random index for ENEMY_X_STARTS array
    var len = ENEMY_X_STARTS.length;
    var rand = getRandomInt(0, len);

    return ENEMY_X_STARTS[rand];
}


/**
 * Operates on an instance of Enemy
 * @return {int} y coordinate to be used for position on canvas
 */
Enemy.prototype.getRandomY = function() {
    // Get valid random index for ENEMY_Y_STARTS array
    var len = ENEMY_Y_STARTS.length;
    var rand = getRandomInt(0, len);

    return ENEMY_Y_STARTS[rand];
}


/**
 * Operates on an instance of Enemy
 * @return {int} returns speed to be used as multiplier
 */
Enemy.prototype.getRandomSpeed = function() {
    // Get random int within min and max speed constraints
    return getRandomInt(ENEMY_MIN_SPEED, ENEMY_MAX_SPEED);
}





/** 
 * A Swarm - A factory that produces Swarmees with specific coord patterns
 * @constructor
 */
var Swarm = function() {
    /* Factory producing Swarmees with specific coord patterns */
}


/**
 * Operates on an instance of MyClass and returns something.
 * @param {obj} pattern Contains settings to be used to generate Swarmees
 * @param {int} speed Contains settings to be used to generate Swarmees 
 */
Swarm.prototype.spawn = function(pattern, speed) {
    var pattern = SWARM_PATTERNS[pattern];

    if (speed) {
        pattern.speed = speed;
    }
    
    this.generateSwarmees(pattern);
}


/**
 * Operates on an instance of Swarm  - Generates group of 3 Swarmees
 * @param {obj} options Object contains the coords and speed for each
 *      Swarmee generated
 */
Swarm.prototype.generateSwarmees = function(options) {
    // Remove enemies from canvas
    allEnemies = [];

    // Generate swarmees according to pattern
    for (var i = 0; i < 3; i++) {
        var swarmee = new Swarmee({
            // Assign x,y coords via parallel arrays
            x: options.xCoords[i],
            y: options.yCoords[i],
            speed: options.speed
        });

        allEnemies.push(swarmee);
    }
}





 /**
 * A Swarmee 
 * @param {obj} options Contains all settings needed to create Swarmee
 * @constructor
 * @extends {Enemy}
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
 * Operates on an instance of Swarmee - Resets x coordinate
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
        if (newX >= LEFT_WALL && newX <= RIGHT_WALL ) {
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





/*----------------- Game Play -----------------*/

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