window.onload = function () {
  $x      = $('#x');
  $note   = $('#note');
  $volume = $('#volume');

  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    callback: function() {
      startMotionCapture();
    }
  });
};

          //  A    B    C    D    E    F    G
var notes = [ 21,  23,  24,  26,  28,  29,  31,
              33,  35,  36,  38,  40,  41,  43,
              45,  47,  48,  50,  52,  53,  55,
              57,  59,  60,  62,  64,  65,  67,
              69,  71,  72,  74,  76,  77,  79,
              81,  83,  84,  86,  88,  89,  91,
              93,  95,  96,  98, 100, 101, 103,
             105, 107, 108 ]
var $x, $note, $volume;

function startMotionCapture(){
  var controller = new Leap.Controller({enableGestures: true});

  controller.loop(function(frame){
    if(frame.fingers.length){
      $x.text(frame.fingers[0].tipPosition[0]);
    }

    if(!frame.gestures.length) { return; }

    var gesturesLength = frame.gestures.length;
    var fingersLength  = frame.fingers.length;
    for(i=0; i<gesturesLength; i++){
      var gesture = frame.gestures[i]

      switch(gesture.type){
      case 'keyTap':
        var velocity;
        for(var j=0; j<fingersLength; j++){
          var finger = frame.fingers[j];
          if(finger.id == gesture.pointableIds[0]){
            velocity = finger.tipVelocity[1];
            break;
          }
        }

        var volume = velocity / 1000 * 128;
        if(volume < 0)   { volume = 0; }
        if(volume > 128) { volume = 128; }

        var x = gesture.position[0] + 256;
        var keyWidth = 512 / notes.length;
        var note = notes[~~(x / keyWidth)];

        $note.text(note);
        $volume.text(volume);

        play(note, volume);

        break;
      case 'swipe':
        break;
      }
    }
  });
}

var channel = 0;
function play(note, volume){
  MIDI.noteOn(channel, note, volume, 0);
  MIDI.noteOff(channel, note, 1);
  channel++;
  if(channel >= 7) { channel = 0; }
}
