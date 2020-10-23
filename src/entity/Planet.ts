import Phaser from "phaser";
import GameScene from "scenes/GameScene";
import GameConfig from "config/GameConfig";
import {Vec2} from "types/Vec2";
import {Depths} from "enums/Depths";
import Image = Phaser.GameObjects.Image;
import {Vector, Body} from "matter-js";
// import {Body} from "matter";

export default class Planet extends Phaser.Physics.Matter.Image {

    public scene!: GameScene;
    private clouds: Image;
    private cloudsLower: Image;

    constructor(scene: GameScene) {
        let gravityConstant = 0.004;
        super(scene.matter.world, GameConfig.World.size.width / 2, GameConfig.World.size.height / 2, 'planet', 0, {
            // @ts-ignore
            shape: {
                type: 'circle',
                radius: 27
            },
            plugin: {
                // attractors: [Phaser.Plugins.PluginManager..resolve("matter-attractors").Attractors.gravity]
                // attractors: [MatterJS.Plugin.resolve("matter-attractors").Attractors.gravity]
                // attractors: [
                //     (bodyA, bodyB): Vec2 => {
                //         return {
                //             x: (bodyA.position.x - bodyB.position.x) * 0.000001,
                //             y: (bodyA.position.y - bodyB.position.y) * 0.000001
                //         } as Vec2;
                //     }
                // ]
                attractors: [
                    (bodyA, bodyB): void => {
                        // use Newton's law of gravitation
                        var bToA = Vector.sub(bodyB.position, bodyA.position);
                        var distanceSq = Vector.magnitudeSquared(bToA) || 0.0001;
                        var normal = Vector.normalise(bToA);
                        var magnitude = -gravityConstant * (bodyA.mass * bodyB.mass / distanceSq);
                        var force = Vector.mult(normal, magnitude);
                        // console.log([
                        //    bToA,
                        //    distanceSq,
                        //     normal,
                        //     magnitude,
                        //     force,
                        //     gravityConstant,
                        //     bodyA.mass,
                        //     bodyB.mass
                        // ]);

                        // bodyA.applyForce(bodyA.position, Vector.neg(force))
                        // bodyB.applyForce(bodyB.position, force);
                        // to apply forces to both bodies
                        Body.applyForce(bodyA, bodyA.position, Vector.neg(force));
                        Body.applyForce(bodyB, bodyB.position, force);
                    }
                ]
            },
            mass: 1000
        });

        let scale = 2;
        this.scene.add.existing(this);
        this.scene.matter.world.add(this);

        // this.setStatic(true);

        this.setDepth(Depths.PLANET);

        this.createAtmosphere();
        this.createMaxRemoteControlRadius();

        this.setScale(scale);


        this.clouds = this.scene.add.image(this.x, this.y, 'clouds')
            .setDepth(Depths.CLOUDS)
            .setScale(1.25);

        this.cloudsLower = this.scene.add.image(this.x, this.y, 'clouds')
            .setDepth(Depths.CLOUDS)
            .setScale(scale);
    }

    preUpdate (): void {
        this.setPosition(GameConfig.World.size.width / 2, GameConfig.World.size.height / 2);
        this.clouds.angle -= 0.15;
        this.cloudsLower.angle -= 0.05;
        // this.angle -= 0.15;
    }

    private createAtmosphere(): void {
        this.scene.add.image(this.x + 15, this.y + 15, 'sky').setDepth(Depths.ATMOSPHERE);
    }


    private createMaxRemoteControlRadius(): void {
        let arc = this.scene.add.arc(this.x, this.y, GameConfig.RemoteControlRadius, 0, 360);
        arc.setStrokeStyle(2, 0xFFFFFF0, 0.25);
    }
}
