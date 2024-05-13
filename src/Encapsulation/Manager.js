// Manager will be spawned each level, will be in charge of spawns for enemies and powerups
class Manager {
    constructor(scene, level) {
        this.scene = scene;
        this.level = level;
    }

    update(time, delta) {
        let dc = 100 - this.level * .1
        if(!this.scene.powerupActive && Math.random() * 100 < dc) {
            this.scene.spawnPowerup();
        }
    }
}