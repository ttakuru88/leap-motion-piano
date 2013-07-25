var ScoreGenerator = (function(){
  var score = '[';
  var duration = 500;
  var octave = 0;
  var extra = null;

  function ScoreGenerator(){
  }

  ScoreGenerator.start = function(){
    window.addEventListener('keydown', function(e){
      ScoreGenerator.onKeyDown(e);
    }, false);
  }

  ScoreGenerator.onKeyDown = function(e){
    console.clear();
    switch(e.keyCode){
    case 49: // 1
      ScoreGenerator.setDuration(2000);
      break;
    case 50: // 2
      ScoreGenerator.setDuration(1000);
      break;
    case 51: // 3
      ScoreGenerator.setDuration(500);
      break;
    case 52: // 4
      ScoreGenerator.setDuration(250);
      break;
    case 53: // 5
      ScoreGenerator.setDuration(125);
      break;
    case 65: // A
      ScoreGenerator.generate(57);
      break;
    case 66: // B
      ScoreGenerator.generate(59);
      break;
    case 67: // C
      ScoreGenerator.generate(60);
      break;
    case 68: // D
      ScoreGenerator.generate(62);
      break;
    case 69: // E
      ScoreGenerator.generate(64);
      break;
    case 70: // F
      ScoreGenerator.generate(65);
      break;
    case 71: // G
      ScoreGenerator.generate(67);
      break;
    case 87: // w
      ScoreGenerator.setOctave(octave + 1);
      break;
    case 81: // q
      ScoreGenerator.setOctave(octave - 1);
      break;
    case 79: // o
      ScoreGenerator.setDuration(duration + 250);
      break;
    case 80: // p
      ScoreGenerator.setDuration(duration + 100);
      break;
    case 219: // [
      ScoreGenerator.setDuration(duration + 25);
      break;
    case 221: // ]
      ScoreGenerator.setDuration(duration - 25);
      break;
    case 189: // -
      ScoreGenerator.setExtra('flat');
      break;
    case 187: // +
      ScoreGenerator.setExtra('sharp');
      break;
    case 48: // 0
      ScoreGenerator.setExtra(null);
      break;
    case 27: // ESC
      console.log(score+'];');
      break;
    }
    console.log(e.keyCode)
  }

  ScoreGenerator.generate = function(note){
    note += octave * 12;
    if(extra == 'flat')  { note--; }
    if(extra == 'sharp') { note++; }

    str = '[' + note + ',' + duration + '],';
    score += str;
    console.log(str);
  }

  ScoreGenerator.setDuration = function(time){
    duration = time;
    console.log('duration', time);
  }

  ScoreGenerator.setExtra = function(ex){
    extra = ex;
    console.log('ex', ex);
  }

  ScoreGenerator.setOctave = function(oct){
    octave = oct;
    console.log('oct', oct);
  }

  return ScoreGenerator;
})();
