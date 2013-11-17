//script for the bot program
var Weapons = function () {

    // get DOM elements
    var stage = document.getElementById('stage'),
        samBotDOM = document.getElementById('samBot'),
        enemyBot1DOM = document.getElementById('enemyBot1'),
        enemyBot2DOM = document.getElementById('enemyBot2'),
        enemyBot3DOM = document.getElementById('enemyBot3'),
        enemyBot4DOM = document.getElementById('enemyBot4');

    var samSettings = {
        speedX: 7,
        speedY: 15,
        startPosX: 0,
        startPosY: 0,
        visionLength: 150,
        visionWidth: 50
    },
    enemy1Settings = {
        speedX: 20,
        speedY: 13,
        startPosX: 400,
        startPosY: 0,
        visionLength: 100,
        visionWidth: 50
    },
    enemy2Settings = {
        speedX: 5,
        speedY: 19,
        startPosX: 0,
        startPosY: 400,
        visionLength: 50,
        visionWidth: 50
    },
    enemy3Settings = {
        speedX: 18,
        speedY: 9,
        startPosX: 400,
        startPosY: 400,
        visionLength: 40,
        visionWidth: 50
    },
    enemy4Settings = {
        speedX: 8,
        speedY: 13,
        startPosX: 300,
        startPosY: 200,
        visionLength: 140,
        visionWidth: 50
    };


    // create bot instances
    var samBot = Bot(samBotDOM,stage,samSettings),
        enemyBot1 = Bot(enemyBot1DOM,stage,enemy1Settings),
        enemyBot2 = Bot(enemyBot2DOM,stage,enemy2Settings),
        enemyBot3 = Bot(enemyBot3DOM,stage,enemy3Settings),
        enemyBot4 = Bot(enemyBot4DOM,stage,enemy4Settings);

    // initialize bots
    samBot.init();
    enemyBot1.init();
    enemyBot2.init();
    enemyBot3.init();
    enemyBot4.init();

    // start the loop
    setInterval(function () {
        samBot.go();
        enemyBot1.go();
        enemyBot2.go();
        enemyBot3.go();
        enemyBot4.go();
    }, 100);
}


// bot object
var Bot = function (myBot,stage,settings) {

    // bot settings
    var speedX = settings.speedX,
        speedY = settings.speedY,
        speed = 10,
        angle = 45,
        direction = 0,
        bots = [],
        vision = function (obj) {
            var vision =  myBot.getElementsByClassName('vision')[0];
            vision.style.width = settings.visionLength + 'px';
            vision.style.height = settings.visionWidth + 'px';
            return vision;
        },
        bounding = function (obj) {
            return obj.getBoundingClientRect();
        },

        // main loop
        go = function () {
            var scaleX = Math.cos(angle),
                scaleY = Math.sin(angle),
                velocityX = speed*scaleX,
                velocityY = speed*scaleY,
                topPos = parseInt(myBot.style.top),
                leftPos = parseInt(myBot.style.left);

            myBot.style.top = topPos + velocityX + 'px';
            myBot.style.left = leftPos + velocityY + 'px'

            checkForBot();
            checkForWalls();
        },

        // stage collision detection
        checkForWalls = function () {
            var botBox = bounding(vision()),
                stageBox = bounding(stage);


            if (botBox.bottom > stageBox.bottom &&speed > 0 ||
                botBox.top < stageBox.top && speed < 0 ||
                botBox.right > stageBox.right && speed > 0 ||
                botBox.left < stageBox.left && speed < 0) {
                speed *= -1;
                vision().style.backgroundColor = 'orange';
            }
            //angle = Math.atan2(speedY, speedX)/(Math.PI/180);

            //myBot.style.webkitTransform = 'rotate(' + angle + 'deg)';
        },


        // helper TODO: change this somewhere
        getDistance = function (x1 , y1 , x2 , y2){
            xb = ((x2 - x1)*(x2 - x1));
            yb = ((y2 - y1)*(y2 - y1));
            return Math.sqrt(xb + yb);
        },
        // check for bot
        checkForBot = function () {2s
            var botBox = bounding(vision());
            var hits = [];
            for (var i=0;i<bots.length;i++) {
                var enemyBox = bounding(bots[i]);
                //var distance = getDistance(botBox.right, botBox.top+(botBox.height/2), enemyBox.left+(enemyBox.width/2), enemyBox.top+(enemyBox.height/2));

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
            if(hits.length > 0) {
                vision().style.backgroundColor = 'red';
            } else {
                vision().style.backgroundColor = 'transparent';
            }
        },

        // get other bots
        getOtherBots = function () {
            return stage.getElementsByClassName('bot');
        },

        // initialize
        init = function () {
            myBot.style.top = settings.startPosY + 'px';
            myBot.style.left = settings.startPosX + 'px';
            bots = getOtherBots();
        };

    return {
        go: go,
        init: init
    }

};