import GameScene from "scenes/GameScene";
import OrbitalObject from "entity/OrbitalObject";
import {Depths} from "enums/Depths";

export default class Asteroid extends OrbitalObject{

    public scene!: GameScene;

    constructor(scene: GameScene, x: number, y: number, initialVelocityX: number, initialVelocityY: number) {
        super(scene, x, y, 'asteroid', 0xFF0000);

        this.setMass(1);
        this.setVelocityX(initialVelocityX);
        this.setVelocityY(initialVelocityY);

        this.setDepth(Depths.ASTEROID);
    }
}
