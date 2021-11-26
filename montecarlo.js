const inputVideo = document.getElementById('input_video');
const videoTag = document.getElementById('video_tag');
const videoSource = document.getElementById('video_source');
// const imgOne = document.getElementById('imgOne');
// const imgTwo = document.getElementById('imgTwo');
const quantityPoints = document.getElementById('pointsQantity');
const buttonLoad = document.getElementById('button_load');
const buttonCalculate = document.getElementById('button_calculate');

// const canvasOne = document.getElementById('canvas_one');
// const canvasTwo = document.getElementById('canvas_two');
// let contextOne = canvasOne.getContext('2d');
// let contextTwo = canvasTwo.getContext('2d');

let videoDuration = 0;
let currentTime = 0;
let actualVideo;
let endCalculated = false;
let arrayRGBImageOne = [];
let arrayRGBImageTwo = [];
const MAX_PRESITION = 0.01; // 1%

buttonLoad.addEventListener('click', loadVideo);
buttonCalculate.addEventListener('click', calculate);

function calculate() {
    getFrames(0, null, null);
}

function getFrames(currentSecond, previousCanvasImage, previousContexImage) {
    console.log(currentSecond);
    currentTime = actualVideo.currentTime = currentSecond;
    videoTag.onseeked = function(event) {
        let canvas = document.createElement('canvas');
        canvas.height = videoTag.videoHeight;
        canvas.width = videoTag.videoWidth;
        let context = canvas.getContext('2d');
        context.drawImage(videoTag, 0, 0, canvas.width, canvas.height);
        let img = new Image();
        img.src = canvas.toDataURL();
        drawFrames(img, this.currentTime, event); // Quitar esto
        //if (previousCanvasImage != null && previousContexImage != null) {
            //Comparar frames
            //compareFrames(previousCanvasImage, previousContexImage, canvas, context);
        //}
        if(currentSecond <= videoDuration) {
            getFrames(currentSecond+1, canvas, context);
        } else {
            endCalculated = true;
            return;
        }
    }
}

function loadVideo() {
    arrayRGBImageOne = [];
    arrayRGBImageTwo = [];
    // if (imgOne.files && imgOne.files[0] && imgTwo.files && imgTwo.files[0] && quantityPoints.value) {
    if (inputVideo.value && inputVideo.files[0]) {
        readVideo(inputVideo.files[0]);
        // let iterations = Number(quantityPoints.value);
        // getRGBrandomValues(1, imgOne.files[0], contextOne, canvasOne, iterations, getRGBarray);
        // getRGBrandomValues(2, imgTwo.files[0], contextTwo, canvasTwo, iterations, getRGBarray);
    } else {
        window.alert('Aun no ha seleccionado archivos');
    }
}

function readVideo(video) {
    let reader = new FileReader();
    reader.onload = function(event) {
        videoSource.src = URL.createObjectURL(video); //event.target.result;
        videoTag.load();
        videoTag.onloadedmetadata = function() {
            window.URL.revokeObjectURL(videoTag.src);
            videoDuration = Math.floor(videoTag.duration)
            actualVideo = videoTag;
        }
    }.bind(this);
    reader.readAsDataURL(video);
}

function drawFrames(image, seconds, event) {
    if (event.type == 'seeked' && !endCalculated) {
        let li = document.createElement('li');
        li.innerHTML = '<b>Imagen en el segundo ' + seconds + ':</b><br />';
        document.getElementById('frames').appendChild(li);
        document.getElementById('frames').appendChild(image);
        console.log(document.getElementById('frames').childNodes);
    }
}

function getFamesFromVideo() {

}

function getRGBarray(IDImage, array) {
    if (IDImage === 1) {
        arrayRGBImageOne = array;
    }
    if (IDImage === 2) {
        arrayRGBImageTwo = array;
    }
    if (arrayRGBImageOne.length > 0 && arrayRGBImageTwo.length > 0) {
        let rImageOne = arrayRGBImageOne[0];
        let gImageOne = arrayRGBImageOne[1];
        let bImageOne = arrayRGBImageOne[2];
        let rImageTwo = arrayRGBImageTwo[0];
        let gImageTwo = arrayRGBImageTwo[1];
        let bImageTwo = arrayRGBImageTwo[2];
        let percentageRImgOne = rImageOne * MAX_PRESITION;
        let percentageGImgOne = gImageOne * MAX_PRESITION;
        let percentageBImgOne = bImageOne * MAX_PRESITION;
        if ((rImageTwo < rImageOne-percentageRImgOne || rImageTwo > rImageOne+percentageRImgOne) ||
        (gImageTwo < gImageOne-percentageGImgOne || gImageTwo > gImageOne+percentageGImgOne) ||
        (bImageTwo < bImageOne-percentageBImgOne || bImageTwo > bImageOne+percentageBImgOne)) {
            window.alert('Por lo tanto se movio esa mondá!!!');
        } else {
            window.alert('No se movio');
        }
    }
}

function getRGBrandomValues(IDImage, image, context, canvas, iterations, cbArrayRGB) {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function () {
        let img = new Image();
        img.src = reader.result;
        img.onload = function() {
            let arrayRGB = [];
            let imgWidth = Number(img.width);
            let imgHeight = Number(img.height);
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            context.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, imgWidth, imgHeight);
            arrayRGB = generationRandomPointsMontecarlo(iterations, context, imgWidth, imgHeight);
            cbArrayRGB(IDImage, arrayRGB);
        }
    }
}

function compareFrames(contextOne, ContextTwo) {

}

function generationRandomPointsMontecarlo(iterations, context, imgWidth, imgHeight) {
    let xPixel = 0;
    let yPixel = 0;
    let sumRImg = 0;
    let sumGImg = 0;
    let sumBImg = 0;
    let actualPixel;
    let actualData;
    for (let i = 0; i < iterations; i++) {
        xPixel = generateRandon(0, imgWidth);
        yPixel = generateRandon(0, imgHeight);
        actualPixel = context.getImageData(xPixel, yPixel, 1, 1);
        actualData = actualPixel.data;
        sumRImg += actualData[0];
        sumGImg += actualData[1];
        sumBImg += actualData[2];
    }
    return [sumRImg, sumGImg, sumBImg]
}

function generateRandon(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}