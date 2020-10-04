import FlyText from "effects/FlyText";
import GameScene from "scenes/GameScene";
import Trail from "effects/Trail";
import Explosion from "effects/Explosion";

export default class EffectManager {

    public static readonly DEFAULT_POSITION: number[] = [-10000, -10000];

    private scene: GameScene;

    private flyTextGroup: Phaser.GameObjects.Group;
    private trailGroup: Phaser.GameObjects.Group;
    private explosionGroup: Phaser.GameObjects.Group;

    constructor (scene: GameScene) {
        this.scene = scene;

        this.flyTextGroup = this.scene.add.group({
            classType: FlyText,
            maxSize: 20,
            runChildUpdate: true
        });

        this.trailGroup = this.scene.add.group({
            classType: Trail,
            maxSize: 100,
            runChildUpdate: true
        });

        this.explosionGroup = this.scene.add.group({
            classType: Explosion,
            maxSize: 100,
            runChildUpdate: true
        });

        this.preparePools();
    }

    launchFlyText (x: number, y: number, text: string, style: object | any = null): FlyText {
        let group = this.flyTextGroup;
        /** @type {FlyText} */
        let effect = group.getFirstDead();
        if (!effect) {
            effect = new FlyText(this.scene);
            group.add(effect);
        }

        effect.launch(x, y, text, style);
        return effect;
    }

    launchTrail (x1: number, y1: number, x2: number, y2: number, strokeColor: number, strokeAlpha: number, lineWidth: number = 1, fadeOutTime: number = 1000): Trail {
        let group = this.trailGroup;
        /** @type {Trail} */
        let effect = group.getFirstDead();
        if (!effect) {
            effect = new Trail(this.scene);
            group.add(effect);
        }

        effect.launch(x1, y1, x2, y2, strokeColor, strokeAlpha, lineWidth, fadeOutTime);
        return effect;
    }

    launchExplosion (x: number, y: number, radius: number): Explosion {
        let group = this.explosionGroup;
        /** @type {Explosion} */
        let effect = group.getFirstDead();
        if (!effect) {
            effect = new Explosion(this.scene);
            group.add(effect);
        }

        effect.launch(x, y, radius);
        return effect;
    }

    private preparePools (): void {
        let group;

        group = this.flyTextGroup;
        for (let i = 0; i < group.maxSize; i++) {
            let effect = new FlyText(this.scene);
            group.add(effect);
        }

        group = this.trailGroup;
        for (let i = 0; i < group.maxSize; i++) {
            let effect = new Trail(this.scene);
            group.add(effect);
        }
    }
}
