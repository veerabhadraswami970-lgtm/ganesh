/**
 * Modak collectible entity
 */
export default class Modak extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'modak');
    scene.add.existing(this);
    this.setScale(1.0);

    // Subtle floating bob
    scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
