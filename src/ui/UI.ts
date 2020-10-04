import $ from 'jquery';
import GameScene from 'scenes/GameScene';
import Phaser from "phaser";
import GameConfig from "config/GameConfig";

export default class UI {

    private scene: GameScene;

    constructor (scene: GameScene) {
        this.scene = scene;
    }

    update () {
        this.handleShipSpeeds();
        this.updateUploaded();
    }

    show (): void {
    }

    hide (): void {
    }

    showWin(): void {
// @ts-ignore
        $('#level').html(window.level);
        $('#data').html(this.scene.dataUploading.getUploaded());
        $('.winPart').hide();
        $('.levelFinished').show();
        $('.win').slideDown('slow');
    }

    hideWin(): void {
        $('.win').slideUp('slow');
    }

    showLose(): void {
        $('.winPart').hide();
        $('.failed').show();
        $('.win').slideDown('slow');
    }

    showGameOver(): void {
        $('.winPart').hide();
        $('.gameOver').show();
        $('.win').slideDown('slow');
    }

    private handleShipSpeeds(): void {
        if (this.scene.ship.body == undefined) {
            let emoji = '💀';
            $('#orbitalSpeed').html(emoji);
            $('#distanceFromPlanet').html(emoji);
            $('#energy').html(emoji);
            return;
        }
// @ts-ignore
        let speedX = Math.floor(this.scene.ship.body.velocity.x * 10);
// @ts-ignore
        let speedY = Math.floor(this.scene.ship.body.velocity.y * 10);
        let diff = Phaser.Math.Average([Math.abs(speedX), Math.abs(speedY)]);
// @ts-ignore
        $('#orbitalSpeed').html(parseInt(diff));

        let distance = Phaser.Math.Distance.BetweenPoints(this.scene.ship, this.scene.planet);
// @ts-ignore
        $('#distanceFromPlanet').html(parseInt(distance * 5));

        if (distance > GameConfig.RemoteControlRadius) {
            $('.warning').removeClass('hide');
            $('.warning').html('Out of range!');
        } else if (distance <= GameConfig.Planet.Atmosphere.outer) {
            $('.warning').removeClass('hide');
            $('.warning').html('DANGER: Atmosphere!');
        } else {
            if (!$('.warning').hasClass('hide')) {
                $('.warning').addClass('hide');
            }
        }

        let shipEnergy = this.scene.ship.getEnergy();
// @ts-ignore
        $('#energy').html(parseInt(shipEnergy));
        if (shipEnergy < 25) {
            $('#energy').addClass('low');
        } else {
            $('#energy').removeClass('low');
        }

        $('#hp').html(this.scene.ship.hp);
    }

    private updateUploaded(): void {
        $('#uploaded').html(`${this.scene.dataUploading.getUploaded()}/${this.scene.dataUploading.getUploadLimit()}GB`);
    }
}
