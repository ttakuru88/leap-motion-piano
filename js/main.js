var MainActivity = (function(){
  function MainActivity(){
    root = this;

    window.onload = function () {
      root.piano     = new Piano();
      root.pianoView = new PianoView('piano');

      root.piano.addPlayListener(function(note){
        root.pianoView.play(note);
      });

      root.piano.addPlayEndListener(function(note){
        root.pianoView.playEnd(note);
      });

      MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function() {
          root.startMotionCapture();
        }
      });
    }
  }

  MainActivity.prototype.startMotionCapture = function(){
    var root = this, i;
    var controller = new Leap.Controller({enableGestures: true});
    var playingNotes = [];

    controller.loop(function(frame){
      var fingersLength = frame.fingers.length;
      var played = false;
      if(fingersLength){
        for(i=0; i<fingersLength; i++){
          var finger = frame.fingers[i];
          played = root.piano.onMoveFinger(finger);
        }
      }

      if(!played){
        root.piano.allPlayEnd();
      }

      var gesturesLength = frame.gestures.length;
      if(gesturesLength){
        for(i=0; i<gesturesLength; i++){
          var gesture = frame.gestures[i]
          switch(gesture.type){
            case 'circle': root.piano.autoPlay(); return;
          }
        }
      }
    });
  }

  return MainActivity;
})();

new MainActivity();
