var Piano = (function(){
             // A   B   C   D   E   F   G
  var notes = [33, 35, 36, 38, 40, 41, 43,
               45, 47, 48, 50, 52, 53, 55,
               57, 59, 60, 62, 64, 65, 67,
               69, 71, 72, 74, 76, 77, 79,
               81, 83, 84, 86, 88, 89]

  var score = [[60, 500], [60, 500], [67, 500], [67, 500], [69, 500], [69, 500], [67, 500], [67, 500],
             [65, 500], [65, 500], [64, 500], [64, 500], [62, 500], [62, 375], [64, 125], [60, 1000],
             [67, 500], [67, 500], [65, 500], [65, 500], [64, 500], [64, 500], [62, 500], [62, 500],
             [67, 500], [67, 500], [65, 500], [65, 500], [64, 350], [65, 50], [64, 50], [62, 50], [64, 375], [65, 125], [64, 500], [62, 500],
             [60, 500], [60, 500], [67, 500], [67, 500], [69, 500], [69, 500], [67, 500], [67, 500],
             [65, 500], [65, 500], [64, 500], [64, 500], [62, 350], [64, 50], [62, 50], [60, 50], [62, 375], [64, 125], [60, 1000]];

  var keyboardTop = 175;
  var maxVolume = 127;

  function Piano(){
    this.playingNotes = [];
    this.scoreIndex = 0;
  }

  Piano.prototype.onMoveFinger = function(finger){
    if(finger.tipPosition[1] > keyboardTop) {
      this.playEnd(finger.id);
      return false;
    }
    if(finger.tipVelocity[1] > 0){ // 上への移動
      return true;
    }

    var volume = this.getVolume(finger);
    if(volume === null){ return false; }

    var note = this.getNote(finger);
    if(this.playingNotes[finger.id] === note){ return true; }

    this.playEnd(finger.id);
    this.play(finger.id, note, volume);

    return true;
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

  Piano.prototype.play = function(fingerId, note, volume, duration, channel){
    var root = this;
    channel = channel || 0;

    this.playingNotes[fingerId] = note;

    MIDI.noteOn(channel, note, volume, 0);
    if(duration){
      MIDI.noteOff(channel, note, duration);
    }

    if(this.onPlay) { this.onPlay(notes.indexOf(note)); }
  }

  Piano.prototype.playEnd = function(fingerId){
    var note = this.playingNotes[fingerId];
    if(!note){ return; }

    MIDI.noteOff(0, note, 0);

    this.playingNotes.splice(fingerId, 1);

    if(this.onPlayEnd) { this.onPlayEnd(notes.indexOf(note)); }
  }

  Piano.prototype.allPlayEnd = function(){
    for(var index in this.playingNotes){
      this.playEnd(index);
    }
  }

  Piano.prototype.addPlayListener = function(callback){
    this.onPlay = callback;
  }

  Piano.prototype.addPlayEndListener = function(callback){
    this.onPlayEnd = callback;
  }

  Piano.prototype.autoPlay = function(){
    var note     = score[this.scoreIndex][0];
    var duration = score[this.scoreIndex][1];

    var time = +new Date;

    if(!this.nextPlayTime || this.nextPlayTime < time){
      this.playEnd(0);
      this.play(0, note, maxVolume, duration / 1000, 1);

      this.playEnd(1);
      this.play(1, note-12, maxVolume / 2, duration / 1000, 1);

      this.nextPlayTime = time + duration;

      this.scoreIndex++;
      if(this.scoreIndex >= score.length){ this.scoreIndex = 0; }
    }
  }

  return Piano;
})();
