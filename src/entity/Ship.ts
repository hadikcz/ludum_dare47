import GameScene from "scenes/GameScene";
import Phaser from "phaser";
import Asteroid from "entity/Asteroid";
import {Depths} from "enums/Depths";
import Planet from "entity/Planet";
import Point = Phaser.Geom.Point;
import GameConfig from "config/GameConfig";

export default class Ship extends Phaser.Physics.Matter.Image {

    public scene!: GameScene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private loopTrail!: Phaser.Time.TimerEvent;
    private previousPosition!: Point;

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

        this.loopTrail = this.scene.time.addEvent({
            delay: 50,
            repeat: Infinity,
            callbackScope: this,
            callback: this.drawTrail
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

    private enableRcsSystem(): void {
        this.setFrictionAir(0.005);
    }

    private disableRcsSystem(): void {
        this.setFrictionAir(0);
    }

    private drawTrail(): void {
        if (!this.previousPosition) {
            this.previousPosition = new Point(this.x, this.y);
            return;
        }

        this.scene.effectManager.launchTrail(this.previousPosition.x, this.previousPosition.y, this.x, this.y, 0x00FF00, 0.25, 1, 1000);
        this.previousPosition.setTo(this.x, this.y);
    }

    destroy(fromScene?: boolean) {
        super.destroy(fromScene);
        this.emitter.stop();
        this.loopTrail.destroy();
    }
}
