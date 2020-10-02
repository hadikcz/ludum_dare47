import $ from 'jquery';
import * as dat from 'dat.gui';
import EffectManager from "effects/EffectManager";
import MatrixWorld from "core/pathfinding/MatrixWorld";
import Phaser from 'phaser';
import PlayerCharacter from "entity/PlayerCharacter";
import UI from "ui/UI";
import WorldEnvironment from 'core/WorldEnvironment';
import Vector2 = Phaser.Math.Vector2;
import ShelfManager from "core/ShelfManager";
import GameState from "core/GameState";
import CustomerManager from "core/CustomerManager";

declare let window: any;

export default class GameScene extends Phaser.Scene {

    private effectManager!: EffectManager;
    private ui!: UI;
    private worldEnvironment!: WorldEnvironment;
    private matrixWorld!: MatrixWorld;
    private customerManager!: CustomerManager;
    private debugGui: any;
    private debugPathLines!: Phaser.GameObjects.Group;

    private gameState!: GameState;
    private shelfManager!: ShelfManager;

    private playerCharacter!: PlayerCharacter;

    constructor () {
        super({ key: 'GameScene' });
    }

    create (): void {
        console.log('create game scene');
        window.scene = this;
        this.cameras.main.setPosition(0, 20);


        this.ui = new UI(this, this.gameState, this.gameState.dayNightSystem);
        this.ui.show();

        this.debugPathLines = this.add.group();
    }

    update (): void {
        this.worldEnvironment.update();
        this.ui.update();
    }

}
