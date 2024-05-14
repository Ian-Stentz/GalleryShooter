class GalleryMM extends Phaser.Scene {

    constructor() {
        super("GalleryMM");
    }
    preload() {

    }
    create() {
        const text = this.add.text(game.config.width/2,game.config.height/2,"Press Space to Begin", {color: '#ffffff', stroke: '#ffffff',align: 'center'}).setOrigin(0.5);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        if(this.space.isDown) {
            this.scene.restart();
            this.scene.switch("GalleryL1");
        }
    }
}