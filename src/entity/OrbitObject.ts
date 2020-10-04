import Phaser from "phaser";
import GameScene from "scenes/GameScene";

export default class OrbitObject extends Phaser.Physics.Matter.Image {

    public scene!: GameScene;

    constructor(scene: GameScene, x: number, y: number, initialVelocityX: number, initialVelocityY: number) {
        super(scene.matter.world, x, y, 'asteroid');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.matter.world.add(this);

        this.setFrictionAir(0);
        this.setFriction(0);
        this.setMass(1);
        this.setVelocityX(initialVelocityX);
        this.setVelocityY(initialVelocityY);
    }
}
