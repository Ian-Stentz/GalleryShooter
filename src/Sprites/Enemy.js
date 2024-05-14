class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, movementSpline, color, tier) {
        super(scene, x, y, texture, frame);

        this.movementSpline = movementSpline;
        this.color = color;
        this.tier = tier;
        this.passiveY = this.displayHeight * 1.5;
        this.outOfScreen = - this.displayHeight/2;
        //God I wish there were Enums in JS
        this.state = "EaseIn";

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
        switch(this.state) {
            case "EaseIn":

            case "Bounce":

            case "Movement":
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
        
    }
}