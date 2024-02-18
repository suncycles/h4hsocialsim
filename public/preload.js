export function preload() {
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });
    this.load.image('dude', 'assets/dude.png');

    // arrow that continues text if too long
    this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    this.load.image('bgImage', 'assets/pixel_bg.png');
    this.load.image('fairy1', 'assets/fairy1.png');
    this.load.image('fairy2', 'assets/fairy2.png');
    this.load.image('char_1', 'assets/pixel_dude.png');
    this.load.image('char_2', 'assets/pixel_dude_talk.png');
    this.load.image('girl_1', 'assets/sprite_girl.png');
    this.load.image('girl_2', 'assets/sprite_girl_talking.png');
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });}
