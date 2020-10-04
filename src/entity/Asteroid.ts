import GameScene from "scenes/GameScene";
import OrbitalObject from "entity/OrbitalObject";
import {Depths} from "enums/Depths";
import Planet from "entity/Planet";
import Ship from "entity/Ship";
import NumberHelpers from "helpers/NumberHelpers";

export default class Asteroid extends OrbitalObject {

    public scene!: GameScene;

    constructor(scene: GameScene, x: number, y: number, initialVelocityX: number, initialVelocityY: number, mass = 1, scale = 1) {
        super(scene, x, y, 'asteroid', 0xFF0000, {type: 'circle'});

        this.setMass(mass);
        this.setScale(scale);
        this.setVelocityX(initialVelocityX);
        this.setVelocityY(initialVelocityY);

        this.setAngularVelocity(NumberHelpers.randomFloatInRange(-0.05, 0.05));

        this.setDepth(Depths.ASTEROID);

        this.on('collide', (a, b): void => {
            if (b.gameObject instanceof Ship) {
                this.emit('hitPlayer');
            }
            if (b.gameObject instanceof Planet || b.gameObject instanceof Asteroid) {
                this.scene.effectManager.launchExplosion(this.x, this.y, 32);
                this.destroy();
            }
        });
    }
}
