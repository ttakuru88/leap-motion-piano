var MainActivity = (function(){
  var resetCircleGestureCountInterval = 500;

  function MainActivity(){
    root = this;
    this.delay = null;

    window.onload = function () {
      root.piano     = new Piano();
      root.pianoView = new PianoView('piano');

      root.piano.addPlayListener(function(note, isSharp){
        root.pianoView.play(note, isSharp);
      });

      root.piano.addPlayEndListener(function(note, isSharp){
        root.pianoView.playEnd(note, isSharp);
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
    var resetCircleGestureCount = null;
    var circleGestureCount = 0;

    controller.loop(function(frame){
      var fingersLength = frame.fingers.length;
      var played = false;
      if(fingersLength){
        for(i=0; i<fingersLength; i++){
          var finger = frame.fingers[i];
          if(root.piano.onMoveFinger(finger) && !played){
            played = true;
          }
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
            case 'circle':
              clearTimeout(resetCircleGestureCount);
              circleGestureCount++;

              if(circleGestureCount > 100){
                root.piano.autoPlay();
              }

              resetCircleGestureCount = setTimeout(function(){
                circleGestureCount = 0;
              }, resetCircleGestureCountInterval);

              return;
          }
        }
      }
    });
  }

  return MainActivity;
})();

new MainActivity();
