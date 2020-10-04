import GameScene from "scenes/GameScene";
import ArrayHelpers from "helpers/ArrayHelpers";
import Line = Phaser.Geom.Line;
import Point = Phaser.Geom.Point;
import Group = Phaser.GameObjects.Group;
import NumberHelpers from "helpers/NumberHelpers";
import GameConfig from "config/GameConfig";
import Asteroid from "entity/Asteroid";

export default class AsteroidSpawner {

    private scene: GameScene;
    private asteroidGroup: Group;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.asteroidGroup = this.scene.add.group();

        this.scene.time.addEvent({
            delay: 6000,
            repeat: Infinity,
            callbackScope: this,
            callback: this.spawnRandomAsteroid
        });
    }

    private spawnRandomAsteroid(): void {
        let spawn = this.getRandomSpawnOutsideOfMap();
        let range = 4;
        let randomVelocityX = NumberHelpers.randomFloatInRange(-range, range);
        let randomVelocityY = NumberHelpers.randomFloatInRange(-range, range);

        let asteroid = new Asteroid(this.scene, spawn.x, spawn.y, randomVelocityX, randomVelocityY);
        this.asteroidGroup.add(asteroid);
    }

    private getRandomSpawnOutsideOfMap(): Point {
        let lines = [];

        let rect = new Phaser.Geom.Rectangle(0, 0, GameConfig.World.size.width, GameConfig.World.size.height);
        lines.push(rect.getLineA());
        lines.push(rect.getLineB());
        lines.push(rect.getLineC());
        lines.push(rect.getLineD());

        let line = ArrayHelpers.getRandomFromArray(lines) as Line;
        return line.getRandomPoint<Point>();
    }
}
