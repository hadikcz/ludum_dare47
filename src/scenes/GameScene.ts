import Phaser from 'phaser';
import Ship from "entity/Ship";
import AsteroidSpawner from "core/AsteroidSpawner";
import EffectManager from "effects/EffectManager";
import Planet from "entity/Planet";
import UI from "ui/UI";
import Group = Phaser.GameObjects.Group;
import Satelite from "entity/Satelite";
import DataUploading from "core/DataUploading";
import GameConfig from "config/GameConfig";
import Point = Phaser.Geom.Point;
import {Depths} from "enums/Depths";
import NumberHelpers from "helpers/NumberHelpers";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    public ship!: Ship;
    private asteroidSpawner!: AsteroidSpawner;
    private sateliteGroup!: Group;
    public planet!: Planet;
    public effectManager!: EffectManager;
    public ui!: UI;
    public dataUploading!: DataUploading;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        window.scene = this;
        this.cameras.main.setBackgroundColor('#00');
        this.cameras.main.setZoom(0.75);

        this.effectManager = new EffectManager(this);

        this.planet = new Planet(this);
        this.ship = new Ship(this, 400, 384, 0, -3.5); // player

        if (window.level > 3) {
            window.level = 3;
        } else if (window.level < 1) {
            window.level = 1;
        }

        this.sateliteGroup = this.add.group();
        for (let i = 0; i < window.level; i++) {
            let orbit = this.getSateliteOrbits()[i];
            let satelite = new Satelite(this, orbit.x, orbit.y, orbit.velX, orbit.velY);
            this.sateliteGroup.add(satelite);
        }
        this.asteroidSpawner = new AsteroidSpawner(this);
        this.dataUploading = new DataUploading(this, this.getUploadLimit(window.level));

        this.createStars();

        // Debug
        this.matter.add.mouseSpring();

        this.ui = new UI(this);
    }

    update (): void {
        this.ship.update();
        this.ui.update();
    }

    getSateliteOrbits(): any[] {
        return [
            {
                x: 300,
                y: 300,
                velX: 1,
                velY: -4
            },
            {
                x: 200,
                y: 384,
                velX: 0,
                velY: -5.5
            },
            {
                x: 500,
                y: 384,
                velX: 0,
                velY: 2.25
            }
        ];
    }

    getUploadLimit(level: number): number {
        switch (level) {
            case 1:
            default:
                return 30;
            case 2:
                return 50;
            case 3:
                return 70;
        }
    }

    createStars(): void {
        for (let i = 0; i < 250; i++) {
            this.createStar(0xFFFFFF);
        }
        for (let i = 0; i < 30; i++) {
            this.createStar(0xff660d);
        }
        for (let i = 0; i < 30; i++) {
            this.createStar(0x34c0eb);
        }
    }

    createStar(tint: number): void {
        let rect = new Phaser.Geom.Rectangle(-500, -500, GameConfig.World.size.width + 1500, GameConfig.World.size.height + 1500);
        let spawn = rect.getRandomPoint<Point>();
        let star = this.add.image(spawn.x, spawn.y, 'star')
            .setDepth(Depths.STAR);
        let alpha = NumberHelpers.randomFloatInRange(0.3, 0.5);
        star.setAlpha(alpha);
        star.setTint(tint);
        this.tweens.add({
            targets: star,
            alpha: alpha + 0.4,
            duration: NumberHelpers.randomIntInRange(400, 900),
            yoyo: true,
            repeat: Infinity
        });
    }
}
