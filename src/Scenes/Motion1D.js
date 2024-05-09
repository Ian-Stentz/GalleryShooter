class GalleryL1 extends Phaser.Scene {

    constructor() {
        super("GalleryL1");
        this.my = {sprite: {}};
        this.my.projectiles = [];
        this.speed = 5;
        this.projectileSpeed = 8;

        this.startX = 400;
        this.startY = 500;
        this.pos = [this.startX,this.startY];
        this.faceOffset = [0,0];
        this.shootOffset = [0,-50];
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("body", "yellow_body_squircle.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        //main stay body parts for sprite
        my.sprite.body = this.add.sprite(this.pos[0], this.pos[1], "body");
        my.sprite.face = this.add.sprite(this.pos[0] + this.faceOffset[0], this.pos[1] + this.faceOffset[1], "face");

        //keybinds
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.keySpace.on('down', () => {
            this.fireProjectile()
        })
    }

    update() {
        let my = this.my;   // create an alias to this.my for readability
        let velocity = [0,0]

        if(this.keyA.isDown) {
            velocity[0] -= 1
        }
        if(this.keyD.isDown) {
            velocity[0] += 1
        }

        let vd = this.length(velocity)
        if(vd > 0) {
            this.pos[0] += velocity[0] / vd * this.speed
            this.pos[1] += velocity[1] / vd * this.speed
            my.sprite.body.x = this.pos[0];
            my.sprite.body.y = this.pos[1];
            my.sprite.face.x = this.pos[0] + this.faceOffset[0];
            my.sprite.face.y = this.pos[1] + this.faceOffset[1];
        }
        let i = 0;
        while(true) {
            if (i >= my.projectiles.length) {
                break;
            }
            let projectile = my.projectiles[i]
            projectile.y -= this.projectileSpeed;
            if(projectile.y < -100) {
                let removed = my.projectiles.shift();
                projectile.destroy();
            } else {
                i++;  
            }
        }
    }

    fireProjectile() {
        let my = this.my;   // create an alias to this.my for readability
        my.projectiles.push(this.add.sprite(this.pos[0] + this.shootOffset[0], this.pos[1] + this.shootOffset[1], "hand"));
    }

    length(pos) {
        return Math.sqrt(pos[0] ** 2 + pos[1] ** 2);
    }
}