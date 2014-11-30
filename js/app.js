/***** NOTES *****/
// canvas can be directly manipulated by Game
// other page content is handled by Interface

// TODO:
    // Notifications
        // Handle discrepancy between dom manip and effects
            // Two flashes on game over, 1 for death, 1 for game over
            // Both display game over because of DOM manip occurring 
            // faster than effects
        // MAIN culprit is the showNotification() method on Interface
    // FEATURE Extra life if necessary on every 5th level
    // Leader board
        // Google app engine leader board on data store
        // New points system???
    // REFACTOR
    // COMMENT




/***** Game Settings & Constants *****/

var FINISH_LINE = 83,
    LEFT_WALL = -5,
    RIGHT_WALL = 500,
    TOP_WALL = -100,
    BOTTOM_WALL = 450;

var DEFAULT_LIVES = 3,
    DEFAULT_LEVEL = 1;

var SPEED_MULTIPLIER = 100;

var PLAYER_START_X = 200,
    PLAYER_START_Y = 380;

var PLAYER_STEP_X = 101,
    PLAYER_STEP_Y = 83;

var PLAYER_FRAME = {
    "left offset": 20,
    "top offset": 100,
    "sprite width": 82,
    "sprite height": 170
}

var ENEMY_X_STARTS = [-300, -200, -100, -50],
    ENEMY_Y_STARTS = [60, 140, 225];

var ENEMY_MAX_SPEED = 5,
    ENEMY_MIN_SPEED = 1;

var ENEMY_FRAME = {
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
var Game = function() {
    this.lives = DEFAULT_LIVES;
    this.level = DEFAULT_LEVEL;

    this.interface = new Interface();
}

Game.prototype.addLevel = function() {
    // Up the level
    this.level++;

    // Update the DOM
    this.interface.updateLevel(this.level);

    // Increase difficulty
    if (this.level > 10 && ENEMY_MAX_SPEED > ENEMY_MIN_SPEED) {
        // Less slow pokes!!!
        ENEMY_MIN_SPEED++;
    } else if (this.level > 5) {
        // More speed!!!
        ENEMY_MAX_SPEED++;
    } else {
        // More enemies!!!
        allEnemies.push(new Enemy());
    }
}

Game.prototype.subtractLife = function() {
    // Subtract life
    this.lives--;

    // Update the DOM
    this.interface.updateLife(this.lives);

    // Check for end of game
    if (this.lives === 0) {
        this.endGame();
    }
}

Game.prototype.endGame = function() {
    // Remove all enemies
    allEnemies = [];

    // Flag prevents player movement
    GAME_OVER = true;  

    // Update DOM
    this.interface.endGame();  
}

Game.prototype.reset = function() {
    // End sure game over protocol trickles down
    GAME_OVER = true;

    // Reset properties
    this.level = DEFAULT_LEVEL;
    this.lives = DEFAULT_LIVES;

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
    this.interface.showNotification("good", "New Game!");
}



/** 
 * A Interface
 * @constructor
 */
var Interface = function() {
    // Cache DOM objects
    this.$level = $("#game-level");
    this.$lifeBox = $("#lives");
    this.$gameNotification = $(".game-notification");
}

Interface.prototype.updateLevel = function(level) {
    // Prevent notification showing on game reset 
    if (!GAME_OVER) {
        this.showNotification("good", "WICKED - Level up!");
    }

    // Update DOM with current level
    this.$level.text(level);
}

Interface.prototype.updateLife = function(numLifes) {
    // Prevent notification showing on game reset 
    if (!GAME_OVER) {
        this.showNotification("bad", "Life lost!");      
    }

    var htmlHeart = '<i class="fa fa-heart fa-fw"></i>';

    this.$lifeBox.empty();
    for (var i = 0; i < numLifes; i++) {
        this.$lifeBox.append(htmlHeart);
    }   
}

Interface.prototype.showNotification = function(type, msg) {
    // Apply appropriate css class
    if (type === "good") {
        this.$gameNotification.removeClass("notify-bad");
    } else if (type === "bad") {
        this.$gameNotification.addClass("notify-bad");
    }

    // Construct HTML message
    var htmlMsg = '<h1>' + msg + '</h1>';

    // Add message to DOM
    this.$gameNotification.empty();
    this.$gameNotification.append(htmlMsg);

    // Diplay notification to user
    this.$gameNotification.fadeIn(100);
    if (!GAME_OVER) {
        this.$gameNotification.fadeOut(1000, "swing");
    }
}

Interface.prototype.endGame = function() {
    this.showNotification("bad", "GAME OVER");
}

Interface.prototype.reset = function() {
    // Reset DOM
    this.updateLevel(DEFAULT_LEVEL);
    this.updateLife(DEFAULT_LIVES);
}



/** 
 * A Sprite
 * @constructor
 */
var Sprite = function() {
    // Enemy and Player prototype chains points here
}

Sprite.prototype.setCollisionFrame = function(settings) {
    this.left = this.x + settings["left offset"];
    this.right = this.x + settings["sprite width"];
    this.top = this.y + settings["top offset"];
    this.bottom = this.y + settings["sprite height"];   
}



/** 
 * An Enemy
 * @constructor
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

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
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

Enemy.prototype.reset = function() {
    this.x = this.getRandomX();
    this.y = this.getRandomY();
    this.speed = this.getRandomSpeed();
}

Enemy.prototype.getRandomX = function() {
    // Get valid random index for ENEMY_X_STARTS array
    var len = ENEMY_X_STARTS.length;
    var rand = getRandomInt(0, len);

    return ENEMY_X_STARTS[rand];
}

Enemy.prototype.getRandomY = function() {
    // Get valid random index for ENEMY_Y_STARTS array
    var len = ENEMY_Y_STARTS.length;
    var rand = getRandomInt(0, len);

    return ENEMY_Y_STARTS[rand];
}

Enemy.prototype.getRandomSpeed = function() {
    // Get random int within min and max speed constraints
    return getRandomInt(ENEMY_MIN_SPEED, ENEMY_MAX_SPEED);
}



/** 
 * A Player
 * @constructor
 */
var Player = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    
    this.setCollisionFrame(PLAYER_FRAME);
    
    this.sprite = 'images/char-boy.png';
}

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

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

Player.prototype.checkWin = function() {
    if (this.top < FINISH_LINE) {
        this.reset();
        game.addLevel();
    }
}

Player.prototype.reset = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;

    this.setCollisionFrame(PLAYER_FRAME);
}







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

// Adds event listener and action to restart button
var resetButton = document.getElementById("btn-restart");

resetButton.addEventListener("click", function(e) {
    game.reset();
})