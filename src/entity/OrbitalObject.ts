import Phaser from "phaser";
import GameScene from "scenes/GameScene";
import Planet from "entity/Planet";
import Point = Phaser.Geom.Point;
import GameConfig from "config/GameConfig";

export default abstract class OrbitalObject extends Phaser.Physics.Matter.Image {

    public scene!: GameScene;
    private previousPosition!: Point;
    private loopTrail!: Phaser.Time.TimerEvent;
    private trailColor: number;

    constructor(scene: GameScene, x: number, y: number, image: string, trailColor: number) {
        super(scene.matter.world, x, y, image);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.matter.world.add(this);

        this.trailColor = trailColor;
        this.setFrictionAir(0);
        this.setFriction(0);

        this.loopTrail = this.scene.time.addEvent({
            delay: 50,
            repeat: Infinity,
            callbackScope: this,
            callback: this.drawTrail
        });


        this.on('collide', (a, b): void => {
            if (b.gameObject instanceof Planet || b.gameObject instanceof OrbitalObject) {
                this.scene.effectManager.launchExplosion(this.x, this.y, 32);
                this.destroy();
            }
        });
    }

    update(): void {
        let distance = Phaser.Math.Distance.BetweenPoints(this, this.scene.planet);
        if (distance < GameConfig.Planet.Atmosphere.outer) {
            this.setFrictionAir(GameConfig.AirFriction.outer);
            this.setTint(0xFF0000);
        } else if (distance < GameConfig.AirFriction.inner) {
            this.setTint(0xFF0000);
            this.setFrictionAir(GameConfig.AirFriction.outer);
        } else {
            this.setTint(0xFFFFFF);
            this.setFrictionAir(GameConfig.AirFriction.default);
        }
    }

    private drawTrail(): void {
        if (!this.previousPosition) {
            this.previousPosition = new Point(this.x, this.y);
            return;
        }

        this.scene.effectManager.launchTrail(this.previousPosition.x, this.previousPosition.y, this.x, this.y, this.trailColor, 0.5, 1, 1000);
        this.previousPosition.setTo(this.x, this.y);
    }

    destroy(fromScene?: boolean) {
        super.destroy(fromScene);
        this.loopTrail.destroy();
    }
}
