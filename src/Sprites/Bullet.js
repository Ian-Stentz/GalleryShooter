class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, rotation=0, piercing=false) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.rotation = rotation;
        this.piercing = piercing;
        this.damage = 1;
        this.hitlist = [];
        return this;
    }

    update(time, delta) {
        if (this.active) {
            this.x += this.speed * delta / 1000 * game.config.fps.target * Math.cos(Math.PI/2 - this.rotation);
            this.y -= this.speed * delta / 1000 * game.config.fps.target * Math.sin(Math.PI/2 - this.rotation);
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
        if(other instanceof Enemy && !(other in this.hitlist)) {
            this.hitlist.push(other);
            if(!this.piercing) {
                this.makeInactive();
            }
            other.doDamage(this.damage);
        }
    }
}