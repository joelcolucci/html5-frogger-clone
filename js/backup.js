// Enemies our player must avoid
var Enemy = function(yCoord, speedMultiplier) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -103;
    this.y = yCoord;
    this.speed = speedMultiplier;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > ctx.canvas.width) {
        this.x = -100;
        return;
    }
    this.x += dt * 100 * this.speed;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 0;
    this.y = 0;
    this.top = "";
    this.bottom = "";
    this.left = "";
    this.right = "";
    
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(axis, val) {
    if (axis === "x") {
        var newX = this.x + val;
        if (newX < 0 || newX >= ctx.canvas.width) {
            console.log(newX);
            return;
        }
        this.x += val;
    }
    else if (axis === "y") {
        var newY = this.y + val;
        if (newY < 0 || newY >= ctx.canvas.height) {
            console.log(newY);
            return;
        }
        this.y += val;
    }

    // PREVENT PLAYER FROM MOVING off screen.
    // can we use modulo in this case?
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(keyPressed) {
    switch(keyPressed) {
        case "left":
            this.update("x", -101);
            return;
        case "right":
            this.update("x", 101);
            return;
        case "up":
            this.update("y", -83);
            return;
        case "down":
            this.update("y", 83);
            return;
        default:
            return;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(60, 1),
    new Enemy(140, 2),
    new Enemy(225, 1.5)
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
