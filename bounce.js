var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var W = canvas.width = window.innerWidth;
var H = canvas.height = window.innerHeight;
var g = 0.5;
var bf = 0.8;
var balls = [];

//Event listeners for interaction & resizing
canvas.addEventListener("mousedown", spawnBall, false);
window.addEventListener("keydown", keyPress, false);
window.addEventListener('resize', function() {
	W = canvas.width = window.innerWidth;
	H = canvas.height = window.innerHeight;
});

/* Ball class, takes x and y position of click */
function Ball(x, y) {
	this.radius = 10;
	this.x = x;
	this.y = y;
	this.bounce = false;
	xrand = Math.random();

	//Check to vary x velocity of ball between left and right
	this.vx = (xrand<0.5) ? xrand * -5 : xrand * 5;
	this.vy = (Math.random() * -10) - 5;

	//Random colour for each ball
	var colour = 'rgb('
					+ Math.floor(Math.random()*255) + ',' 
					+ Math.floor(Math.random()*255) + ',' 
					+ Math.floor(Math.random()*255) + ')';

	//Draw each ball as a circle
	this.draw = function(ctx) {
		ctx.fillStyle = colour;
		ctx.beginPath();

		ctx.arc(
			this.x,
			this.y,
			this.radius,
			0,
			Math.PI*2,
			false
		);

		ctx.closePath();
		ctx.fill();
	}
}

/* When canvas is clicked, get position of cursor and create ball there */
function spawnBall(e) {
	var x = e.x;
  	var y = e.y;
	balls.push(new Ball(x, y));
}


/* Decides what to do when certain keys are pressed
** 
** 'space' makes the balls jump (once per bounce)
** 'd' deletes the last ball spawned
** 'backspace' removes all the balls
*/
function keyPress(e) {
	switch (e.keyCode) {
		//'space'
		case 32: 
			for (ball in balls) {
				if (balls[ball].bounce)	balls[ball].vy = -10;
				balls[ball].bounce = false;
			}
			break;
		//'d'
		case 68:
			balls.pop();
			break;
		//'backspace'
		case 8:
			balls = [];
			break;
	}
}

/* Render function called every frame
** Loops through balls array and draws each one
*/
(function renderFrame() {
	requestAnimationFrame(renderFrame);
	//Clear canvas each frame
	ctx.clearRect(0, 0, W, H);
	for (b in balls) {
		var ball = balls[b];
		//Add gravity factor
		ball.vy += g;
		ball.x += ball.vx;
		ball.y += ball.vy;

		//Check for contact with base, reduce y & x velocity by bounce factor
		if (ball.y + ball.radius > canvas.height) {
			
			ball.y = canvas.height - ball.radius;
			ball.vx *= bf;
			ball.vy *= -bf;
			ball.bounce = true;
		}
		//Only reverse y velocity when hitting top
		else if (ball.y - ball.radius < 0) {
			ball.vy = -ball.vy;
		}

		//Check for contact with left and right edges
		if (ball.x + ball.radius > canvas.width || 
			ball.x - ball.radius < 0) {
			ball.vx = -ball.vx;
		}

		//Draw ball
		ball.draw(ctx);
	}
}());