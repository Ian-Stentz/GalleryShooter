class Powerup extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, powerupSpeed, type) {
        super(scene, x, y, texture, frame);

        this.type = type;
        this.speed = powerupSpeed;
        this.garbage = false;

        scene.add.existing(this);

        return this;
    }

    update(time, delta) {
        //only one powerup at a time, shouldn't be too much
        if(!this.garbage) {
            let result = this.scene.collides(this, this.scene.my.sprite.player);
            this.y += this.speed  * delta / 1000 * game.config.fps.target;
            if(this.y > game.config.height + this.displayHeight/2) {
                this.kill(false);
            }
        }
    }

    onCollide(other) {  
        if(other instanceof Player) {
            this.scene.givePowerup(this.type);
            this.scene.sound.play("powerupCollect");
            this.kill(true);
        }
    }

    kill(collected=false) {
        if(this.scene) {
            if(!collected) {
                this.scene.powerupActive = false;
            } 
            this.scene.my.powerup = null;
        }
        this.garbage = true;
        this.destroy(true);
    }
}