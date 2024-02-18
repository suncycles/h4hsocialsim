import {generateMessage} from '/openai.js';
import {preload} from '/preload.js';

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
        var char_sprite = this.add.sprite(window.innerWidth *3 / 4, window.innerHeight *3 / 4, 'char_1').setScale(0.35);
        var girl_sprite = this.add.sprite(window.innerWidth / 4, window.innerHeight / 4, 'girl_1').setScale(0.45);
        // this.add.image(window.innerWidth / 4, window.innerHeight / 4, 'char_1').setScale(0.45);
        // this.add.image(window.innerWidth / 4, window.innerHeight / 4, 'girl_1').setScale(0.45);


        // fairy textbox w/ no fixed width or height
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
        
    // /////////////////////////

    // Defines animations
    this.anims.create({
        key: 'animateGirl',
        frames: [
            { key: 'girl_2' },
            { key: 'girl_1' },
        ],
        frameRate: 5,
        repeat: 9  //number of times animation repeats, -1 is forever
    });

    this.anims.create({
        key: 'animateChar',
        frames: [
            { key: 'char_2' },
            { key: 'char_1' },
        ],
        frameRate: 5,
        repeat: -1  //number of times animation repeats, -1 is forever
    });

    // Play the animation on the sprite
    girl_sprite.play('animateGirl');
    char_sprite.play('animateChar');
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
            scene.tweens.add({
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

    scene: Demo
};

var game = new Phaser.Game(config);
