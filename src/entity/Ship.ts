import $ from 'jquery';
import GameScene from "scenes/GameScene";
import Phaser from "phaser";
import {Depths} from "enums/Depths";
import OrbitalObject from "entity/OrbitalObject";
import GameConfig from "config/GameConfig";
import Planet from "entity/Planet";
import Asteroid from "entity/Asteroid";
import Satelite from "entity/Satelite";

export default class Ship extends OrbitalObject {

    public scene!: GameScene;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private rcsEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;

    private static readonly EMITTER_GRAVITY = 3000;
    private static readonly RCS_AIR_FRICTION = 0.01;
    private energy = 100;
    private destroyInNextTick = false;
    public hp = 100;

    constructor(scene: GameScene, x: number, y: number, velocityX = 2, velocityY = -2) {
        super(scene, x, y, 'satellite', 0x00FF00, {
            type: 'circle',
            radius: 16
        });

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.setMass(8);
        this.setVelocityX(velocityX);
        this.setVelocityY(velocityY);
        this.setFixedRotation();

        this.setScale(0.5);
        this.setDepth(Depths.SATELLITE);

        this.particles = this.scene.add.particles('particle');
        this.emitter = this.particles.createEmitter({
            speed: 100,
            // @ts-ignore
            scale: {start: 1, end: 0},
        });


        this.rcsEmitter = this.particles.createEmitter({
            speed: 100,
            // @ts-ignore
            scale: {start: 1, end: 0},
        });
        this.rcsEmitter.stop();
        this.particles.setDepth(Depths.THRUSTER_PARTICLE);

        this.on('collide', (a, b): void => {
            if (b.gameObject instanceof Planet) {
                this.hp = 0;
                this.scene.effectManager.launchExplosion(this.x, this.y, 32);
                this.scene.cameras.main.flash(100, 255, 0, 0, true);
            }
            if (b.gameObject instanceof Asteroid || b.gameObject instanceof Satelite) {
                this.hp -= 15;
                this.scene.cameras.main.flash(100, 255, 0, 0, true);
                this.scene.effectManager.launchExplosion(this.x, this.y, 32);
            }
        });
    }

    preUpdate(): void {
        super.update();
        if (this.destroyInNextTick) {
            this.destroy();
            this.destroyInNextTick = false;
        }
        if (this.hp <= 0 ) {
            this.emit('kill');
            this.destroyInNextTick = true;
        }
        if (this.body === undefined) return;

        if (this.energy < 100)
            this.energy += 0.05;
        this.handleControls();
        this.setAngularVelocity(0);

        this.emitter.setGravity(Math.cos(this.angle - Math.PI)  * Ship.EMITTER_GRAVITY, Math.sin(this.rotation - Math.PI) * Ship.EMITTER_GRAVITY);
        this.emitter.setPosition(this.x, this.y);
        this.rcsEmitter.setPosition(this.x, this.y);
    }

    private handleControls(): void {

        if (!this.isInRange()) {
            this.emitter.stop();
            this.rcsEmitter.stop();
            return;
        }
        if (this.energy <= 0) {
            this.energy = 0;
            this.emitter.stop();
            this.rcsEmitter.stop();
            return;
        }

        if (this.scene.dataUploading.winInProgress) {
            this.emitter.stop();
            this.rcsEmitter.stop();
            return;
        }

        if (this.cursors.left.isDown) {
            this.angle -= 3;
        } else if (this.cursors.right.isDown) {
            this.angle += 3;
        }
        // this.emitter.setGravity(0, -500);

        if (this.cursors.up.isDown) {
            this.energy -= 0.1;
            this.thrust(0.0003 * this.body.mass);
            this.emitter.start();
        } else {
            this.emitter.stop();
        }
        if (this.cursors.down.isDown) {
            this.energy -= 0.5;
            this.enableRcsSystem();
        } else {
            this.disableRcsSystem();
        }
    }

    private enableRcsSystem(): void {
        this.setFrictionAir(Ship.RCS_AIR_FRICTION);
        this.rcsEmitter.start();
        $('.rcsStatus').removeClass('hide');
    }

    private disableRcsSystem(): void {
        if (!this.isInAtmosphere())
            this.setFrictionAir(0);
        this.rcsEmitter.stop();
        $('.rcsStatus').addClass('hide');
    }

    destroy(fromScene?: boolean) {
        super.destroy(fromScene);
        this.emitter.stop();
        this.rcsEmitter.stop();
    }

    getEnergy(): number {
        return this.energy;
    }

    isInRange(): boolean {
        let distance = Phaser.Math.Distance.BetweenPoints(this, this.scene.planet);
        return distance <= GameConfig.RemoteControlRadius;
    }

    isInAtmosphere(): boolean {
        let distance = Phaser.Math.Distance.BetweenPoints(this, this.scene.planet);
        return distance <= GameConfig.Planet.Atmosphere.outer;
    }
}
