import Phaser from 'phaser';
import Ship from "entity/Ship";
import AsteroidSpawner from "core/AsteroidSpawner";
import EffectManager from "effects/EffectManager";
import Planet from "entity/Planet";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    private ship!: Ship;
    private speedText!: Phaser.GameObjects.Text;
    private asteroidSpawner!: AsteroidSpawner;
    private planet!: Planet;
    public effectManager!: EffectManager;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.setZoom(0.75);

        this.effectManager = new EffectManager(this);

        this.planet = new Planet(this);
        this.ship = new Ship(this, 300, 300);
        this.asteroidSpawner = new AsteroidSpawner(this);

        // Debug
        this.matter.add.mouseSpring();
        this.speedText = this.add.text(0, 0, '', { font: '18px Courier', fill: '#00ff00' });
        // new OrbitObject(this, 30, 30, 8, -2);
    }

    update (): void {
        this.ship.update();

        if (this.ship.body !== undefined) {
            // Debug
            let speedX = Math.floor(this.ship.body.velocity.x * 100);
            let speedY = Math.floor(this.ship.body.velocity.y * 100);
            let diff = Phaser.Math.Average([Math.abs(speedX), Math.abs(speedY)]);
            this.speedText.setText(`Velocity X: ${speedX} y: ${speedY} Orbit speed: ${diff}`);
        }
    }
}
