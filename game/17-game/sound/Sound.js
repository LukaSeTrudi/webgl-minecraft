export class Sound {
  constructor() {
    this.ambientDom = document.querySelector("#ambientSound");
    this.ambientDom.src = "common/sound/ambient.wav";
    this.ambientDom.volume = 0;

    this.soundEffects = document.querySelector("#otherSound");
    this.soundEffects.volume = 0;

  }

  toggleAmbient(val) {
    if(val) this.ambientDom.play();
    else this.ambientDom.pause();
  }

  breaking() {
    this.soundEffects.src = "common/sound/podiranje.mp3";
    this.soundEffects.play();
  }

  placing() {
    this.soundEffects.src = "common/sound/hit.mp3";
    this.soundEffects.play();
  }

  miss(_break) {
    if(_break) {
      this.soundEffects.src = "common/sound/hit.mp3";
      this.soundEffects.play();
    } else {
      this.soundEffects.src = "common/sound/hit.mp3";
      this.soundEffects.play();
    }
  }


}