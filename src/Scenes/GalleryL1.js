class GalleryL1 extends Phaser.Scene {

    constructor() {
        super("GalleryL1");
        this.my = {sprite: {}, audio: {}, manager: null};

        this.playerSpeed = 8;
        this.bulletSpeed = 18;

        this.bulletCooldown = .35; // bullet cooldown in seconds
        this.bulletCooldownCounter = 0;

        this.powerupList = ["V","Piercing","Heavy","Double"];
        this.powerupTimer = 5;
        this.freeze = false;

        this.loseTimer = 1.2;
    }

    preload() {
        //sprites folder
        this.load.setPath("./assets/sprites/");
        this.load.image("playerDef", "ship_0022.png");
        this.load.image("playerV", "ship_0016.png");
        this.load.image("playerPiercing", "ship_0023.png");
        this.load.image("playerHeavy", "ship_0021.png");
        this.load.image("playerDouble", "ship_0020.png");

        //enemies
        this.load.image("enemyB3", "ship_0000.png");
        this.load.image("enemyR3", "ship_0001.png");
        this.load.image("enemyG3", "ship_0002.png");
        this.load.image("enemyY3", "ship_0003.png");
        this.load.image("enemyB2", "ship_0004.png");
        this.load.image("enemyR2", "ship_0005.png");
        this.load.image("enemyG2", "ship_0006.png");
        this.load.image("enemyY2", "ship_0007.png");
        this.load.image("enemyB1", "ship_0008.png");
        this.load.image("enemyR1", "ship_0009.png");
        this.load.image("enemyG1", "ship_0010.png");
        this.load.image("enemyY1", "ship_0011.png");
        this.enemyLookup = {"Blue": {1: "enemyB1", 2: "enemyB2", 3: "enemyB3"}, 
                            "Red": {1: "enemyR1", 2: "enemyR2", 3: "enemyR3"}, 
                            "Green": {1: "enemyG1", 2: "enemyG2", 3: "enemyG3"}, 
                            "Yellow": {1: "enemyY1", 2: "enemyY2", 3: "enemyY3"}}

        //tiles folder
        this.load.setPath("./assets/tiles/");
        this.load.image("bulletDef", "tile_0000.png");
        this.load.image("bulletPiercing", "tile_0002.png");
        this.load.image("powerupV", "tile_0016.png");
        this.load.image("powerupPiercing", "tile_0002.png");
        this.load.image("powerupHeavy", "tile_0003.png");
        this.load.image("powerupDouble", "tile_0001.png");
        this.load.image("powerupDef", "tile_0025.png");
        // Load tilemap information
        this.load.image("BackgroundTileset", "tiles_packed.png");                         
        // Packed tilemap
        this.load.tilemapTiledJSON("Background-Tiles2", "Background-Tiles2.tmj")

        //audio folder
        this.load.setPath("./assets/audio/");
        this.load.audio("shoot1", "laserSmall_000.ogg");
        this.load.audio("shoot2", "laserSmall_001.ogg");
        this.load.audio("shoot3", "laserSmall_002.ogg");
        this.load.audio("shoot4", "laserSmall_003.ogg");
        this.load.audio("shoot5", "laserSmall_004.ogg");
        this.load.audio("powerupOff", "jingles_HIT00.ogg");
        this.load.audio("powerupCollect", "jingles_HIT16.ogg");
        this.load.audio("lose", "jingles_SAX07.ogg");
        this.load.audio("hit", "explosionCrunch_000.ogg");
        this.load.audio("death", "explosionCrunch_003.ogg");
    }
    
    create() {
        let my = this.my;

        this.map = this.add.tilemap("Background-Tiles2", 16, 16, 25, 20);
        this.tileset = this.map.addTilesetImage("BackgroundTilesPacked", "BackgroundTileset");
        this.groundLayer = this.map.createLayer("Background", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);

        let scene = this;
        my.manager = new Manager(this, 1);
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.debug = this.input.keyboard.addKey("X");
        //this.debug2 = this.input.keyboard.addKey("E");
        this.debug.on('down', function(event) {my.sprite.player.doDamage()});
        //this.debug2.on('down', function(event) {scene.spawnEnemy(game.config.width/2, true, "Yellow", 3)});

        my.audio.shootdef = ["shoot2", "shoot3", "shoot5"];
        my.audio.shootheavy = ["shoot1", "shoot4"];

        // In this approach, we create a single "group" game object which then holds up
        // to 10 bullet sprites
        // See more configuration options here: 
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        
        this.init_game();
    }

    init_game() {
        let my = this.my;
        this.freeze = false; 
        this.bulletCooldownCounter = 0;
        this.powerupActive = false;
        this.powerupType = "None";
        this.powerupTimerCounter = 0;
        this.loseTimerCounter = 0;
        this.lives = 3;

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "playerDef", null, this.left, this.right, this.playerSpeed);
        my.sprite.player.setScale(2);  

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
        my.sprite.bulletGroup.setVisible(false);
        if(my.sprite.powerup != null) {
            my.sprite.powerup.kill();
        }
    }

    update(time, delta) {
        let my = this.my;
        if(!this.freeze) {
            this.bulletCooldownCounter -= delta / 1000;
            if(this.powerupType != "None") {
                this.powerupTimerCounter -= delta / 1000;
                if(this.powerupTimerCounter <= 0) {
                    this.givePowerup("None");
                    this.sound.play("powerupOff");
                }
            }

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
            if(my.sprite.enemy) {
                my.sprite.enemy.update(time, delta);
            }
            for (let bullet of my.sprite.bulletGroup.getMatching('active', true)) {
                if(my.sprite.enemy && my.sprite.enemy.active) {
                    this.collides(bullet, my.sprite.enemy);
                }
            }
        }
        else {
            this.loseTimerCounter -= delta / 1000;
            if(this.loseTimerCounter <= 0) {
                this.returnToMenu();
            }
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
        let typeChoice = this.randomChoice(this.powerupList);
        let sprite = "powerupDef";
        switch(typeChoice) {
            case "V":
                sprite = "powerupV";
                break;
            case "Piercing":
                sprite = "powerupPiercing";
                break;
            case "Heavy":
                sprite = "powerupHeavy";
                break;
            case "Double":
                sprite = "powerupDouble";
                break;
            default:
                break;
        }
        my.sprite.powerup = new Powerup(this, 0, 0, sprite, null, 6, typeChoice);
        my.sprite.powerup.setScale(1.5);
        my.sprite.powerup.x = Math.random() * (game.config.width - my.sprite.powerup.displayWidth) + my.sprite.powerup.displayWidth/2;
        my.sprite.powerup.y = my.sprite.powerup.displayHeight/2;
        this.powerupActive = true;
    }

    randomChoice(iterable) {
        let i = Math.floor(Math.random() * iterable.length);
        return iterable[i];
    }

    givePowerup(type) {
        let my = this.my
        this.powerupType = type;
        if(type != "None") {
            console.log("beep");
            this.powerupTimerCounter = this.powerupTimer;
        }
        switch(this.powerupType) {
            case "V":
                my.sprite.player.setTexture("playerV");
                break;
            case "Piercing":
                my.sprite.player.setTexture("playerPiercing");
                break;
            case "Heavy":
                my.sprite.player.setTexture("playerHeavy");
                break;
            case "Double":
                my.sprite.player.setTexture("playerDouble");
                break;
            default:
                my.sprite.player.setTexture("playerDef");
                this.powerupActive = false;
                break;
        }
    }

    shootBullet() {
        let my = this.my
        // Get the first inactive bullet, and make it active
        let bullet = my.sprite.bulletGroup.getFirstDead();
        let bulletTwo = my.sprite.bulletGroup.getFirstNth(2,false);
        // bullet will be null if there are no inactive (available) bullets
        if (bullet != null) {
            switch(this.powerupType) {
                case "V":
                    if(bulletTwo != null) {
                        this.bulletCooldownCounter = this.bulletCooldown;
                        this.setBulletDefaults(bullet);
                        this.setBulletDefaults(bulletTwo);
                        bullet.rotation = Math.PI / 16;
                        bulletTwo.rotation = - Math.PI / 16;
                        this.sound.play(this.randomChoice(my.audio.shootdef));
                    }
                    break;
                case "Piercing":
                    this.bulletCooldownCounter = this.bulletCooldown;
                    this.setBulletDefaults(bullet);
                    bullet.setTexture("bulletPiercing");
                    bullet.piercing = true;
                    this.sound.play(this.randomChoice(my.audio.shootdef));
                    break;
                case "Heavy":
                    this.bulletCooldownCounter = this.bulletCooldown;
                    this.setBulletDefaults(bullet);
                    bullet.setScale(1.2);
                    bullet.damage = 2;
                    this.sound.play(this.randomChoice(my.audio.shootheavy));
                    break;
                case "Double":
                    if(bulletTwo != null) {
                        this.bulletCooldownCounter = this.bulletCooldown/2;
                        this.setBulletDefaults(bullet);
                        this.sound.play(this.randomChoice(my.audio.shootdef));
                    }
                    break;
                default:
                    this.bulletCooldownCounter = this.bulletCooldown;
                    this.setBulletDefaults(bullet);
                    this.sound.play(this.randomChoice(my.audio.shootdef));
            }
        }
    }
    
    setBulletDefaults(bullet) {
        let my = this.my;
        bullet.makeActive();
        bullet.rotation = 0;
        bullet.hitlist = [];
        bullet.piercing = false;
        bullet.damage = 1;
        bullet.x = my.sprite.player.x;
        bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
        bullet.setTexture("bulletDef")
        bullet.setScale(1);
    }

    removeLife() {
        let my = this.my
        this.lives -= 1;
        if(this.lives <= 0) {
            my.sprite.player.visible = false;
            this.loseState();
            this.sound.play("death");
        } else {
            this.sound.play("hit");
        }
    }

    loseState() {
        this.freeze = true;
        this.sound.play("lose");
        this.loseTimerCounter = this.loseTimer;
    }

    returnToMenu() {
        this.init_game();
        this.scene.switch("GalleryMM");
    }

    spawnRandomEnemy() {
        let spawnX = Math.random() * (game.config.width - 32) + 16;
        let dir = this.randomChoice([false, true]);
        let color = this.randomChoice(["Red","Green","Yellow","Blue"]);
        let tier = this.randomChoice([1,2,3]);
        this.spawnEnemy(spawnX,dir,color,tier);
    }

    spawnEnemy(startX, dir=true, color="Red", tier=1) {
        let my = this.my;
        //game.config.width/2
        my.sprite.enemy = new Enemy(this, startX, 0, "enemyG1", null, color, tier);
        my.sprite.bounceRight = dir;
        my.sprite.enemy.x = startX;
        my.sprite.enemy.create();
    }
}