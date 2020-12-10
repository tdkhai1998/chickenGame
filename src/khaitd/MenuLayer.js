

var MenuLayer = cc.Layer.extend({


    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        var winSize = WIN_SIZE;
        var newGame = UI.commonButton(200, 50, winSize.width / 2, winSize.height / 5, "New Game");
        this.addChild(newGame);
        newGame.addClickEventListener(this.newGame.bind(this));

        var background = new cc.Sprite("assests/background2.jpg");
        this.addChild(background, -10);


        background.setPosition(WIN_SIZE.width / 2, WIN_SIZE.height / 2);
        background.setScaleX(WIN_SIZE.width / background.width);
        background.setScaleY(WIN_SIZE.height / background.height);
        cc.audioEngine.playMusic("assests/background.mp3");

    },
    newGame: function () {
        cc.audioEngine.stopMusic();
        cc.director.runScene(Gamecreen.scene());
    }

});
MenuLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new MenuLayer();
    scene.addChild(layer);
    return new cc.TransitionFade(1.2, scene);
}