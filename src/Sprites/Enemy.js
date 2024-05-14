class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, color, tier, movementSpline = null) {
        super(scene, x, y, texture, frame);

        this.movementSpline = movementSpline;
        this.color = color;
        this.tier = tier;
        this.passiveY = this.displayHeight * 1.5;
        this.outOfScreen = - this.displayHeight/2;
        this.bounceRight = false;
        this.bufferBound = game.config.width / 100;
        this.iFrameLength = .4;

        scene.add.existing(this);

        return this;
    }

    create() {
        this.health = this.tier;
        console.log(this.health);
        this.speed = 5;
        this.iFrameCounter = 0;
        this.setScale(2);
        this.rotation = Math.PI;
        this.setTexture(this.scene.enemyLookup[this.color][this.tier])
        //God I wish there were Enums in JS
        this.state = "EaseIn";
    }

    update(time, delta) {
        // Moving left
        if (this.health == 0) {
            this.destroy(true);
        }

        switch(this.state) {
            case "EaseIn":
                this.y += this.speed * delta / 1000 * game.config.fps.target;
                if(this.y >= this.passiveY) {
                    this.y = this.passiveY;
                    this.changeState("Bounce");
                }
            case "Bounce":
                break;
            case "Movement":
                break;
        }

        if(this.bounceRight) {
            this.x += this.speed * delta / 1000 * game.config.fps.target;
            if (this.x >= game.config.width - this.displayWidth/2 - this.bufferBound) {
                this.x = game.config.width - this.displayWidth/2 - this.bufferBound;
                this.bounceRight = !this.bounceRight;
            }
        } else {
            this.x -= this.speed * delta / 1000 * game.config.fps.target;
            if (this.x <= this.displayWidth/2 + this.bufferBound) {
                this.x = this.displayWidth/2 + this.bufferBound;
                this.bounceRight = !this.bounceRight;
            }
        }

        if(this.iFrameCounter > 0) {
            this.iFrameCounter -= delta / 1000;
            if (this.iFrameCounter <= 0) {
                this.visible = true;
                this.iFrameCounter = 0;
            } else {
                if (Math.abs((this.iFrameCounter * 10) % 1) < 0.3) {
                    this.visible = false;
                } else {
                    this.visible = true;
                }
            }
        }
    }

    changeState(newState) {
        switch(newState) {
            case "EaseIn":
                this.y = this.outOfScreen;
                this.state = "EaseIn";
                break;
            case "Bounce":
                this.state = "Bounce";
                break;
            case "Movement":
                this.state = "Movement"
            default:
                break;
        }
    }

    onCollide(other) {
        //pass
    }

    doDamage(damage) {
        if(this.iFrameCounter <= 0) {
            this.health -= damage;
            console.log(this.health);
            if(this.health <= 0) {
                this.scene.sound.play("death");
                this.makeInactive();
                this.scene.my.sprite.enemy = null;
            } else {
                this.scene.sound.play("hit");
                this.iFrameCounter = this.iFrameLength;
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }
}