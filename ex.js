let video = document.createElement("video");
let input = document.getElementById('button');

let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

video.addEventListener('loadeddata', function() {
  reloadRandomFrame();
}, false);

video.addEventListener('seeked', function() {
  let context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  document.body.appendChild(canvas);
}, false);

let playSelectedFile = function(event) {
  let file = this.files[0];
  let fileURL = URL.createObjectURL(file);
  video.src = fileURL;
}

input.addEventListener('change', playSelectedFile, false);

function reloadRandomFrame() {
  if (!isNaN(video.duration)) {
    var rand = Math.round(Math.random() * video.duration * 1000) + 1;
    video.currentTime = rand / 1000;
  }
}