import GameScene from "scenes/GameScene";
import delay from "delay";
import {Depths} from "enums/Depths";

export default class Trail extends Phaser.GameObjects.Line {

    public scene: GameScene;

    constructor(scene: GameScene) {
        super(scene, 0, -1000, -1000, 0, 0, 0, 0xFFFFFF, 0);
        this.scene = scene;
        this.scene.add.existing(this);
    }

    private async launch(x1: number, y1: number, x2: number, y2: number, strokeColor: number, strokeAlpha: number, lineWidth: number = 1, fadeOutTime: number = 1000): Promise<void> {
        this.setVisible(true);
        this.setActive(true);
        this.setAlpha(1);

        this.setPosition(0, 0);
        this.setOrigin(0, 0);
        this.setTo(x1, y1, x2, y2);
        this.setFillStyle(strokeColor, strokeAlpha);
        this.setStrokeStyle(lineWidth, strokeColor, strokeAlpha);

        await delay(fadeOutTime);

        this.scene.tweens.add({
            duration: 1000,
            alpha: 0,
            targets: this,
            onComplete: () => {
                this.setVisible(false);
                this.setActive(false);
            }
        });

        this.setDepth(Depths.TRAIL);
    }
}
