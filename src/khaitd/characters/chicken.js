/**
 * Created by CPU12757-local on 7/15/2020.
 */

var Chicken = cc.Sprite.extend({
    active: true,
    HP: 2,
    _v: 0,
    _vFrame: 0,
    pixelPerLoopFrame: 30,
    screen: null,
    typeOfBullet: 1,


    ctor: function (screen) {
        this._super(cc.spriteFrameCache.getSpriteFrame("up.png"));
        this.setV(250);
        this.screen = screen;
        this.schedule(this.randomAction.bind(this), 3);
    },

    randomAction: function () {
        setTimeout(this.addEggs.bind(this), Math.random() * LEVEL_TIME_EGG);
    },
    addEggs: function () {
        if (this.active) {
            var bullet = new Bullet(BULLET.EGG.TYPE);
            bullet.setScale(0.5);

            if (tool.randomBool()) {
                bullet.setV((tool.randomBool() ? 1 : -1) * Math.random() * 100, -200)
            }

            var pos = this.getPosition()
            bullet.setPosition(pos.x, pos.y - 25);
            if(this.screen) {
                this.screen.addChild(bullet);
                this.screen.bullets.push(bullet);
            }
        }
    },

    setV: function (v) {
        this._v = v;
        this._vFrame = this.pixelPerLoopFrame / v;
    },

    turnRight: function () {
        var len = 0.6 * this._v;
        var rightSide = this.rightSide(0.6)
        var turnRightAction = new cc.MoveBy(0.6, cc.p(len, 0));
        const spawn = new cc.Spawn(turnRightAction, rightSide);
        this.stopAllActions();
        this.runAction(new cc.RepeatForever(spawn))
    },

    rightSide: function (time) {
        var animationFrames = [];
        var frame1 = cc.spriteFrameCache.getSpriteFrame("right.png");
        var frame2 = cc.spriteFrameCache.getSpriteFrame("right2.png");
        var frame3 = cc.spriteFrameCache.getSpriteFrame("right3.png");

        animationFrames.push(frame1);
        animationFrames.push(frame2);
        animationFrames.push(frame3);

        var animation3 = new cc.Animation(animationFrames, 1 / 3 * this._vFrame, Math.max(Math.round(time / this._vFrame), 1));
        return cc.animate(animation3);
    },

    turnLeft: function () {
        var len = 0.6 * this._v;
        var leftSide = this.leftSide(0.6)
        var turnLeftAction = new cc.MoveBy(0.6, cc.p(-len, 0));
        const spawn = new cc.Spawn(turnLeftAction, leftSide);
        this.stopAllActions();
        this.runAction(new cc.RepeatForever(spawn))
    },

    leftSide: function (time) {
        var animationFrames = [];
        var frame1 = cc.spriteFrameCache.getSpriteFrame("left.png");
        var frame2 = cc.spriteFrameCache.getSpriteFrame("left2.png");
        var frame3 = cc.spriteFrameCache.getSpriteFrame("left3.png");
        animationFrames.push(frame1);
        animationFrames.push(frame2);
        animationFrames.push(frame3);
        var animation3 = new cc.Animation(animationFrames, 1 / 3 * this._vFrame, Math.max(Math.round(time / this._vFrame), 1));
        return cc.animate(animation3);
    },

    goUp: function () {
        var len = 0.4 * this._v;
        var upSide = this.upSide(0.4)
        var goUpAction = new cc.MoveBy(0.4, cc.p(0, len));
        const spawn = new cc.Spawn(goUpAction, upSide);
        this.stopAllActions();
        this.runAction(new cc.RepeatForever(spawn))
    },
    upSide: function (time) {
        var animationFrames = [];
        var frame1 = cc.spriteFrameCache.getSpriteFrame("up.png");
        var frame2 = cc.spriteFrameCache.getSpriteFrame("up2.png");
        animationFrames.push(frame1);
        animationFrames.push(frame2);
        var animation3 = new cc.Animation(animationFrames, 1 / 2 * this._vFrame, Math.max(Math.round(time / this._vFrame), 1));
        return cc.animate(animation3);
    },


    downSide: function (time) {
        var animationFrames = [];
        var frame1 = cc.spriteFrameCache.getSpriteFrame("down.png");
        var frame2 = cc.spriteFrameCache.getSpriteFrame("down2.png");
        animationFrames.push(frame1);
        animationFrames.push(frame2);
        var animation3 = new cc.Animation(animationFrames, 1 / 2 * this._vFrame, Math.max(Math.round(time / this._vFrame), 1));
        return cc.animate(animation3);
    },
    goDown: function () {
        var len = 0.4 * this._v;
        var downSide = this.downSide(0.4);
        var goDownAction = new cc.MoveBy(0.4, cc.p(0, -len));
        const spawn = new cc.Spawn(goDownAction, downSide);
        const repeatAction = new cc.RepeatForever(spawn);
        this.stopAllActions();
        this.runAction(repeatAction)
    },
    moveBy: function (x, y, getAction) {
        var cos = Math.sqrt(x * x / (x * x + y * y));
        cos = x < 0 ? -cos : cos;
        const length = Math.sqrt(x * x + y * y);
        const time = length / this._v;
        const action = new cc.MoveBy(time, cc.p(x, y));
        const cos45 = Math.cos(Math.PI / 4)
        var side = null;
        if (cos >= cos45) {
            side = this.rightSide(time);
        }

        if (cos <= -cos45) {
            side = this.leftSide(time);
        }

        if (Math.abs(cos) < cos45) {
            if (y > 0) {
                side = this.upSide(time)
            }
            else {
                side = this.downSide(time)
            }
        }

        const act = new cc.Spawn(side, action);
        if (getAction) {
            return act;
        } else {
            this.stopAllActions()
            this.runAction(act);
        }
    },

    goRandom: function () {
        if (this.active) {
            var random = Math.floor(Math.random() * 4);
            //this.setV(Math.random() * 300);
            const actions = [this.turnLeft.bind(this), this.turnRight.bind(this), this.goDown.bind(this), this.goUp.bind(this)]
            actions[random]();
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
    //followPath: function (posArr, getAction) {
    //    var actions = [];
    //    for (var i = 0; i < posArr.length; i++) {
    //        actions.push(this.moveBy(posArr[i].x, posArr[i].y, true))
    //    }
    //    const sequence = new cc.Sequence(actions);
    //    if (getAction) {
    //        return sequence;
    //    }
    //    this.stopAllActions();
    //    this.runAction(sequence)
    //},
    update: function (dt) {
        if (this.active) {
            if (this.x <= 0) {
                this.x = WIN_SIZE.width;
            }
            else if (this.x >= WIN_SIZE.width) {
                this.x = 0;
            }
            else if (this.y <= 0) {
                this.y=1;
                this.goUp();
            }
            else if (this.y >= WIN_SIZE.height) {
                this.y= WIN_SIZE.height-1
                this.goDown();
            }
        }
    },
    destroy: function () {
        this.active = false;
        var ac = cc.RotateBy(0.5, 720);
        var cb = cc.callFunc(function () {
            this.setVisible(false);
            this.removeFromParent()
        }, this);
        var disappear = cc.spawn(ac, cc.scaleTo(0.5, 0.1));
        this.runAction(cc.sequence(disappear, cb));
    }
})
