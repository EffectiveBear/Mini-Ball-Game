// canvas basic boilerplate
let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//window add event listener
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initiate();
})
window.addEventListener('mousemove', (event) => {
    movemouse.x = event.x;
    movemouse.y = event.y;
})


//All variables and objects declarations
let movemouse =
{
    x: undefined,
    y: undefined
}

//spiralbackgroundidea
const dots = 200;
let hue = 0;
let max_speed = 5;
let dotsArray = [];
let dummyRadius = 0;



//blockgame
let high_score = 0;

const board_length = 200;
const board_thickness = 15;
const BtB_length = 5;

const board_height_from_bottom = 50;
const ball_radius = 10;
const ball_height_from_board = BtB_length + ball_radius;

let game_start = 0;
let game_end = 0;

const min_speed = 10;
let hue_mainball = 0;

let board = undefined, ball = undefined;


// User defined Classes
class Revolutions {
    constructor(radius) {
        this.circularSpeed = Math.random() * 2 + 0.1;
        this.radius = 3 + radius;
        this.angle = 0;
        this.color = `hsl(${(hue)} 100% 50%)`;
        // this.color = 'white';
        this.rsinx = 0;
        this.rcosx = this.radius;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(innerWidth / 2 + this.rcosx, innerHeight / 2 + this.rsinx, 2, 0, Math.PI * 2);
        c.fill();

    }
    update() {
        this.rsinx = this.radius * Math.sin(this.angle * (Math.PI / 180));
        this.rcosx = this.radius * Math.cos(this.angle * (Math.PI / 180));
        this.angle = (this.angle + this.circularSpeed) % 360;
    }
}

class Board {
    constructor() {
        this.length = board_length;
        this.y = innerHeight - board_height_from_bottom;
        this.x = innerWidth / 2;
    }
    draw() {
        c.beginPath();
        c.moveTo(this.x - this.length / 2, this.y);
        c.lineTo(this.x + this.length / 2, this.y);
        c.strokeStyle = 'white';
        c.lineWidth = board_thickness;
        c.stroke();
    }
    update() {
        let mousefactor = 1;
        if (movemouse.x - this.length / 2 <= 0) {
            if (this.x - this.length / 2 <= 0) {
                mousefactor = 0;
            }
        }
        if (movemouse.x + this.length / 2 >= canvas.width) {
            if (this.x + this.length / 2 >= canvas.width) {
                mousefactor = 0;
            }
        }
        if (mousefactor == 1) {
            this.x = movemouse.x;
        }

    }
}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.boardX = x;
        this.boardY = y;
        this.radius = ball_radius;
        this.boardlength = board_length;


        this.Speed = min_speed;
        this.speedX = undefined;
        this.speedY = undefined;
        this.speedAngle = (Math.floor(Math.random() * 161) + 20);
        this.speedX = this.Speed * Math.cos(this.speedAngle * Math.PI / 180);
        this.speedY = this.Speed * Math.sin(this.speedAngle * Math.PI / 180);
        // this.speedX = 0;
        // this.speedY = this.Speed;
        if (this.speedY > 0) {
            this.speedY = -this.speedY;
        }
        this.color = 'white';

        //Ball bounce variable before game start
        this.dy = -0.5;
        this.up = 1;
        this.down = 0;
    }
    draw() {
        c.beginPath();
        c.fillStyle = `hsl(${(hue_mainball)} 100% 50%)`;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
    }
    //Update the positions of the ball in Computer Screen
    update() {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
        }
        this.x += this.speedX;
        this.y += this.speedY;
    }
    //Ball bounce in the board when game hasn't started
    initially() {
        this.y += this.dy;
        if (this.y == this.boardY) {
            this.up = 1;
            this.down = 0;
        }
        if (this.y == this.boardY - 10) {
            this.up = 0;
            this.down = 1;
        }
        if (this.up == 0 && this.down == 1) {
            this.dy = Math.abs(this.dy);
            this.up = 0;
            this.down = 0;
        }
        if (this.up == 1 && this.down == 0) {
            this.dy = - this.dy;
            this.up = 0;
            this.down = 0;
        }
    }
    //Board move with ball if game hasn't started
    boardballmove(x, y) {
        this.x = x;
        this.y = y;
        this.dy = -0.5;
        this.up = 1;
        this.down = 0;
    }


    //Updating Score 1 Here******

    rebound(x, y) {
        if (this.y + this.radius >= y) {
            if (this.x >= x && this.x <= x + board_length) {
                let hittingpoint = this.x - x;
                this.speedAngle = (160 * board_length - 140 * hittingpoint) / board_length;
                this.speedX = this.Speed * Math.cos(this.speedAngle * Math.PI / 180);
                this.speedY = this.Speed * Math.sin(this.speedAngle * Math.PI / 180);
                if (this.speedY > 0) {
                    this.speedY = -this.speedY;
                }
                if (this.Speed <= 50) {
                    this.Speed++;
                }
                updating_score(1);
                console.log('this is the speed of the ball:' + this.Speed);
            }
        }
    }
    gameEnd() {
        if (this.y + this.radius >= canvas.height - board_height_from_bottom / 2) {
            if (this.x >= 0 && this.x <= canvas.width) {
                game_start = 0;
                game_end = 1;
                return 'end';
            }
        }
    }
}

