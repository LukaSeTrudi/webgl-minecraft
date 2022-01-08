export class PlayerAnimation {
  constructor(player) {
    this.player = player;
    this.dir = 1;
    this.time = 0;
  }
  setLegs() {
    this.legs = this.player.children.filter((x) => ["leg1", "leg2"].includes(x.extra));
  }

  setArms() {
    this.arms = this.player.children.filter((x) => ["arm1", "arm2"].includes(x.extra));
    this.player.armPlace = this.player.children.find(x => x.extra == "armPlaceholder");
  }

  update(dt) {
    if (!this.legs) this.setLegs();
    if (!this.arms) this.setArms();
    if (this.player.sprinting) this.legMult = 5;
    else this.legMult = 3;

    if (this.player.velocity[0] != 0 || this.player.velocity[2] != 0) {
      this.walking = true;
    } else {
      this.walking = false;
    }
    this.updateWalking(dt);
    this.updateHolding();
  }

  updateHolding() {
    if(this.player.holding) {
      this.arms[1].rotation[0] = Math.PI/3;
      this.arms[1].translation = [0.4, 0.5, -0.3];
    } else {
      this.arms[1].translation = [0.4, 0.4, 0];
    }
    this.arms[1].updateTransform();
  }

  updateWalking(dt) {
    if (this.walking) {
      if (this.time + this.legMult * this.dir * dt > 1 || this.time + this.legMult * this.dir * dt < 0) this.dir *= -1;
      this.time += this.legMult * this.dir * dt;

      this.legs[0].rotation[0] = this.lerp(-Math.PI / 6, Math.PI / 6, this.time);
      this.legs[1].rotation[0] = this.lerp(-Math.PI / 6, Math.PI / 6, 1 - this.time);

      this.arms[0].rotation[0] = this.lerp(-Math.PI / 6, Math.PI / 6, 1 - this.time);
      this.arms[1].rotation[0] = this.lerp(-Math.PI / 6, Math.PI / 6, this.time);
    } else {
      this.legs[0].rotation[0] = 0;
      this.legs[1].rotation[0] = 0;

      this.arms[0].rotation[0] = 0;
      this.arms[1].rotation[0] = 0;
    }
    this.legs[0].updateTransform();
    this.legs[1].updateTransform();
    this.arms[0].updateTransform();
    this.arms[1].updateTransform();
  }

  lerp(start, end, time) {
    return (1 - time) * start + time * end;
  }
}
