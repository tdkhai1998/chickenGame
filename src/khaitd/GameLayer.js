/**
 * Created by trand on 7/22/2020.
 */

var LEVEL_TIME_EGG = 50000;
var Gamecreen = cc.Layer.extend({
    chickens: [],
    bullets: [],
    gifts: [],
    ship: null,
    background2: null,
    background: null,
    mouse: {x: 0, y: 0},
    score: 0,
    live: 2,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        LEVEL_TIME_EGG = 50000;
        this.chickens = [];
        this.bullets = [];
        this.gifts = [];
        this.ship = null;
        this.background2 = null;
        this.background = null;
        this.mouse = {x: WIN_SIZE.width/2, y: 100};
        this.score = 0;
        this.live = 2;

        var scoreText = new cc.LabelTTF("Your Score:", "Arial Bold", 24);
        this.addChild(scoreText, 10);
        scoreText.x = 50;
        scoreText.y = WIN_SIZE.height - 50;
        scoreText.setAnchorPoint(0, 0.5);
        this.scoreText = scoreText;

        var liveText = new cc.LabelTTF("Your heart:", "Arial Bold", 24);
        this.addChild(liveText, 100);
        liveText.x = 50;
        liveText.y = WIN_SIZE.height - 100;
        liveText.setAnchorPoint(0, 0.5);
        this.liveText = liveText;

        var spaceShip = new SpaceShip();
        spaceShip.setPosition(WIN_SIZE.width / 2, 100)
        this.addChild(spaceShip);
        this.ship = spaceShip;

        var gift = new Gift();
        gift.setPosition(500, WIN_SIZE.height);
        this.addChild(gift, 100);
        this.gifts.push(gift);


        this.registerMouse();
        this.scheduleUpdate();
        this.schedule(this.clean, 3);
        cc.audioEngine.setMusicVolume(0.5);
        cc.audioEngine.playMusic("assests/background", true);
        this.createEnemies();

    },
    clean: function () {
        const chickenArr = [];
        this.chickens.forEach(function (i) {
            if (i.active) {
                chickenArr.push(i);
            }
        })

        this.chickens = chickenArr;
        if (chickenArr.length === 0) {
            this.scheduleOnce(this.createEnemies.bind(this), 2);

        }

        const bulletArr = [];
        this.bullets.forEach(function (i) {
            if (i.active) {
                bulletArr.push(i);
            }
        })
        this.bullets = bulletArr;

        var giftArr=[];
        this.gifts.forEach(function (i) {
            if (i.active) {
                giftArr.push(i);
            }
        });
        this.gifts=giftArr;
    },
    createEnemies: function () {
        LEVEL_TIME_EGG = Math.max(LEVEL_TIME_EGG - 5000, 5000);
        if (tool.randomBool()) {
            this.level1();
        } else {
            this.level2();
        }
    },
    level1: function () {
        for (var i = 0; i < 20; i++) {
            var b = new Chicken2(this);
            this.addChild(b);
            var x = i * 80;
            b.setPosition(x > WIN_SIZE.width ? 2 * WIN_SIZE.width - x : x, WIN_SIZE.height + i * 50);
            this.chickens.push(b);
        }

    },


    level2: function () {
        for (var i = 0; i < 10; i++) {
            var b = new Chicken2(this);
            this.addChild(b);
            var x = i * 150;
            b.setPosition(x > WIN_SIZE.width ? x - WIN_SIZE.width : x, WIN_SIZE.height - 150);
            this.chickens.push(b);
        }

        for (var i = 0; i < 10; i++) {
            var b = new Chicken2(this);
            this.addChild(b);
            var x = i * 150;
            b.setPosition(x > WIN_SIZE.width ? x - WIN_SIZE.width : x, WIN_SIZE.height);
            this.chickens.push(b);
        }
    },

    registerMouse: function () {
        if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: this.onMouseDown.bind(this),
                onMouseMove: this.onMouseMove.bind(this),

            }, this);
        } else {
            cc.log("MOUSE Not supported");
        }
    },

    onMouseMove: function (event) {
        this.mouse = event.getLocation();
    },

    onMouseDown: function (event) {
        this.ship.shot(this);
    },

    update: function (dt) {

        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(dt);
        }
        for (var i = 0; i < this.chickens.length; i++) {
            this.chickens[i].update(dt);
        }

        for (var i = 0; i < this.gifts.length; i++) {
            this.gifts[i].update(dt);
        }

        this.ship.update(dt);
        if (this.ship.active) {
            const delX = this.mouse.x - this.ship.x;
            const delY = this.mouse.y - this.ship.y;
            this.ship.setV(delX / (dt * 2), delY / (dt * 2));
        }

        this.scoreText.setString("Your score: " + this.score);
        this.liveText.setString("Your heart: " + this.live);
        this.checkCollide();
    },

    checkCollide: function () {
        for (var i = 0; i < this.chickens.length; i++) {
            var chicken = this.chickens[i];
            for (var e = 0; e < this.bullets.length; e++) {
                var bullet = this.bullets[e];
                if (bullet.active && bullet.tag == BULLET.SHIP_B.TAG && 1 && this.collide(bullet, chicken)) {
                    const chickenIsDestroyed = chicken.hurt(bullet.power);
                    if (chickenIsDestroyed && chicken.double) {
                        this.addChicken(chicken.getPosition());
                    }
                    this.bullets[e].destroy();
                    if (chickenIsDestroyed) {
                        this.incScore();
                    }
                }
            }
            if (this.collide(this.ship, chicken)) {
                this.ship.destroy();
                chicken.destroy();
                this.live -= 1;
                if (this.live === 0) {
                    this.gameOver();
                }
                else {
                    setTimeout(this.renewShip.bind(this), 2000);
                }
                break;
            }
        }
        for (var e = 0; e < this.bullets.length; e++) {
            var bullet = this.bullets[e];
            if (bullet.tag === BULLET.EGG.TAG && this.collide(this.ship, bullet)) {
                bullet.destroy();
                this.ship.destroy();
                this.live -= 1;
                if (this.live === 0) {
                    this.gameOver();
                }
                else {
                    setTimeout(this.renewShip.bind(this), 2000);
                };
                break;
            }
        }
        for (var e = 0; e < this.gifts.length; e++) {
            const gift = this.gifts[e];
            if (this.collide(this.ship, gift)) {
                this.ship.receive(gift);
                cc.audioEngine.playEffect("assests/gift.mp3")
                gift.destroy();
            }
        }
    },
    renewShip: function () {
        this.ship.cleanup();
        this.ship.active = false;
        this.ship.removeFromParent();
        var spaceShip = new SpaceShip();
        spaceShip.setPosition(WIN_SIZE.width / 2, 50)
        this.addChild(spaceShip);
        this.ship = spaceShip;
    },
    addChicken: function (pos) {
        const chicken = new Chicken(this);
        const chicken2 = new Chicken(this);
        this.addChild(chicken)
        this.addChild(chicken2);
        this.chickens.push(chicken);
        this.chickens.push(chicken2);
        chicken.setPosition(pos.x - 10, pos.y);
        chicken2.setPosition(pos.x + 10, pos.y);
        chicken.HP = 1;
        chicken2.HP = 1;
        chicken.double = false;
        chicken2.double = false;
        chicken.setScale(1);
        chicken2.setScale(1);
        chicken.goRandom();
        chicken2.goRandom();
    },

    collide: function (a, b) {
        if (!a.active || !b.active) return false;

        var ax = a.x, ay = a.y, bx = b.x, by = b.y;

        var heightTotal = a.height + b.height;
        var widthTotal = a.width + b.width;
        var delX = Math.abs(ax - bx);
        var delY = Math.abs(ay - by);

        if (delX > widthTotal / 2 || delY > heightTotal / 2) {
            return false;
        }
        return true;
    },

    gameOver: function () {
        var gameOver = new cc.Sprite("assests/game-over.png");
        gameOver.setPosition(WIN_SIZE.width / 2, WIN_SIZE.height / 2);
        this.addChild(gameOver);

        var rePlay = UI.commonButton(200, 64, WIN_SIZE.width / 2, WIN_SIZE.height / 2 - 200, "Play again");
        rePlay.addClickEventListener(this.replay.bind(this));
        this.addChild(rePlay);

    },

    clear: function () {
        for (var e = 0; e < this.bullets.length; e++) {
            this.bullets[e].destroy();
        }
        for (var e = 0; e < this.chickens.length; e++) {
            if (this.chickens[e].active)
                this.chickens[e].destroy();
        }
        for (var e = 0; e < this.gifts.length; e++) {
            this.gifts[e].destroy();
        }
        this.bullets = [];
        this.chickens = [];
        this.gifts = [];
    },

    replay: function () {
        this.clear();
        this.getParent().replay();;
    },

    incScore: function () {
        this.score += 1;
        if (this.score % 30 === 0) {
            this.addGift();

        }
    },

    addGift: function () {
        var gift = new Gift(tool.randomBool() ? 1 : 2);
        gift.setPosition(Math.random() * WIN_SIZE.width, WIN_SIZE.height);
        this.addChild(gift, 200);
        this.gifts.push(gift);
    },

})

