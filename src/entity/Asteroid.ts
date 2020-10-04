import Phaser from "phaser";
import GameScene from "scenes/GameScene";
import Point = Phaser.Geom.Point;
import {Depths} from "enums/Depths";
import Planet from "entity/Planet";

export default class Asteroid extends Phaser.Physics.Matter.Image {

    public scene!: GameScene;

    private previousPosition!: Point;

    private loopTrail!: Phaser.Time.TimerEvent;

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

        this.loopTrail = this.scene.time.addEvent({
            delay: 50,
            repeat: Infinity,
            callbackScope: this,
            callback: this.drawTrail
        });

        this.setDepth(Depths.ASTEROID);

        this.on('collide', (a, b): void => {
            if (b.gameObject instanceof Planet) {
                this.scene.effectManager.launchExplosion(this.x, this.y, 32);
                this.destroy();
            }
        });
    }

    private drawTrail(): void {
        if (!this.previousPosition) {
            this.previousPosition = new Point(this.x, this.y);
            return;
        }

        this.scene.effectManager.launchTrail(this.previousPosition.x, this.previousPosition.y, this.x, this.y, 0xFFFFFF, 0.5, 1, 1000);
        this.previousPosition.setTo(this.x, this.y);
    }

    destroy(fromScene?: boolean) {
        super.destroy(fromScene);
        this.loopTrail.destroy();
    }
}
