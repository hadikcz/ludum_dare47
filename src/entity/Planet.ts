import Phaser from "phaser";
import GameScene from "scenes/GameScene";
import GameConfig from "config/GameConfig";
import {Vec2} from "types/Vec2";
import {Depths} from "enums/Depths";

export default class Planet extends Phaser.Physics.Matter.Image {

    public scene!: GameScene;

    constructor(scene: GameScene) {
        super(scene.matter.world, GameConfig.World.size.width / 2, GameConfig.World.size.height / 2, 'planet', 0, {
            // @ts-ignore
            shape: {
                type: 'circle',
                radius: 55
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

        this.scene.add.existing(this);
        this.scene.matter.world.add(this);

        this.setStatic(true);

        this.setDepth(Depths.PLANET);

        this.createAtmosphere();
        this.createMaxRemoteControlRadius();
    }

    private createAtmosphere(): void {
        this.scene.add.circle(this.x, this.y, 128, 0x5ea2eb, 0.5);
        this.scene.add.circle(this.x, this.y, 156, 0x5ea2eb, 0.5);
    }

    private createMaxRemoteControlRadius(): void {
        let arc = this.scene.add.arc(this.x, this.y, GameConfig.RemoteControlRadius, 0, 360);
        arc.setStrokeStyle(2, 0xFFFFFF0, 0.25);
    }
}
