export function preload() {
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });
    this.load.image('dude', 'assets/dude.png');

    // arrow that continues text if too long
    this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    this.load.image('bgImage', 'assets/bg.webp');
    this.load.image('npc', 'assets/dude.png');
    this.load.image('npc_face', 'assets/dude_face.png');
    this.load.image('npc_1', 'assets/dude1.png');
    this.load.image('fairy', 'assets/fairy.png');
}
