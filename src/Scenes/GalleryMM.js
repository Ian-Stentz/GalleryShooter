class GalleryMM extends Phaser.Scene {

    constructor() {
        super("GalleryMM");
    }
    preload() {
        this.load.setPath("./assets/tiles/");
        // Load tilemap information
        this.load.image("BackgroundTileset", "tiles_packed.png");                         
        // Packed tilemap
        this.load.tilemapTiledJSON("Background-Tiles", "Background-Tiles.tmj");
    }
    create() {
        // Create a new tilemap game object which uses 16x16 pixel tiles, and is
        // 25 tiles wide and 20 tiles tall.
        this.map = this.add.tilemap("Background-Tiles", 16, 16, 25, 20);        
        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("BackgroundTilesPacked", "BackgroundTileset");
        this.groundLayer = this.map.createLayer('Background', this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);

        const text = this.add.text(game.config.width/2,game.config.height/2,"Press Space to Begin", {color: '#000', stroke: '#000',align: 'center'}).setOrigin(0.5);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        if(this.space.isDown) {
            this.scene.restart();
            this.scene.switch("GalleryL1");
        }
    }
}