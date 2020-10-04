import Phaser from "phaser";
import GameScene from "scenes/GameScene";
import GameConfig from "config/GameConfig";
import {Vec2} from "types/Vec2";
import {Depths} from "enums/Depths";
import Image = Phaser.GameObjects.Image;

export default class Planet extends Phaser.Physics.Matter.Image {

    public scene!: GameScene;
    private clouds: Image;
    private cloudsLower: Image;

    constructor(scene: GameScene) {
        super(scene.matter.world, GameConfig.World.size.width / 2, GameConfig.World.size.height / 2, 'planet', 0, {
            // @ts-ignore
            shape: {
                type: 'circle',
                radius: 27
            },
            plugin: {
                attractors: [
                    (bodyA, bodyB): Vec2 => {
                        return {
                            x: (bodyA.position.x - bodyB.position.x) * 0.000001,
                            y: (bodyA.position.y - bodyB.position.y) * 0.000001
                        } as Vec2;
                    }
                ]
            },
            mass: 1000
        });

        let scale = 2;
        this.scene.add.existing(this);
        this.scene.matter.world.add(this);

        this.setStatic(true);

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
