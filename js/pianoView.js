var PianoView = (function(){
  var keyNum = 34;
  var halfNote = [true, false, true, true, false, true, true];

  function PianoView(id){
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.keyWidth = this.canvas.width / keyNum;
    this.blackKeyWidth = this.keyWidth * 0.8;

    this.renderKeys();
  }

  PianoView.prototype.renderKeys = function(){
    this.ctx.save();
    this.ctx.strokeStyle = '#000';
    this.ctx.fillStyle   = '#000';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for(var i=1; i<keyNum; i++){
      var x = i * this.keyWidth;

      this.ctx.beginPath();
      this.ctx.moveTo(x, this.canvas.height);
      this.ctx.lineTo(x, 0);
      if(halfNote[(i-1)%7] !== false && i > 0){
        this.ctx.fillRect(x - this.keyWidth * 0.4, 0, this.blackKeyWidth, this.canvas.height / 2);
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  PianoView.prototype.play = function(note, isSharp){
    if(isSharp){
      this.drawArc(this.keyWidth * note + this.keyWidth * 0.5 + this.keyWidth / 2, this.canvas.height / 2 - this.blackKeyWidth, this.blackKeyWidth * 0.3, '#ff0000');
    }
    else{
      this.drawArc(this.keyWidth * note + this.keyWidth / 2, this.canvas.height - this.keyWidth, this.keyWidth * 0.3, '#ff0000');
    }
  }

  PianoView.prototype.playEnd = function(note, isSharp){
    if(isSharp){
      this.drawArc(this.keyWidth * note + this.keyWidth * 0.5 + this.keyWidth / 2, this.canvas.height / 2 - this.blackKeyWidth, this.blackKeyWidth * 0.4, '#000000');
    }
    else{
      this.drawArc(this.keyWidth * note + this.keyWidth / 2, this.canvas.height - this.keyWidth, this.keyWidth * 0.4, '#ffffff');
    }
  }

  PianoView.prototype.refresh = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderKeys();
  }

  PianoView.prototype.drawArc = function(x, y, r, c){
    this.ctx.save();
    this.ctx.fillStyle = c;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.restore();
  }

  return PianoView;
})();
