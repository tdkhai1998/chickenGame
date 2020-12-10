/**
 * Created by CPU12757-local on 7/23/2020.
 */
var Bullet = cc.Sprite.extend({
    v_x: 0,
    v_y: -200,
    HP: 100,
    active: true,
    mainAxis: {x: 0, y: -1},
    power: 1,

    ctor: function (type) {
        if(type==BULLET.EGG.TYPE){
            this._super(res.eggs_png);
            this.setTag(BULLET.EGG.TAG);
            this.setScale(0.8);
        }
        else if(type===2){
            this._super(res.bullet2);
            this.setTag(BULLET.SHIP_B.TAG);
        }
        else{
            this._super(res.bullet);
            this.setTag(BULLET.SHIP_B.TAG);
        }
        this.init();
        this.setAnchorPoint(0.5, 1);
    },
    setV: function (x, y) {
        this.v_x = x;
        this.v_y = y;
        var angle = tool.angelBetween(this.mainAxis, {x: x, y: y});
        if(!isNaN(angle)){
        if (x > 0) {
            this.setRotation(- angle);
        }
        else {
            this.setRotation(angle);
        }}
    },

    init: function () {

    },

    update: function (dt) {
        if(this.active) {
            var x = this.x, y = this.y;
            this.x = x + this.v_x * dt;
            this.y = y + this.v_y * dt;

            if (this.tag === BULLET.EGG.TAG) {
                if (this.y <= 25) {

                    this.setV(0, 0);
                    //var frame1 = new cc.SpriteFrame("assests/broken_egg.png");
                    //var animation3 = new cc.Animation([frame1,frame1], 0.1,2);
                    var cb = cc.callFunc(function () {
                        this.destroy()

                    }, this);
                    this.runAction(cc.sequence( cc.delayTime(1), cb));
                }
            }
            else if (x < 0 || x > WIN_SIZE.width || y < 0 || y > WIN_SIZE.height || this.HP <= 0) {
                this.destroy();
            }
        }
    },

    destroy: function () {
        //this.cleanup();
        this.active = false;
        this.setVisible(false);
    }
});

