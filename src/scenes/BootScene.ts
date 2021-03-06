import 'phaser';

declare let window: any;

export default class BootScene extends Phaser.Scene {
    constructor () {
        super({ key: 'BootScene', plugins: ['Loader'] });
    }

    preload (): void {
        window.bootScene = this;
        this.sys.scale.refresh();

        const progress = this.add.graphics();
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height as number / 2, this.sys.game.config.width as number * value, 60);
        });

        this.load.on('complete', () => {
            progress.destroy();
            this.startGame();
        }, this);

        // LOAD assets HERE
        this.load.image('planet', 'assets/images/planet.png');
        this.load.image('satellite', 'assets/images/sattelite.png');
        this.load.image('particle', 'assets/images/particle.png');
        this.load.image('asteroid', 'assets/images/asteroid.png');
        this.load.image('clouds', 'assets/images/clouds.png');
        this.load.image('sky', 'assets/images/sky.png');
        this.load.image('star', 'assets/images/star.png');
        this.load.image('help', 'assets/images/help.jpg');
    }

    private startGame (): void {
        this.scene.start('GameScene', {});
    }
}
