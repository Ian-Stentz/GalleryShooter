// Manager will be spawned each level, will be in charge of spawns for enemies and powerups
class Manager {
    constructor(scene, level) {
        this.scene = scene;
        this.level = level;
        this.enemyDc = 80 - this.level * 1;
        this.powerupDc = 50 - this.level * 1;
    }

    update(time, delta) {
        if(!this.scene.powerupActive && Math.random() * 100 < this.powerupDc) {
            this.scene.spawnPowerup();
        }
        if(!this.scene.my.sprite.enemy && Math.random() * 100 < this.enemyDc) {
            this.scene.spawnRandomEnemy();
        }
    }
}