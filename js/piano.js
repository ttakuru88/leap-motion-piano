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
    for(var i=0; i<gesturesLength; i++){
      var gesture = frame.gestures[i]

      switch(gesture.type){
        case 'keyTap': onKeyTap(frame, gesture); break;
        case 'swipe':  onSwipe(frame, gesture);  return;
      }
    }
  });
}

function onKeyTap(frame, gesture){
  var volume = getVolume(frame.fingers, gesture);
  var note   = getNote(gesture)

  play(note, volume);
}

var prevNote;
function onSwipe(frame, gesture){
  var volume = getVolume(frame.fingers, gesture, 5);
  var note   = getNote(gesture);

  if(prevNote != note){
    play(note, volume);
    prevNote = note;
  }
}

var maxVolume = 127;
function getVolume(fingers, gesture, weight){
  weight = weight || 1;

  var velocity, fingersLength  = fingers.length;
  for(var i=0; i<fingersLength; i++){
    var finger = fingers[i];
    if(finger.id == gesture.pointableIds[0]){
      velocity = finger.tipVelocity[1];
      break;
    }
  }

  if(isNaN(velocity)) { return maxVolume; }

  var volume = velocity / 1000 * maxVolume * weight;
  if(volume < 0)         { volume = 0; }
  if(volume > maxVolume) { volume = maxVolume; }

  $volume.text(volume);
  return volume;
}

function getNote(gesture){
  var x = gesture.position[0] + 256;
  var keyWidth = 512 / notes.length;

  return notes[~~(x / keyWidth)];
}

var channel = 0;
function play(note, volume){
  MIDI.noteOn(channel, note, volume, 0);
  MIDI.noteOff(channel, note, 1);
  channel++;
  if(channel >= 7) { channel = 0; }

  $note.text(note);
}
