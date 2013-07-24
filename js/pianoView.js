var Piano = (function(){
  var keyNum = 35;
  var halfNote = [true, false, true, true, false, true, true];

  function Piano(id){
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.keyWidth = this.canvas.width / keyNum;

    this.renderKeys();
  }

  Piano.prototype.renderKeys = function(){
    this.ctx.save();
    this.ctx.strokeStyle = '#000';
    this.ctx.fillStyle   = '#000';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for(var i=0; i<keyNum; i++){
      var x = i * this.keyWidth;

      this.ctx.beginPath();
      this.ctx.moveTo(x, this.canvas.height);
      this.ctx.lineTo(x, 0);
      if(halfNote[(i-1)%7] !== false && i > 0){
        this.ctx.fillRect(x - this.keyWidth * 0.4, 0, this.keyWidth * 0.8, this.canvas.height / 2);
      }
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  Piano.prototype.play = function(note){
    if(this.prevNote){
      this.drawArc(this.prevNote, '#ffffff', this.keyWidth * 0.4);
    }

    this.drawArc(note, '#ff0000', this.keyWidth * 0.3);
    this.prevNote = note;
  }

  Piano.prototype.drawArc = function(note, color, radius){
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(this.keyWidth * note + this.keyWidth / 2, this.canvas.height - this.keyWidth, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.restore();
  }

  return Piano;
})();
