class GalleryL1 extends Phaser.Scene {

    constructor() {
        super("GalleryL1");
        this.my = {sprite: {}};

        this.playerSpeed = 8;
        this.bulletSpeed = 18;

        this.bulletCooldown = .35; // bullet cooldown in seconds
        this.bulletCooldownCounter = 0;
    }
    
    preload() {
        this.load.setPath("./assets/");
        this.load.image("player_def", "sprites/ship_0022.png");
        this.load.image("bullet_def", "tiles/tile_0000.png");
    }
    
    create() {
        let my = this.my
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "player_def", null, this.left, this.right, this.playerSpeed);
        my.sprite.player.setScale(2);

        // In this approach, we create a single "group" game object which then holds up
        // to 10 bullet sprites
        // See more configuration options here: 
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "bullet_def",
            maxSize: 15,
            runChildUpdate: true
            }
        )

        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);
    }

    update(time, delta) {
        let my = this.my;
        this.bulletCooldownCounter -= delta / 1000;

        // Check for bullet being fired
        if (this.space.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                }
            }
        }

        my.sprite.player.update(delta);
    }
}