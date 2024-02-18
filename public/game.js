import {generateMessage} from '/openai.js';

const COLOR_PRIMARY = 0x333CFF;      //box bg
const COLOR_LIGHT = 0x03a1fc;        //box border
const COLOR_DARK = 0x0362fc;         //box accent
class Demo extends Phaser.Scene {
    preload() { 
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.image('dude', 'assets/dude.png');

        //arrow that continues text if too long
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
        this.load.image('bgImage', 'assets/bg.webp');
        this.load.image('npc', 'assets/dude.png');
        this.load.image('npc_face', 'assets/dude_face.png');
        this.load.image('npc_1', 'assets/dude1.png');
        this.load.image('fairy', 'assets/fairy.png');
    }

    create() {
        const content = 'test string';
        var imageWidth = this.textures.get('bgImage').getSourceImage().width;
        var imageHeight = this.textures.get('bgImage').getSourceImage().height;
        console.log(imageWidth);
        console.log(window.innerWidth);
        console.log(window.innerWidth/imageWidth);
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'bgImage').setScale(window.innerWidth/imageWidth);
        //this.add.image(700, 350, 'npc').setScale(0.45);
        this.add.image(700, 340, 'npc_1').setScale(0.45);
        //this.add.image(400, 300, 'dude');
        // top box w/ no fixed width or height
        createTextBox(this, 100, 100, {
            wrapWidth: 500,
            alpha: 0.5,
        })
            .start('       '+'fairy helper text goes here', 50);
            this.add.image(130,120,"fairy").setScale(1),

        //bottom box
        createTextBox(this, 400, 500, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
            title: 'Title',
            alpha: 0.75,
        })
            .start(content, 50);
    }

    update() { }
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

        // icon: scene.rexUI.add.roundRectangle({ radius: 20, color: COLOR_DARK }),

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
// console.log(generateMessage);