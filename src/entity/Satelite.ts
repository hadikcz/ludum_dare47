import GameScene from "scenes/GameScene";
import {Depths} from "enums/Depths";
import OrbitalObject from "entity/OrbitalObject";
import Planet from "entity/Planet";
import Asteroid from "entity/Asteroid";
import Ship from "entity/Ship";

export default class Satelite extends OrbitalObject {

    public scene!: GameScene;

    constructor(scene: GameScene, x: number, y: number, velocityX = 2, velocityY = -2) {
        super(scene, x, y, 'satellite', 0xFFFFFF, {
            type: 'circle',
            radius: 16
        });

        this.setMass(8);
        this.setVelocityX(velocityX);
        this.setVelocityY(velocityY);
        this.setFixedRotation();

        this.setScale(0.5);
        this.setDepth(Depths.SATELLITE);


        this.on('collide', (a, b): void => {
            if (b.gameObject instanceof Planet || b.gameObject instanceof Asteroid || b.gameObject instanceof Ship) {
                this.scene.effectManager.launchExplosion(this.x, this.y, 32);
                this.destroy();
            }
        });
    }
}
