import $ from 'jquery';
import GameConfig from 'config/GameConfig';
import GameScene from 'scenes/GameScene';
import WorldEnvironment from "core/WorldEnvironment";
import Text = Phaser.GameObjects.Text;
import GameState from "core/GameState";
import {Depths} from "enums/Depths";

export default class UI {

    private scene: GameScene;
    private balance!: Text;
    private clock!: Text;
    private calendar!: Text;
    private gameState: GameState;

    constructor (scene: GameScene, gameState: GameState) {
        this.scene = scene;
        this.gameState = gameState;
    }

    update () {
    }

    show (): void {
    }

    hide (): void {
    }
}