//All functions
function clickStart() {
    const clickStart = document.getElementsByClassName('left')[0];
    let High_score = document.getElementsByClassName('middle')[0];

    if (game_start == 1) {
        clickStart.classList.add('hidden');
        High_score.classList.add('hidden');
    }
    else {
        High_score.innerText = 'HighScore: ' + high_score;
        clickStart.classList.remove('hidden');
        High_score.classList.remove('hidden');
    }
}

function updating_score(rebound) {
    let score = document.getElementsByClassName('right')[0];
    let x = Number.parseInt(score.innerText);
    if (rebound == 1) {
        x++;
        score.innerText = x;
    }
    if (rebound == 2) {
        if (x > high_score) {
            high_score = x;
        }
        score.innerText = x;
    }
    if (rebound == 3) {
        score.innerText = 0;
    }

}
function initiate() {

    // for board ball game
    board = new Board();
    ball = new Ball(board.x, board.y - ball_height_from_board);

    //No need to re-initiate the dots for spiral since in its class 'Revolutions',center is always the center of screen

    for (let i = 0; i < dots; i++) {
        dummyRadius += 4;
        dotsArray.push(new Revolutions(dummyRadius));
        hue += 20;
    }
}




function updatedots() {
    for (let i = 0; i < dots; i++) {
        dotsArray[i].draw();
        dotsArray[i].update();
    }
}



function updatefunctions() {

    board.draw();
    ball.draw();
    clickStart();
    hue_mainball++;
    if (game_start == 0) {
        ball.initially();
    }
    window.addEventListener('mousemove', () => {
        board.update();
        if (game_start == 0) {
            ball.boardballmove(board.x, board.y - ball_height_from_board);
        }
    })

    //Updating Score 3 here ***
    if (game_start == 0) {
        window.addEventListener('click', () => {
            game_start = 1;
            game_end = 0;
            updating_score(3);
        })
    }


    // Updating Score 2 here***


    if (game_start == 1) {
        ball.update();
        ball.rebound(board.x - board_length / 2, board.y);
        if (ball.gameEnd() == 'end') {
            board = new Board();
            ball = new Ball(board.x, board.y - ball_height_from_board);
            updating_score(2);
        }
    }
    updatedots();

}


//Animation function
function animate() {
    c.fillStyle = 'rgba(0,0,0,0.3)';
    let temp = canvas.height - board_height_from_bottom - board_thickness - ball_height_from_board;
    c.fillRect(0, 0, canvas.width, temp);
    c.clearRect(0, temp, canvas.width, canvas.height);

    requestAnimationFrame(animate);
    updatefunctions();

}

//Kick starter
initiate();
animate();