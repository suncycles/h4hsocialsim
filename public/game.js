import {generateMessage} from '/openai.js';
import {preload} from '/preload.js';
import {vw} from '/helper.js';

const COLOR_PRIMARY = 0x333CFF;      //box bg
const COLOR_LIGHT = 0x03a1fc;        //box border
const COLOR_DARK = 0x0362fc;         //box accent

const allAISent = [];                // Stores all AI sentences
const allUserSent = [];              // Stores all User sentences

const startPrompt = [                // Starting prompt for conversation()
    {
        role: "user",
        content: "Provide a conversation starter for someone speaking to a child. Start the prompt with My name is Gnomey! If the conversation ever takes an inappropriate turn, attempt to guide the child into a better conversation."
    }
];

let converLen = 0;
const maxConverLen = 3; // Determines conversation length in conversation()

var fairyText;
var charText;
var dialog;
var userTextHolder;
var isTextInputted = 0;
var char_sprite;
var girl_sprite;
var fairy_sprite;


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
        char_sprite = this.add.sprite(window.innerWidth *3 / 4, window.innerHeight / 2, 'char_1').setScale(0.35);
        girl_sprite = this.add.sprite(window.innerWidth / 4, window.innerHeight / 2, 'girl_1').setScale(0.55);
        fairy_sprite = this.add.sprite(window.innerWidth - vw(8), window.innerHeight * 2/ 3, 'fairy1').setScale(1);

        // fairy dialogue box
        fairyText = createTextBox(this, window.innerWidth - vw(15), window.innerHeight /2, {
            wrapWidth: 500,
            alpha: 0.5,
        })
            .start(content, 50);

        //main dialogue box
        charText = createTextBox(this, window.innerWidth / 2, window.innerHeight*4/6, {
            wrapWidth: window.innerWidth/2.5,
            fixedWidth: window.innerWidth/2.5,
            fixedHeight: 65,
            title: 'Gnomey',
            alpha: 0.75,
        })
            .start(content, 50);
            charText.setOrigin(0.5, 0);
            charText.layout();

            // Defines animations
        this.anims.create({
            key: 'animateGirl',
            frames: [
                { key: 'girl_2' },
                { key: 'girl_1' },
            ],
            frameRate: 5,
            repeat: 5  //number of times animation repeats, -1 is forever
        });

        this.anims.create({
            key: 'animateChar',
            frames: [
                { key: 'char_2' },
                { key: 'char_1' },
            ],
            frameRate: 4,
            repeat: 5  //number of times animation repeats, -1 is forever
        });

        this.anims.create({
            key: 'animateFairy',
            frames:[
                {key: 'fairy2'},
                {key: 'fairy1'},
            ],
            frameRate: 10,
            repeat: -1
        })
        fairy_sprite.play('animateFairy');

        dialog = CreateFeedbackDialog(this)
            .setPosition(window.innerWidth / 2, window.innerHeight*6/7)
            .setOrigin(0.5,0)
            .layout()
            .on('send', function (content) {
                console.log("send");
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
            .setAlpha(0.75)
        
    }

    update() {
    }
}
conversation();

// Creates User Input Box
var CreateFeedbackDialog = function (scene, config) {
    var dialog = scene.rexUI.add.dialog({
        space: {
            left: 20, right: 20, top: 8, bottom: -20,
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
        space: { left: 10, right: 10, top: 10, bottom: 10, },

        background: scene.rexUI.add.roundRectangle({
            radius: 10, color: COLOR_DARK, strokeColor: COLOR_LIGHT
        }),

        text: scene.add.text(0, 0, '', { fontSize: 20 }),
    })
}
// Handles entire game cycle
async function conversation() {
    try {
        while (converLen < maxConverLen) {
            
            const response = await generateMessage(startPrompt);            // Gets AI response from API in openai.js
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
            char_sprite.play('animateChar');
            await closePromise; // Wait for user input

            const userSent = userTextHolder;
            allUserSent[converLen] = userSent;

            const newUserSent = {
                role: "user",
                content: userSent
            };

            startPrompt.push(newAssistSent);        // Adds conversation to JSON to be retained
            startPrompt.push(newUserSent);
            
            converLen++;
            isTextInputted = 0;
            dialog.emit('restart');
            
        }
    } catch (error) {
        console.error("Error:", error);
    }
    const gradePrompt =                // Starting prompt for getting grades for responses()
    {
        role: "user",
        content: "From a scale of one (lowest) to ten (highest), grade the " + maxConverLen + " user (not assistant-based) responses throughout the whole conversation based on social appropriateness with a brief statement for each grade to inform the user. Use format: #.[question number] (user response) - [rating]/10 - reasoning. Do not include the question number twice in your response"
    };
    startPrompt.push(gradePrompt);
    const response = await generateMessage(startPrompt);
    const provGrade = response[0].message.content;
    console.log(provGrade);

    const numberPattern = /\d+/g;           // Searches AI grades for the numerical values it gave by searching for numbers in provGrade
    const numbers = provGrade.match(numberPattern);
    console.log(numbers);
    let i = 1;
    let averageGrade = 0;
    let max = numbers.length / 3;
    for (i; i <= max; i++) {            // Loops through numbers from provGrade to get only the grades
        averageGrade += parseInt(numbers[i * 3 - 2]);
    }
    averageGrade = averageGrade / max;
    return [allAISent, allUserSent, averageGrade];
}
// Updates main textbox with animation
function updateTextBox(textBox, newText) {
    let currentIndex = 0;
    let interval = setInterval(() => {
        textBox.text = newText.substring(0, currentIndex);
        currentIndex++;
        if (currentIndex > newText.length) {
            clearInterval(interval);
        }
    }, 50);
    textBox.layout();
}

const GetValue = Phaser.Utils.Objects.GetValue;

// RexUI Textbox Helper function
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
            var keyInput = scene.input.keyboard.addKey(13);
            keyInput.on('down', emit('send'));
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