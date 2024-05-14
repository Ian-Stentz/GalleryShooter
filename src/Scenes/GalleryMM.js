class GalleryMM extends Phaser.Scene {

    constructor() {
        super("GalleryMM");
    }
    preload() {

    }
    create() {
        this.text = this.add.text(screen.width/2,screen.height/2,"Press Space to Begin", {stroke: '#000', align: "center"});
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        if(this.space.isDown) {
            this.scene.switch("GalleryL1");
        }
    }
}