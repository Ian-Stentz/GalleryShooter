class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, movementSpline, color, tier) {
        super(scene, x, y, texture, frame);

        this.movementSpline = movementSpline;
        this.color = color;
        this.tier = tier;

        scene.add.existing(this);

        this.create();

        return this;
    }

    create() {
        this.health = tier;
    }

    update(delta) {
        // Moving left
        if (this.health == 0) {
            this.destroy(true);
        }
    }

    onCollide(other) {
        
    }
}