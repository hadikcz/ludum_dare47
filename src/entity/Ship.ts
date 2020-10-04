import GameScene from "scenes/GameScene";
import Phaser from "phaser";
import {Depths} from "enums/Depths";
import OrbitalObject from "entity/OrbitalObject";
import GameConfig from "config/GameConfig";

export default class Ship extends OrbitalObject {

    public scene!: GameScene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;

    private static readonly EMITTER_GRAVITY = 3000;

    constructor(scene: GameScene, x: number, y: number,) {
        super(scene, x, y, 'satellite', 0x00FF00);

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.setMass(8);
        this.setVelocityX(2);
        this.setVelocityY(-2);
        this.setFixedRotation();

        this.setScale(0.5);
        this.setDepth(Depths.SATELLITE);

        this.particles = this.scene.add.particles('particle');
        this.emitter = this.particles.createEmitter({
            speed: 100,
            // @ts-ignore
            scale: {start: 1, end: 0},
        });
        this.particles.setDepth(Depths.THRUSTER_PARTICLE);
    }

    update(): void {
        if (this.body === undefined) return;
        this.handleControls();
        this.setAngularVelocity(0);

        this.emitter.setGravity(Math.cos(this.angle - Math.PI)  * Ship.EMITTER_GRAVITY, Math.sin(this.rotation - Math.PI) * Ship.EMITTER_GRAVITY);
        this.emitter.setPosition(this.x, this.y);
    }

    private handleControls(): void {
        let distance = Phaser.Math.Distance.BetweenPoints(this, this.scene.planet);
        console.log(distance);
        if (distance > GameConfig.RemoteControlRadius) return;

        if (this.cursors.left.isDown) {
            this.angle -= 3;
        } else if (this.cursors.right.isDown) {
            this.angle += 3;
        }
        // this.emitter.setGravity(0, -500);

        if (this.cursors.up.isDown) {
            this.thrust(0.0003 * this.body.mass);
            this.emitter.start();
        } else {
            this.emitter.stop();
        }
        if (this.cursors.down.isDown) {
            this.enableRcsSystem();
        } else {
            this.disableRcsSystem();
        }
    }

    private enableRcsSystem(): void {
        this.setFrictionAir(0.005);
    }

    private disableRcsSystem(): void {
        this.setFrictionAir(0);
    }

    destroy(fromScene?: boolean) {
        super.destroy(fromScene);
        this.emitter.stop();
    }
}
