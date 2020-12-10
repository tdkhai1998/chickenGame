/**
 * Created by CPU12757-local on 7/17/2020.
 */



var SpaceShip = cc.Sprite.extend({
    v_x: -100,
    v_y: -200,
    active: true,
    levelBullet: 1,
    typeOfBullet: 1,

    ctor: function () {
        this._super("assests/spaceship/ship.png")
    },

    setV: function (x, y) {
        this.v_x = x;
        this.v_y = y;

    },

    receive: function (gift) {
        if (gift.type === this.typeOfBullet) {
            this.levelBullet += 1;
        } else {
            this.typeOfBullet = gift.type;
            this.levelBullet = 1;
        }
    },

    update: function (dt) {
        if(this.active) {
            this.x += this.v_x * dt;
            this.y+= this.v_y * dt;
        }
    },

    destroy: function () {
        this.cleanup();
        cc.audioEngine.playEffect(res.boom_mp3);
        this.active = false;
        this.v_x = 0;
        this.v_y = 0;
        var cb = cc.callFunc(function () {
            this.setVisible(false);
        }, this);
        var disappear = cc.sequence(Explosion.getAnimation(), cb);
        this.runAction(disappear);
    },
    shot: function (srceen) {
        if (this.active) {
            //cc.audioEngine.playEffect(res.bullet_mp3);
            switch (this.levelBullet) {
                case 1:
                {
                    var bullet = new Bullet(this.typeOfBullet);
                    bullet.setV(0, 200);
                    bullet.setPosition(this.getPosition());
                    srceen.addChild(bullet);
                    srceen.bullets.push(bullet);
                    break;

                }

                case 2:
                {
                    var bullet = new Bullet(this.typeOfBullet);
                    bullet.setV(0, 200);
                    bullet.setPosition(this.x - 5, this.y);
                    bullet.setPosition(this.x - 5, this.y);
                    srceen.addChild(bullet);
                    srceen.bullets.push(bullet);

                    var bullet2 = new Bullet(this.typeOfBullet);
                    bullet2.setV(0, 200);
                    bullet2.setPosition(this.x + 5, this.y);
                    srceen.addChild(bullet2);
                    srceen.bullets.push(bullet2);
                    break;
                }


                case 3:

                {
                    var bullet = new Bullet(this.typeOfBullet);
                    bullet.setV(0, 200);
                    bullet.setPosition(this.x, this.y);
                    srceen.addChild(bullet);
                    srceen.bullets.push(bullet);

                    var bullet2 = new Bullet(this.typeOfBullet);
                    bullet2.setV(100, 200);
                    bullet2.setPosition(this.x + 10, this.y);
                    srceen.addChild(bullet2);
                    srceen.bullets.push(bullet2);

                    var bullet3 = new Bullet(this.typeOfBullet);
                    bullet3.setV(-100, 200);
                    bullet3.setPosition(this.x - 10, this.y);
                    srceen.addChild(bullet3);
                    srceen.bullets.push(bullet3);
                    break;
                }
                case 4:
                {
                    var bullet = new Bullet(this.typeOfBullet);
                    bullet.setV(0, 200);
                    bullet.setPosition(this.x - 5, this.y);
                    srceen.addChild(bullet);
                    srceen.bullets.push(bullet);

                    var bullet2 = new Bullet(this.typeOfBullet);
                    bullet2.setV(0, 200);
                    bullet2.setPosition(this.x + 5, this.y);
                    srceen.addChild(bullet2);
                    srceen.bullets.push(bullet2);

                    var bullet3 = new Bullet(this.typeOfBullet);
                    bullet3.setV(100, 200);
                    bullet3.setPosition(this.x - 30, this.y);
                    srceen.addChild(bullet3);
                    srceen.bullets.push(bullet3);

                    var bullet4 = new Bullet(this.typeOfBullet);
                    bullet4.setV(-100, 200);
                    bullet4.setPosition(this.x + 30, this.y);
                    srceen.addChild(bullet4);
                    srceen.bullets.push(bullet4);
                    break;
                }
                case 5:
                default:
                {
                    var bullet = new Bullet(this.typeOfBullet);
                    bullet.setV(0, 200);
                    bullet.setPosition(this.x, this.y);
                    srceen.addChild(bullet);
                    srceen.bullets.push(bullet);

                    var bullet2 = new Bullet(this.typeOfBullet);
                    bullet2.setV(100, 200);
                    bullet2.setPosition(this.x - 20, this.y);
                    srceen.addChild(bullet2);
                    srceen.bullets.push(bullet2);

                    var bullet3 = new Bullet(this.typeOfBullet);
                    bullet3.setV(100, 200);
                    bullet3.setPosition(this.x + 30, this.y);
                    srceen.addChild(bullet3);
                    srceen.bullets.push(bullet3);

                    var bullet4 = new Bullet(this.typeOfBullet);
                    bullet4.setV(-100, 200);
                    bullet4.setPosition(this.x + 20, this.y);
                    srceen.addChild(bullet4);
                    srceen.bullets.push(bullet4);

                    var bullet5 = new Bullet(this.typeOfBullet);
                    bullet5.setV(-100, 200);
                    bullet5.setPosition(this.x - 30, this.y);
                    srceen.addChild(bullet5);
                    srceen.bullets.push(bullet5);
                }

            }

        }
    }
});
