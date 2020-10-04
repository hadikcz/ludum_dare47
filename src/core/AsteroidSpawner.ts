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

    private spawnRandomAsteroid(mass = 3, scale = 1, velocityX = 0, velocityY = 0, x?: number, y?: number): void {
        let spawn = this.getRandomSpawnOutsideOfMap();
        let range = 4;

        let randomVelocityX = NumberHelpers.randomFloatInRange(-range, range);
        let randomVelocityY = NumberHelpers.randomFloatInRange(-range, range);

        if (x !== undefined && y !== undefined) {
            spawn.x = x;
            spawn.y = y;
        }

        let asteroid = new Asteroid(this.scene, spawn.x, spawn.y, velocityX || randomVelocityX, velocityY || randomVelocityY, mass, scale);
        this.asteroidGroup.add(asteroid);
        asteroid.on('destroy', () => {
            this.asteroidSplash(asteroid);
        });

        asteroid.on('hitPlayer', () => {
            console.log('hit player B');
            this.asteroidSplash(asteroid);
        });
    }

    private asteroidSplash(asteroid: Asteroid): void {
        if (asteroid.scaleX > 0.5) {
            for (let i = 0; i < NumberHelpers.randomIntInRange(1, 3); i++) {
                this.spawnRandomAsteroid(
// @ts-ignore
                    asteroid.body.mass * 2,
                    asteroid.scale - 0.25,
// @ts-ignore
                    asteroid.body.velocity.x + NumberHelpers.randomIntInRange(-1, 1),
// @ts-ignore
                    asteroid.body.velocity.y + NumberHelpers.randomIntInRange(-1, 1),
                    asteroid.x + NumberHelpers.randomIntInRange(-20, 20),
                    asteroid.y + NumberHelpers.randomIntInRange(-20, 20)
                );
            }
        }
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
