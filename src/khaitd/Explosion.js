/**
 * Created by CPU12757-local on 7/23/2020.
 */

const Explosion={};
Explosion.getAnimation= function (){
    var animFrames = [];
    var str = "";
    for (var i = 1; i < 35; i++) {
        str = "explosion_" + (i < 10 ? ("0" + i) : i) + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrames.push(frame);
    }
    var animation = new cc.Animation(animFrames, 0.04);
    return cc.animate(animation);
}