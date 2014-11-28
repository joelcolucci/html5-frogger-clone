/*** Game Constants ***/
var PLAYER_START_X = 200,
    PLAYER_START_Y = 380;

var STEP_X = 101,
    STEP_Y = 83;

var FINISH_LINE = 83,
    LEFT_WALL = -5,
    RIGHT_WALL = 500,
    TOP_WALL = -100,
    BOTTOM_WALL = 450;

var PLAYER_FRAME = {
    "left offset": 20,
    "top offset": 100,
    "sprite width": 82,
    "sprite height": 170
}

var ENEMY_FRAME = {
    "left offset": 3,
    "top offset": 90,
    "sprite width": 100,
    "sprite height": 170 
}





/*** Utilities ***/
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}






/*** Classes ***/
var Game = function() {
    this.lives = 3;
    this.level = 1;

    // cache DOM objects
    this.gameLevel = document.getElementById("game-level");
    this.lifeBox = document.getElementById("lives");
    this.liveElms = document.getElementsByTagName("i");
}
Game.prototype.increaseLevel = function() {
    // Up the level
    this.level++;

    // update DOM
    this.gameLevel.innerText = this.level;

    // add enemy
    var newEnemy = new Enemy();
    allEnemies.push(newEnemy);
}
Game.prototype.subtractLife = function() {
    if (this.lives === 1) {
        alert("Game over");
        allEnemies = [];
        return;
    }

    this.lives--;
    // update the DOM
    this.lifeBox.removeChild(this.liveElms[0]);
}







var Sprite = function() {

}
Sprite.prototype.setCollisionFrame = function(settings) {
    this.left = this.x + settings["left offset"];
    this.right = this.x + settings["sprite width"];
    this.top = this.y + settings["top offset"];
    this.bottom = this.y + settings["sprite height"];   
}






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

Enemy.prototype.getRandomX = function() {
    var xPositions = [-300, -200, -100, -50];

    var rand = getRandomInt(0,4);
    return xPositions[rand];
}

Enemy.prototype.getRandomY = function() {
    var yPositions = [60, 140, 225];

    var rand = getRandomInt(0,3);
    return yPositions[rand];
}

Enemy.prototype.getRandomSpeed = function() {
    return getRandomInt(1, 5);
}

Enemy.prototype.reset = function() {
    this.x = this.getRandomX();
    this.y = this.getRandomY();
    this.speed = this.getRandomSpeed();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var newX = (this.speed * 100 * dt) + this.x;

    if (newX > RIGHT_WALL) {
        this.reset();
        this.setCollisionFrame(ENEMY_FRAME);
    }
    else {
        this.x = newX;   
        this.setCollisionFrame(ENEMY_FRAME);
    }
}





var Player = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    
    this.setCollisionFrame(PLAYER_FRAME);
    
    this.sprite = 'images/char-boy.png';
}
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.reset = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;

    this.setCollisionFrame(PLAYER_FRAME);
}

Player.prototype.checkWin = function() {
    if (this.top < FINISH_LINE) {
        this.reset();
        game.increaseLevel();
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
            console.log("Collision!");
            return true;
        }
    }

    return false;
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(axis, step) {
    if (this.checkForCollisions()) {
        game.subtractLife();
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

Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case "left":
            this.update("x", -STEP_X);
            break;
        case "right":
            this.update("x", STEP_X)
            break;
        case "up":
            this.update("y", -STEP_Y)
            break;
        case "down":
            this.update("y", STEP_Y);
            break;
        default:
            return;
    }
}



/*** Game Play Features ***/
// Game Clock
    // On space bar
        // init/reset() game
        // init game clock
            // countdown from 30
            // if zero
            // pause game
            // game over
    // one technique is to use a flag value to prevent movement of characters
    // event listen for space bar enables movement
    // OR add to reset() in engine.js the generation of enemies and player???
// Game Level
    // if player reaches river
        // increase level by one
        // add a bug to allEnemies
/* Maybe we create a Game object
    properties of lives, levels */





/*** Game Play ***/
// Instantiate all necessary game objects.
var game = new Game();

var allEnemies = [
    new Enemy(),
    new Enemy()
];

var player = new Player();

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