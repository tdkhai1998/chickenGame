/**
 * Created by CPU12757-local on 7/23/2020.
 */

var tool = {};
tool.angelBetween = function (p1, p2) {
    var lenP1 = Math.sqrt(p1.x * p1.x + p1.y * p1.y);
    var lenP2 = Math.sqrt(p2.x * p2.x + p2.y * p2.y);
    var mulVec = p1.x * p2.x + p1.y * p2.y;
    var cos = mulVec / (lenP1 * lenP2);
    return Math.acos(cos) * 180 / Math.PI;
}
tool.randomBool = function () {
    return Math.random() > 0.5;
}