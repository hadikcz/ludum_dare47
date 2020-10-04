import Phaser from 'phaser';
import Ship from "entity/Ship";
import AsteroidSpawner from "core/AsteroidSpawner";
import EffectManager from "effects/EffectManager";
import Planet from "entity/Planet";
import UI from "ui/UI";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    public ship!: Ship;
    private asteroidSpawner!: AsteroidSpawner;
    public planet!: Planet;
    public effectManager!: EffectManager;
    public ui!: UI;

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

        this.ui = new UI(this);
    }

    update (): void {
        this.ship.update();
        this.ui.update();
    }
}
