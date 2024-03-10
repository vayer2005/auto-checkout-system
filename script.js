const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const items = document.getElementById('items');
let price = 5.99

let cart = [];
var model = undefined;
cocoSsd.load().then(function (loadedModel) {
    model = loadedModel;
  });

enableCam()

function enableCam() {
    const constraints = {
        video: true
      };
    
      navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
      });
    }


var children = []

function predictWebcam() {

  model.detect(video).then(function (predictions) {

    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);
    

    for (let n = 0; n < predictions.length; n++) {
      if (predictions[n].score > 0.66 && predictions[n].class != "person") {
        const p = document.createElement('p');
        p.innerText = predictions[n].class
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        children.push(highlighter);
        children.push(p);
        if(cart.includes(predictions[n].class) == false) {
          items.innerHTML += '<tr>'
          items.innerHTML += '<td>' + predictions[n].class + '</td>'+'<td><input type="number" id="quantity" name="'+ predictions[n].class + '"min="0" max="5" value = "1"></td><td>' + price + '</td><td><button onclick = remove(this)>Remove</button></td>';
          items.innerHTML += '</tr>'
          cart.push(predictions[n].class)
        }
      }
    }
    
    window.requestAnimationFrame(predictWebcam);
  });
}

function remove(e, n) {
  e.parentNode.parentNode.remove();
}