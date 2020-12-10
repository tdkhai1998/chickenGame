/**
 * Created by CPU12757-local on 7/24/2020.
 */
var Gift = cc.Sprite.extend({
    v_x: 0,
    v_y: -100,
    active: true,
    power: 1,

    ctor: function (type) {
        this.type=type||1;
        if(this.type===2) {
            this._super(res.gift2);
        }
        else{
            this._super(res.gift);
        }
    },

    update: function (dt) {
        var x = this.x, y = this.y;
        this.x = x + this.v_x * dt;
        this.y = y + this.v_y * dt;
        if (x < 0 || x > WIN_SIZE.width || y < 0 ) {
            this.destroy();
        }
    },

    destroy: function () {
        this.active = false;
        this.setVisible(false);
    }
})