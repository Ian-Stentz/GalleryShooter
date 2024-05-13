class GalleryL1 extends Phaser.Scene {

    constructor() {
        super("GalleryL1");
        this.my = {sprite: {}, audio: {}, manager: null};

        this.playerSpeed = 8;
        this.bulletSpeed = 18;

        this.bulletCooldown = .35; // bullet cooldown in seconds
        this.bulletCooldownCounter = 0;

        this.powerupType = "None";
        this.powerupList = ["V","Piercing","Heavy","Double"];
    }
    
    preload() {
        //sprites folder
        this.load.setPath("./assets/sprites/");
        this.load.image("playerDef", "ship_0022.png");

        //tiles folder
        this.load.setPath("./assets/tiles/");
        this.load.image("bulletDef", "tile_0000.png");
        this.load.image("powerupDef", "tile_0017.png")

        //audio folder
        this.load.setPath("./assets/audio/");
        this.load.audio("shoot1", "laserSmall_000.ogg")
        this.load.audio("shoot2", "laserSmall_001.ogg")
        this.load.audio("shoot3", "laserSmall_002.ogg")
        this.load.audio("shoot4", "laserSmall_003.ogg")
        this.load.audio("shoot5", "laserSmall_004.ogg")
    }
    
    create() {
        let my = this.my
        my.manager = new Manager(this, 1);
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "playerDef", null, this.left, this.right, this.playerSpeed);
        my.sprite.player.setScale(2);

        my.audio.shootdef = ["shoot2", "shoot3", "shoot5"];
        my.audio.shootheavy = ["shoot1", "shoot4"];

        // In this approach, we create a single "group" game object which then holds up
        // to 10 bullet sprites
        // See more configuration options here: 
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "bulletDef",
            maxSize: 30,
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
        my.sprite.bulletGroup.propertyValueSet("rotation", 0);
    }

    update(time, delta) {
        let my = this.my;
        this.bulletCooldownCounter -= delta / 1000;

        // Check for bullet being fired
        if (this.space.isDown) {
            if (this.bulletCooldownCounter < 0) {
                this.shootBullet();
            }
        }

        my.sprite.player.update(time, delta);
        my.manager.update(time, delta);
        if(my.sprite.powerup) {
            my.sprite.powerup.update(time, delta);
        }
    }

    collides(spriteA, spriteB) {
        if(Math.abs(spriteA.x - spriteB.x) < (spriteA.displayWidth + spriteB.displayWidth)/2 && Math.abs(spriteA.y - spriteB.y) < (spriteA.displayHeight + spriteB.displayHeight)/2) {
            spriteA.onCollide(spriteB);
            spriteB.onCollide(spriteA);
            return true;
        }
    }

    spawnPowerup() {
        let my = this.my;

        my.sprite.powerup = new Powerup(this, 0, 0, "powerupDef", null, 6, this.randomChoice(this.powerupList));
        my.sprite.powerup.x = Math.random() * (game.config.width + my.sprite.powerup.displayWidth/2);
        my.sprite.powerup.y = my.sprite.powerup.displayHeight/2;
        this.powerupActive = true;
    }

    randomChoice(iterable) {
        let i = Math.floor(Math.random() * iterable.length);
        return iterable[i];
    }

    givePowerup(type) {
        this.powerupType = type;
    }

    shootBullet() {
        // Get the first inactive bullet, and make it active
        let bullet = my.sprite.bulletGroup.getFirstDead();
        let bulletTwo = my.sprite.bulletGroup.getFirstNth(2,false);
        // bullet will be null if there are no inactive (available) bullets
        if (bullet != null) {
            switch(this.powerupType) {
                case "V":
                    if(bulletTwo != null) {
                        this.bulletCooldownCounter = this.bulletCooldown;
                        bullet.makeActive();
                        bulletTwo.makeActive();
                        bullet.x = my.sprite.player.x;
                        bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                        bullet.rotation = Math.PI / 12;
                        bullet.piercing = false;
                        bullet.damage = 1;
                        bulletTwo.x = my.sprite.player.x;
                        bulletTwo.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                        bulletTwo.rotation = - Math.PI / 12;
                        bulletTwo.piercing = false;
                        bulletTwo.damage = 1;
                        this.sound.play(this.randomChoice(my.audio.shootdef));
                    }
                    break;
                case "Piercing":
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.rotation = 0;
                    bullet.piercing = true;
                    bullet.damage = 1;
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                    //play random bullet noise
                    this.sound.play(this.randomChoice(my.audio.shootdef));
                    break;
                case "Heavy":
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.rotation = 0;
                    bullet.piercing = true;
                    bullet.damage = 2;
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                    this.sound.play(this.randomChoice(my.audio.shootdef));
                    break;
                case "Double":
                    if(bulletTwo != null) {
                        this.bulletCooldownCounter = this.bulletCooldown;
                        bullet.makeActive();
                        bulletTwo.makeActive();
                        bullet.rotation = 0;
                        bullet.piercing = false;
                        bullet.damage = 1;
                        bullet.x = my.sprite.player.x;
                        bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                        bulletTwo.rotation = 0;
                        bulletTwo.piercing = false;
                        bulletTwo.damage = 1;
                        bulletTwo.x = my.sprite.player.x;
                        bulletTwo.y = my.sprite.player.y - (my.sprite.player.displayHeight/2) - (bullet.displayHeight * 1.2);
                        this.sound.play(this.randomChoice(my.audio.shootdef));
                    }
                    break;
                default:
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.rotation = 0;
                    bullet.piercing = false;
                    bullet.damage = 1;
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                    //play random bullet noise
                    this.sound.play(this.randomChoice(my.audio.shootdef));
            }
        }
    }
}