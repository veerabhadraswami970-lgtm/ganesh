/**
 * Mushika player character entity
 */
export default class Mushika extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'mushika');
    scene.add.existing(this);
    this.setScale(1.2);
    this.currentLane = 1; // 0: Left, 1: Center, 2: Right
  }

  setLane(lane, laneXPositions) {
    this.currentLane = Phaser.Math.Clamp(lane, 0, laneXPositions.length - 1);
    this.scene.tweens.add({
      targets: this,
      x: laneXPositions[this.currentLane],
      duration: 120,
      ease: 'Quad.easeOut'
    });
  }
}
