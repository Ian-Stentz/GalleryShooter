class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, leftKey, rightKey, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.left = leftKey;
        this.right = rightKey;
        this.playerSpeed = playerSpeed;
        
        this.iFrameLength = .6;

        scene.add.existing(this);

        this.init();

        return this;
    }

    init() {
        this.iFrameCounter = 0;
    }

    update(time, delta) {
        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth/2)) {
                this.x -= this.playerSpeed * delta / 1000 * game.config.fps.target;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                this.x += this.playerSpeed * delta / 1000 * game.config.fps.target;
            }
        }

        if(this.iFrameCounter > 0) {
            this.iFrameCounter -= delta / 1000;
            if (this.iFrameCounter <= 0) {
                this.visible = true;
                this.iFrameCounter = 0;
            } else {
                if (Math.abs((this.iFrameCounter * 10) % 1) < 0.4) {
                    this.visible = false;
                } else {
                    this.visible = true;
                }
            }
        }
    }

    onCollide(other) {
        if(other instanceof Enemy && this.iFrameCounter > 0) {
            this.doDamage();
        }
    }

    doDamage() {
        if(this.iFrameCounter <= 0) {
            this.iFrameCounter = this.iFrameLength;
            this.scene.removeLife();
        }
    }
}