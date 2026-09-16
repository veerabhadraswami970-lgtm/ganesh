/**
 * PowerUp / Blessing indicator entity
 */
export default class PowerUp extends Phaser.GameObjects.Container {
  constructor(scene, x, y, type) {
    super(scene, x, y);
    this.type = type;
    scene.add.existing(this);
  }
}
