const inputVideo = document.getElementById('input_video');
const videoTag = document.getElementById('video_tag');
const videoSource = document.getElementById('video_source');

const quantityPoints = document.getElementById('pointsQantity');
const presitionPercentage = document.getElementById('presition_percentage');

const buttonLoad = document.getElementById('button_load');
const buttonCalculate = document.getElementById('button_calculate');
const frameMovementList = document.getElementById('frame_movement_list');

const maxRange = document.getElementById('max_range');

let videoDuration = 0;
let currentTime = 0;
let actualVideo = null;
let endCalculated = false;
let maxPixelsPerFrame = 0;
let arrayRGBImageOne = [];
let arrayRGBImageTwo = [];
let presition = 0;

buttonLoad.addEventListener('click', loadVideo);
buttonCalculate.addEventListener('click', calculate);

function loadVideo() {
    arrayRGBImageOne = [];
    arrayRGBImageTwo = [];
    if (inputVideo.value && inputVideo.files[0]) {
        document.getElementById('frames').innerHTML = '';
        readVideo(inputVideo.files[0]);
    } else {
        window.alert('Aun no ha seleccionado un video');
    }
}

function readVideo(video) {
    let reader = new FileReader();
    reader.onload = function(event) {
        videoSource.src = URL.createObjectURL(video);
        videoTag.load();
        videoTag.onloadedmetadata = function() {
            window.URL.revokeObjectURL(videoTag.src);
            videoDuration = Math.floor(videoTag.duration);
            maxPixelsPerFrame = videoTag.videoWidth * videoTag.videoHeight;
            maxRange.innerHTML = `<strong><= ${maxPixelsPerFrame}</strong>`;
            actualVideo = videoTag;
        }
    }.bind(this);
    reader.readAsDataURL(video);
}

function calculate() {
    if (actualVideo != null) {
        if(quantityPoints.value && presitionPercentage.value) {
            let points = Number(quantityPoints.value);
            if (points > 0 && points <= maxPixelsPerFrame && presitionPercentage.value > 0 && presitionPercentage.value <= 100) {
                frameMovementList.innerHTML = '';
                presition = (100 - Number(presitionPercentage.value)) / 100;
                getFrames(points, 0, null, null);
            } else {
                window.alert('Los parametros ingresados superan el valor maximo'); 
            }
        } else {
            window.alert('Aun no ha ingresado los parametros para realizar calculo');
        }
    } else {
        window.alert('Aun no ha cargado un video');
    }
}

function getFrames(iterations, currentSecond, previousCanvasImage, previousContexImage) {
    currentTime = actualVideo.currentTime = currentSecond;
    videoTag.onseeked = function(event) {
        let canvas = document.createElement('canvas');
        canvas.height = videoTag.videoHeight;
        canvas.width = videoTag.videoWidth;
        let context = canvas.getContext('2d');
        context.drawImage(videoTag, 0, 0, canvas.width, canvas.height);
        let img = new Image();
        img.src = canvas.toDataURL();
        if (previousCanvasImage != null && previousContexImage != null) {
            compareFrames(iterations, currentSecond, previousCanvasImage, previousContexImage, currentSecond+1,  canvas, context);
        }
        if(currentSecond <= videoDuration) {
            getFrames(iterations, currentSecond+1, canvas, context);
        } else {
            endCalculated = true;
            return;
        }
    }
}

function compareFrames(iterations, frameN, canvasOne, contextOne, frameNplusOne, canvasTwo, contextTwo) {
    arrayRGBImageOne = getSumRGBfromRandomPixels(iterations, contextOne, canvasOne.width, canvasOne.height);
    arrayRGBImageTwo = getSumRGBfromRandomPixels(iterations, contextTwo, canvasTwo.width, canvasTwo.height);
    let isMovement = compareRGBWithMontecarlo(arrayRGBImageOne, arrayRGBImageTwo);
    showResult(frameN, frameN, frameNplusOne, isMovement);
}

function getSumRGBfromRandomPixels(iterations, context, imgWidth, imgHeight) {
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

function compareRGBWithMontecarlo(arrayRGBImageOne, arrayRGBImageTwo) {
    let rImageOne = arrayRGBImageOne[0];
    let gImageOne = arrayRGBImageOne[1];
    let bImageOne = arrayRGBImageOne[2];
    let rImageTwo = arrayRGBImageTwo[0];
    let gImageTwo = arrayRGBImageTwo[1];
    let bImageTwo = arrayRGBImageTwo[2];
    let percentageRImgOne = rImageOne * presition;
    let percentageGImgOne = gImageOne * presition;
    let percentageBImgOne = bImageOne * presition;
    if ((rImageTwo < rImageOne-percentageRImgOne || rImageTwo > rImageOne+percentageRImgOne) ||
    (gImageTwo < gImageOne-percentageGImgOne || gImageTwo > gImageOne+percentageGImgOne) ||
    (bImageTwo < bImageOne-percentageBImgOne || bImageTwo > bImageOne+percentageBImgOne)) {
        return true;
    } else {
        return false;
    }
}

function showResult(n, frameN, frameNplusOne, movement) {
    const newRow = document.createElement('tr');
    const td_n = document.createElement('td');
    const td_frameN = document.createElement('td');
    const td_frameNplusOne = document.createElement('td');
    const td_movement = document.createElement('td');
    td_n.textContent = n;
    td_frameN.textContent = frameN;
    td_frameNplusOne.textContent = frameNplusOne;
    if (movement) {
        td_movement.textContent = 'SI';
    } else {
        td_movement.textContent = 'NO';
    }
    newRow.appendChild(td_n);
    newRow.appendChild(td_frameN);
    newRow.appendChild(td_frameNplusOne);
    newRow.appendChild(td_movement);
    frameMovementList.appendChild(newRow);
}