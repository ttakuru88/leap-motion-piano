var Piano = (function(){
             // A   B   C   D   E   F   G
  var notes = [33, 35, 36, 38, 40, 41, 43,
               45, 47, 48, 50, 52, 53, 55,
               57, 59, 60, 62, 64, 65, 67,
               69, 71, 72, 74, 76, 77, 79,
               81, 83, 84, 86, 88, 89, 91]

  var score = [[60, 500], [60, 500], [67, 500], [67, 500], [69, 500], [69, 500], [67, 500], [67, 500],
             [65, 500], [65, 500], [64, 500], [64, 500], [62, 500], [62, 375], [64, 125], [60, 1000],
             [67, 500], [67, 500], [65, 500], [65, 500], [64, 500], [64, 500], [62, 500], [62, 500],
             [67, 500], [67, 500], [65, 500], [65, 500], [64, 350], [65, 50], [64, 50], [62, 50], [64, 375], [65, 125], [64, 500], [62, 500],
             [60, 500], [60, 500], [67, 500], [67, 500], [69, 500], [69, 500], [67, 500], [67, 500],
             [65, 500], [65, 500], [64, 500], [64, 500], [62, 350], [64, 50], [62, 50], [60, 50], [62, 375], [64, 125], [60, 1000]];

  var keyboardTop = 150;
  var maxVolume = 127;

  function Piano(){
    this.playingNotes = [];
    this.scoreIndex = 0;
  }

  Piano.prototype.onMoveFinger = function(finger){
    if(finger.tipPosition[1] > keyboardTop) {
      this.playingNotes[finger.id] = null;
      return;
    }

    var volume = this.getVolume(finger);
    if(volume !== null){
      var note = this.getNote(finger);
      if(this.playingNotes[finger.id] === note){ return; }

      this.playingNotes[finger.id] = note;

      this.play(note, volume);
    }
  }

  Piano.prototype.getVolume = function(finger){
    var velocity = finger.tipVelocity[1];
    if(isNaN(velocity)) { return null; }
    velocity = Math.abs(velocity);

    var volume = velocity / 300 * maxVolume;
    if(volume < 0)         { volume = 0; }
    if(volume > maxVolume) { volume = maxVolume; }

    return volume;
  }

  Piano.prototype.getNote = function(finger){
    var x = finger.tipPosition[0] + 256;
    var keyWidth = 512 / notes.length;

    return notes[~~(x / keyWidth)];
  }

  Piano.prototype.play = function(note, volume, duration){
    MIDI.noteOn(0, note, volume, 0);
    if(duration){
      MIDI.noteOff(0, note, duration)
    }

    if(this.onPlay) { this.onPlay(notes.indexOf(note)); }
  }

  Piano.prototype.addPlayListener = function(callback){
    this.onPlay = callback;
  }

  Piano.prototype.autoPlay = function(){
    var note     = score[this.scoreIndex][0];
    var duration = score[this.scoreIndex][1];

    var time = +new Date;

    if(!this.nextPlayTime || this.nextPlayTime < time){
      this.play(note, maxVolume, duration / 1000);
      this.play(note-12, maxVolume / 2, duration / 1000);

      this.nextPlayTime = time + duration;

      this.scoreIndex++;
      if(this.scoreIndex >= score.length){ this.scoreIndex = 0; }
    }
  }

  return Piano;
})();
