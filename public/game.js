import {generateMessage} from '/openai.js';
import {preload} from '/preload.js';
import {grader} from '/AI-GraderCall.js';

const COLOR_PRIMARY = 0x333CFF;      //box bg
const COLOR_LIGHT = 0x03a1fc;        //box border
const COLOR_DARK = 0x0362fc;         //box accent

const allAISent = [];                // Stores all AI sentences
const allUserSent = [];              // Stores all User sentences

const startPrompt = [                // Starting prompt for conversation()
    {
        role: "user",
        content: "Provide a conversation starter for someone speaking to a child"
    }
];

let converLen = 0;
const maxConverLen = 4; // Determines conversation length in conversation()

var fairyText;
var charText;
var dialog;
var userTextHolder;
var isTextInputted = 0;


class Demo extends Phaser.Scene {
    preload = preload;
    constructor() {
        super({
            key: 'examples'
        })
    }
    create() {
        const content = '';
        var imageWidth = this.textures.get('bgImage').getSourceImage().width;
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'bgImage').setScale(window.innerWidth/imageWidth);
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'char').setScale(0.45);
        //this.add.image(700, 340, 'npc_1').setScale(0.45);

        // top box w/ no fixed width or height
        fairyText = createTextBox(this, 100, 100, {
            wrapWidth: 500,
            alpha: 0.5,
        })
            .start(content, 50);
            this.add.image(150, 150, 'fairy').setScale(1.1);
            
        //bottom box
        charText = createTextBox(this, window.innerWidth / 2, window.innerHeight*2/3, {
            wrapWidth: 500,
            fixedWidth: window.innerWidth/2.5,
            fixedHeight: 65,
            title: 'Dude',
            alpha: 0.75,
        })
            .start(content, 50);
            charText.setOrigin(0.5, 0);
            charText.layout();

            var print = this.add.text(0, 0, '');

        dialog = CreateFeedbackDialog(this)
            .setPosition(window.innerWidth / 2, window.innerHeight*5/6)
            .setOrigin(0.5,0)
            .layout()
            //.popUp(500)
            .on('send', function (content) {
                userTextHolder = content;
                isTextInputted = 1;
                dialog.getElement('content').setText('');
            })
            .on('close', function () {
                dialog.setVisible(false);
            })
            .on('restart', function() {
                dialog.setVisible(true);
            })
        
    }

    update() {
    }
}
conversation();
var CreateFeedbackDialog = function (scene, config) {
    var dialog = scene.rexUI.add.dialog({
        space: {
            left: 20, right: 20, top: 20, bottom: -20,
            title: 10,
            content: 10,
            action: 30

        },

        background: scene.rexUI.add.roundRectangle({
            radius: 20, color: COLOR_PRIMARY
        }),

        title: CreateTitle(scene).setText('Response'),

        content: CreateCanvasInput(scene),

        actions: [
            CreateButton(scene).setText('Send'),
        ],

        expand: {
            title: false,
        }
    })

    dialog
        .on('action.click', function (button, index, pointer, event) {
            if (index === 0) { // Send button                
                var content = dialog.getElement('content').text;
                dialog.emit('send', content);
            }

            dialog.emit('close');
        });


    dialog.getElement('content').open();

    return dialog;
}
var CreateCanvasInput = function (scene) {
    return scene.rexUI.add.canvasInput({
        width: window.innerWidth / 2.3, height: 20,
        background: {
            color: '#0362fc',

            stroke: null,
            'focus.stroke': '#7b5e57',
        },

        style: {
            fontSize: 20,
            backgroundBottomY: 1,
            backgroundHeight: 20,

            'cursor.color': 'black',
            'cursor.backgroundColor': 'white',
        },

        selectAll: true,
        textArea: true,
        maxLength: 500,
    })
}
var CreateTitle = function (scene) {
    return scene.rexUI.add.label({
        text: scene.add.text(0, 0, '', { fontSize: 20 }),
    })
}
var CreateButton = function (scene) {
    return scene.rexUI.add.label({
        x:100,
        y:400,
        space: { left: 10, right: 10, top: 10, bottom: 10, },

        background: scene.rexUI.add.roundRectangle({
            radius: 10, color: COLOR_DARK, strokeColor: COLOR_LIGHT
        }),

        text: scene.add.text(0, 0, '', { fontSize: 20 }),
    })
}
async function conversation() {
    try {
        while (converLen < maxConverLen) {
            
            const response = await generateMessage(startPrompt);
            const provSentence = response[0].message.content;
            allAISent[converLen] = provSentence;

            updateTextBox(charText, provSentence);
            console.log(provSentence);

            const newAssistSent = {
                role: "assistant",
                content: provSentence
            };
            
            const closePromise = new Promise(resolve => {
                const interval = setInterval(() => {
                    if (isTextInputted === 1) {
                        console.log("text inputted!");
                        clearInterval(interval);
                        resolve();
                    }
                }, 100); // Check every 100 milliseconds
            });

            await closePromise; // Wait for user input

            const userSent = userTextHolder;
            allUserSent[converLen] = userSent;

            const newUserSent = {
                role: "user",
                content: userSent
            };

            startPrompt.push(newAssistSent);
            startPrompt.push(newUserSent);

            converLen++;
            isTextInputted = 0;
            dialog.emit('restart');

        }
    } catch (error) {
        console.error("Error:", error);
    }
    return [allAISent, allUserSent];
}

// Call the conversation function to start the loop

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