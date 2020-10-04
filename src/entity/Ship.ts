import GameScene from "scenes/GameScene";
import Phaser from "phaser";
import Asteroid from "entity/Asteroid";
import {Depths} from "enums/Depths";
import Planet from "entity/Planet";

export default class Ship extends Phaser.Physics.Matter.Image {

    public scene!: GameScene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;

    private static readonly EMITTER_GRAVITY = 3000;

    constructor(scene: GameScene, x: number, y: number,) {
        super(scene.matter.world, x, y, 'satellite');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.matter.world.add(this);

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.setFrictionAir(0);
        this.setFriction(0);
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

        this.on('collide', (a, b): void => {
            if (!this.active) return;
            if (this.body === undefined) return;
            if (b.gameObject instanceof Asteroid || b.gameObject instanceof Planet) {
                this.scene.effectManager.launchExplosion(this.x, this.y, 32);
                // this.kill();
                this.destroy();
                console.log('hit with asteroid');
            }
        });
    }

    update(): void {
        if (this.body === undefined) return;
        // console.log(this.body);
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
        this.setAngularVelocity(0);


        this.emitter.setGravity(Math.cos(this.angle - Math.PI)  * Ship.EMITTER_GRAVITY, Math.sin(this.rotation - Math.PI) * Ship.EMITTER_GRAVITY);
        this.emitter.setPosition(this.x, this.y);
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
