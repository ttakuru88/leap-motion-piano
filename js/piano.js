window.onload = function () {
  $x      = $('#x');
  $note   = $('#note');
  $volume = $('#volume');
  pianoView = new Piano('piano');

  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    callback: function() {
      startMotionCapture();
    }
  });
};

          //  A    B    C    D    E    F    G
var notes = [
              33,  35,  36,  38,  40,  41,  43,
              45,  47,  48,  50,  52,  53,  55,
              57,  59,  60,  62,  64,  65,  67,
              69,  71,  72,  74,  76,  77,  79,
              81,  83,  84,  86,  88,  89,  91
            ]
var $x, $note, $volume, pianoView;

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
        case 'circle': onCircle(frame, gesture); return;
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

var score = [[60, 500], [60, 500], [67, 500], [67, 500], [69, 500], [69, 500], [67, 500], [67, 500],
             [65, 500], [65, 500], [64, 500], [64, 500], [62, 500], [62, 375], [64, 125], [60, 1000],
             [67, 500], [67, 500], [65, 500], [65, 500], [64, 500], [64, 500], [62, 500], [62, 500],
             [67, 500], [67, 500], [65, 500], [65, 500], [64, 350], [65, 50], [64, 50], [62, 50], [64, 375], [65, 125], [64, 500], [62, 500],
             [60, 500], [60, 500], [67, 500], [67, 500], [69, 500], [69, 500], [67, 500], [67, 500],
             [65, 500], [65, 500], [64, 500], [64, 500], [62, 350], [64, 50], [62, 50], [60, 50], [62, 375], [64, 125], [60, 1000]];

var currentNote = 0;
var nextPlayTime;
function onCircle(frame, gesture){
  var note     = score[currentNote][0];
  var duration = score[currentNote][1];

  var time = +new Date;

  if(!nextPlayTime || nextPlayTime < time){
    play(note, maxVolume, duration / 1000);
    play(note-12, maxVolume / 2, duration / 1000);

    nextPlayTime = time + duration;

    currentNote++;
    if(currentNote >= score.length){ currentNote = 0; }
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

function play(note, volume, duration){
  MIDI.noteOn(0, note, volume, 0);
  if(duration){
    MIDI.noteOff(0, note, duration)
  }

  pianoView.play(notes.indexOf(note));
  $note.text(note);
}
