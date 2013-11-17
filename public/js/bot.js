 // gameObj

var Game = {
    active: false,
    liveBots: 0
};

//script for the bot program
window.onload = function () {

    // get DOM elements
    var stage = document.getElementById('stage'),
        samBotDOM = document.getElementById('samBot'),
        enemyBot1DOM = document.getElementById('enemyBot1'),
        enemyBot2DOM = document.getElementById('enemyBot2'),
        enemyBot3DOM = document.getElementById('enemyBot3'),
        enemyBot4DOM = document.getElementById('enemyBot4');

    var samSettings = {
        speed: 17,
        startPos: {
            x: 0,
            y: 0
        },
        vision: {
            length: 200,
            width: 50
        },
        angle: 45,
        health: 100
    },
    enemy1Settings = {
        speed: 13,
        startPos: {
            x: 100,
            y: 100
        },
        vision: {
            length: 70,
            width: 50
        },
        health: 100
    },
    enemy2Settings = {
        speed: 9,
        startPos: {
            x: 20,
            y: 300
        },
        vision: {
            length: 130,
            width: 50
        },
        angle: 90,
        health: 100
    },
    enemy3Settings = {
        speed: 20,
        startPos: {
            x: 400,
            y: 400
        },
        vision: {
            length: 100,
            width: 50
        },
        angle: 76,
        health: 100
    },
    enemy4Settings = {
        speed: 11,
        startPos: {
            x: 30,
            y: 400
        },
        vision: {
            length: 50,
            width: 50
        },
        angle: 240,
        health: 100
    };


    // create bot instances
    var gameBots = [Bot(samBotDOM,stage,samSettings),
        Bot(enemyBot1DOM,stage,enemy1Settings),
        Bot(enemyBot2DOM,stage,enemy2Settings),
        Bot(enemyBot3DOM,stage,enemy3Settings),
        Bot(enemyBot4DOM,stage,enemy4Settings)];

    // initialize bots
    for (var i=0; i < gameBots.length; i++) {
        gameBots[i].init();
    }

    Game.liveBots = gameBots.length;
    Game.active = true;

    // start the loop

    if (Game.active) {
        var gameLoop = setInterval(function () {
            for (var i=0; i < gameBots.length; i++) {
                gameBots[i].go();
            }
            if (Game.liveBots < 2) {
                Game.active = false;
                clearGameLoop();
            }
        }, 100);

        var clearGameLoop = function () {
            clearInterval(gameLoop);
            gameOver();
        }
    }
}

var gameOver = function () {
    alert('Game over!');
}


// bot object
var Bot = function (myBot,stage,settings) {

    // bot settings
    var speed = settings.speed,
        angle = settings.angle,
        velocity = {
            x: 0,
            y: 0
        },
        direction = {
            x: 1,
            y: 1
        },
        health = settings.health,
        bots = [],
        tracking = false,
        alive = true,
        vision = function (obj) {
            var vision =  myBot.getElementsByClassName('vision')[0];
            vision.style.width = settings.vision.length + 'px';
            vision.style.height = settings.vision.width + 'px';
            return vision;
        },
        bounding = function (obj) {
            return obj.getBoundingClientRect();
        },

        // main loop
        go = function () {

            if (alive) {
                var scaleX = Math.cos(angle),
                    scaleY = Math.sin(angle),
                    topPos = parseInt(myBot.style.top),
                    leftPos = parseInt(myBot.style.left);

                velocity.x = speed*direction.x;
                velocity.y = speed*direction.y;

                myBot.style.top = topPos+velocity.y + 'px';
                myBot.style.left = leftPos+velocity.x + 'px'

                checkForBot();
                checkForWalls();

                if (health < 30) {
                    myBot.style.boxShadow = '0 0 10px 5px rgba(255,0,0,10)'
                } if (health < 0) {
                    killBot();
                }
            } else {
                killBot();
            }
        },

        // stage collision detection
        checkForWalls = function () {
            var botBox = bounding(vision()),
                stageBox = bounding(stage);


            if (botBox.bottom > stageBox.bottom && direction.y > 0 ||
                botBox.top < stageBox.top && direction.y < 0) {
                direction.y *= -1;
                vision().style.backgroundColor = 'orange';
                health -= 5;
            }
            if (botBox.right > stageBox.right && direction.x > 0 ||
                botBox.left < stageBox.left && direction.x < 0) {
                direction.x *= -1;
                vision().style.backgroundColor = 'orange';
                health -= 5;
            }

            if (!tracking) {
                angle = Math.atan2(velocity.y, velocity.x)/(Math.PI/180);
            }
            myBot.style.webkitTransform = 'rotate(' + angle + 'deg)';
        },


        // helper TODO: change this somewhere
        getDistance = function (x1 , y1 , x2 , y2){
            xb = ((x2 - x1)*(x2 - x1));
            yb = ((y2 - y1)*(y2 - y1));
            return Math.sqrt(xb + yb);
        },
        // check for bot
        checkForBot = function () {
            var botBox = bounding(vision());
            var hits = [];
            for (var i=0;i<bots.length;i++) {
                var enemyBox = bounding(bots[i]);

                if(bots[i].id !== myBot.id) {
                    if (enemyBox.right < botBox.left ||
                       enemyBox.left > botBox.right ||
                       enemyBox.bottom < botBox.top ||
                       enemyBox.top > botBox.bottom) {
                    } else {
                        hits.push(enemyBox);
                    }
                }
            }
            if (hits.length > 0) {
                tracking = true;
                vision().style.backgroundColor = 'red';
                angle = Math.atan2(hits[0].top, hits[0].left)/(Math.PI/180);
            } else {
                tracking = false;
                vision().style.backgroundColor = 'transparent';
            }
        },

        // kill the bot
        killBot = function () {
            if (alive) {
                Game.liveBots -= 1;
            }
            alive = false;
            vision().style.backgroundColor = 'transparent';
            myBot.style.top = '105%';
            myBot.style.position = 'relative';
            myBot.style.float = 'left';
        },
        // get other bots
        getOtherBots = function () {
            return stage.getElementsByClassName('bot');
        },

        // initialize
        init = function () {
            myBot.style.top = settings.startPos.y + 'px';
            myBot.style.left = settings.startPos.x + 'px';
            bots = getOtherBots();
        };

    return {
        go: go,
        init: init
    }

};



