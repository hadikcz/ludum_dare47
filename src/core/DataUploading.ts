import GameScene from "scenes/GameScene";
import TimerEvent = Phaser.Time.TimerEvent;

export default class DataUploading {

    private scene: GameScene;
    private uploaded: number = 0;
    private timeLoop: TimerEvent;
    private uploadLimit: number;

    constructor(scene: GameScene, uploadLimit: number = 30) {
        this.scene = scene;
        this.uploadLimit = uploadLimit;

        this.timeLoop = this.scene.time.addEvent({
            repeat: Infinity,
            delay: 1000,
            callbackScope: this,
            callback: this.loop
        });
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
