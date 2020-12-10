/**
 * Created by trand on 7/26/2020.
 */



var Chicken2 = cc.Sprite.extend({

    active: true,
    HP: 2,
    _v: 0,
    _vFrame: 0,
    pixelPerLoopFrame: 30,
    double: true,
    screen: null,
    typeOfBullet: 1,
    v_x: 20,
    v_y: -50,

    ctor: function (screen) {
        this._super(cc.spriteFrameCache.getSpriteFrame("chicken_1.png"));
        this.screen = screen;
        this.runAction(cc.repeatForever(cc.animate(Chicken2.getStandAnimation())))
        this.schedule(this.randomAction.bind(this), 2);
    },


    randomAction: function () {
        setTimeout(this.addEggs.bind(this), Math.random() * LEVEL_TIME_EGG)
    },

    addEggs: function () {
        if (this.active && this.screen) {
            var bullet = new Bullet(BULLET.EGG.TYPE);
            this.screen.addChild(bullet);
            this.screen.bullets.push(bullet);
            if (tool.randomBool()) {
                bullet.setV((tool.randomBool() ? 1 : -1) * Math.random() * 100, -200)
            }
            bullet.setPosition(this.x, this.y - 25);

        }
    },

    hurt: function (hp) {
        var p = hp || 1;
        cc.audioEngine.playEffect(res.chiken_mp3);
        this.runAction(cc.sequence(cc.rotateTo(0.05, 15), cc.rotateTo(0.05, 0)))
        this.HP -= p;
        if (this.HP <= 0) {
            this.HP = 0;
            this.destroy();
            return true;
        }
        else {
            return false;
        }
    },

    update: function (dt) {
        if (this.active) {
            this.x += this.v_x * dt;
            this.y += +this.v_y * dt;

            if (this.x < 0 || this.x > WIN_SIZE.width) {

                if (this.x < 0) {
                    this.x = 1;
                }
                else {
                    this.x = WIN_SIZE.width - 1
                }
                this.v_x *= -1;
            }

            if (this.y > WIN_SIZE.height || this.y < 0) {
                if (this.y < 0) {
                    this.y = 1;
                }
                else {
                    this.y = WIN_SIZE.height - 1
                }
                this.v_y *= -1;
            }


        }
    },
    clear: function () {
        this.screen = null
    },
    destroy: function () {
        var ac = cc.RotateBy(0.5, 720);
        this.active = false;
        var cb = cc.callFunc(function () {
            this.setVisible(false);
            this.removeFromParent()
        }, this);
        var disappear = cc.spawn(ac, cc.scaleTo(0.5, 0.1));
        this.runAction(cc.sequence(disappear, cb));
    }
});
Chicken2.getStandAnimation = function () {
    const anim = cc.animationCache.getAnimation("chicken2_stand");
    if (anim) {
        return anim;
    }
    var animationFrames = [];
    var frame1 = cc.spriteFrameCache.getSpriteFrame("chicken_1.png");
    var frame2 = cc.spriteFrameCache.getSpriteFrame("chicken_2.png");
    var frame3 = cc.spriteFrameCache.getSpriteFrame("chicken_3.png");
    var frame4 = cc.spriteFrameCache.getSpriteFrame("chicken_2.png");
    animationFrames.push(frame1);
    animationFrames.push(frame2);
    animationFrames.push(frame3);
    animationFrames.push(frame4);
    var animation3 = new cc.Animation(animationFrames, 0.1, 1);
    cc.animationCache.addAnimation(animation3, "chicken2_stand");
    return animation3
}
