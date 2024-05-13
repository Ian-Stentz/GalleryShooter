class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, rotation=0, piercing=false) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.angle = rotation;
        this.damage = 1;
        return this;
    }

    update(time, delta) {
        if (this.active) {
            this.x += this.speed * delta / 1000 * game.config.fps.target * Math.cos(this.angle + Math.PI/2);
            this.y -= this.speed * delta / 1000 * game.config.fps.target * Math.sin(this.angle + Math.PI/2);
            if (this.y < -(this.displayHeight/2)) {
                this.makeInactive();
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

    onCollide(other) {
        if(!piercing && other instanceof Enemy) {
            this.visible = false;
            this.active = false;
        }
    }
}