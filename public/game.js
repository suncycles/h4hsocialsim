import {generateMessage} from '/openai.js';
import {preload} from '/preload.js';
import {grader} from '/AI-GraderCall.js';

const COLOR_PRIMARY = 0x333CFF;      //box bg
const COLOR_LIGHT = 0x03a1fc;        //box border
const COLOR_DARK = 0x0362fc;         //box accent

var fairyText;
var charText;

class Demo extends Phaser.Scene {
    preload = preload;

    create() {
        const content = '';
        var imageWidth = this.textures.get('bgImage').getSourceImage().width;
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'bgImage').setScale(window.innerWidth/imageWidth);
        this.add.image(700, 350, 'char').setScale(0.45);

        // top box w/ no fixed width or height
        fairyText = createTextBox(this, 100, 100, {
            wrapWidth: 500,
            alpha: 0.5,
        })
            .start(content, 50);
            this.add.image(150, 150, 'fairy').setScale(1.1);
        //bottom box
        charText = createTextBox(this, 100, 400, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
            title: 'Dude',
            alpha: 0.75,
        })
            .start(content, 50);
        
        
    }

    update() {
        
    }
}

function updateTextBox(textBox, newText) {
    textBox.text = newText;
    textBox.layout();
}

const GetValue = Phaser.Utils.Objects.GetValue;

var createTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var titleText = GetValue(config, 'title', undefined);
    var alphaValue = GetValue(config, 'alpha', 0);
    var iconImg = GetValue(config, 'icon', undefined);


    var textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.rexUI.add.roundRectangle({ radius: 20, color: COLOR_PRIMARY, strokeColor: COLOR_LIGHT, strokeWidth: 2 }).setAlpha(alphaValue),

        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

        title: (titleText) ? scene.add.text(0, 0, titleText, { fontSize: '24px', }) : undefined,

        separator: (titleText) ? scene.rexUI.add.roundRectangle({ height: 3, color: COLOR_DARK }) : undefined,

        space: {
            left: 20, right: 20, top: 20, bottom: 20,

            icon: 10, text: 10,

            separator: 6,
        },

        align: {
            title: 'center'
        }
    })
        .setOrigin(0)
        .layout();

    textBox.setInteractive()
        .on('pointerdown', function () {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isTyping) {
                this.stop(true);
            } else if (!this.isLastPage) {
                this.typeNextPage();
            } else {
                // Next actions
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                return;
            }
            
            //drop down arrow to skip
            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
        .on('complete', function () {
            console.log('all pages typing complete')
        })

    return textBox;
}

var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
            fontSize: '20px',
            wordWrap: {
                width: wrapWidth
            },
            maxLines: 3
        })
        .setFixedSize(fixedWidth, fixedHeight);
}

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    }, 
    backgroundColor: "red",

    scene: Demo
};

var game = new Phaser.Game(config);