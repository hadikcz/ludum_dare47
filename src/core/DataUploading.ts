import GameScene from "scenes/GameScene";
import TimerEvent = Phaser.Time.TimerEvent;
import delay from "delay";
import GameConfig from "config/GameConfig";

export default class DataUploading {

    private scene: GameScene;
    private uploaded: number = 0;
    private timeLoop: TimerEvent;
    private uploadLimit: number;
    public winInProgress = false;

    constructor(scene: GameScene, uploadLimit: number = 30) {
        this.scene = scene;
        this.uploadLimit = uploadLimit;

        this.timeLoop = this.scene.time.addEvent({
            repeat: Infinity,
            delay: 1000,
            callbackScope: this,
            callback: this.loop
        });

        this.scene.ship.on('kill', () => {
            if (this.winInProgress) return;
            this.winInProgress = true;
            this.lose();
        });
    }

    update(): void {
        if (this.uploaded >= this.uploadLimit && !this.winInProgress) {
            this.winInProgress = true;
            this.win();
        }
    }

    async win(): Promise<void> {
// @ts-ignore
        if (window.level === GameConfig.LastLevel) {
            this.scene.ui.showGameOver();
            console.log('game over');
        } else {
            this.scene.ui.showWin();
// @ts-ignore
            window.level += 1;
        }
        await delay(5000);
// @ts-ignore
        if (window.level === GameConfig.LastLevel) return;
        this.scene.ui.hideWin();
        await delay(1000);
        this.scene.scene.restart();
    }

    async lose(): Promise<void> {
        this.scene.ui.showLose();
        await delay(5000);
        this.scene.ui.hideWin();
        await delay(1000);
        this.scene.scene.restart();
    }

    getUploaded(): number {
        return this.uploaded;
    }

    getUploadLimit(): number {
        return this.uploadLimit;
    }

    private loop(): void {
        if (this.scene.ship.body !== undefined && this.scene.ship.isInRange()) {
            this.uploaded++;
        }
    }
}