var GameBackground = cc.Layer.extend({
    planets: [],
    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {

        var background = new cc.Sprite(res.background);
        background.setAnchorPoint(0, 0);
        background.setPosition(0, 0);
        background.setPositionY(0);
        this.addChild(background, -20);
        this.background = background;

        var background2 = new cc.Sprite(res.background);
        background2.setAnchorPoint(0, 0);
        background2.setPosition(0, 0);
        background2.setPositionY(-background2.height);
        this.addChild(background2, -20);
        this.background2 = background2;

        this.generatePlanets();
        this.schedule(this.update.bind(this), 0.05)
    },

    generatePlanets: function () {
        for (var i = 0; i < 15; i++) {
            const l = i + 2 < 10 ? "0" + (i + 2) : (i + 2) + "";
            var planet = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("planet_" + l + ".png"));
            const scale = Math.random() * 0.5;
            planet.setScale(scale);
            planet.setOpacity(scale * 100);
            planet.v = Math.max(scale * 50);
            planet.setPosition(Math.random() * WIN_SIZE.width, -planet.height + Math.random() * 1000);
            this.planets.push(planet);
            this.addChild(planet, scale*10 );

        }
    },
    update: function (dt) {
        for (var i = 0; i < this.planets.length; i++) {
            var planet = this.planets[i];
            planet.y += dt * planet.v;
            if (planet.y >= WIN_SIZE.height) {
                planet.setPosition(Math.random() * WIN_SIZE.width, -planet.height);
            }
        }


        if (this.background.y >= WIN_SIZE.height) {
            this.background.y = this.background2.y - this.background2.height;
        }
        this.background.y += dt * 20;



        if (this.background2.y >= WIN_SIZE.height) {
            this.background2.y = this.background.y - this.background2.height;
        }
        this.background2.y += dt * 20;
    },
    clear: function () {
        this.planets.length = 0;
        this.unscheduleUpdate();
    }
})
Gamecreen.scene = function () {
    var scene = new cc.Scene();
    var layer = new Gamecreen();
    var layer2 = new GameBackground();

    scene.addChild(layer);
    scene.addChild(layer2, -1);

    scene.replay = function () {
        layer2.clear();
        cc.director.runScene(Gamecreen.scene());
    }
    return cc.TransitionFade(1.2, scene);
}