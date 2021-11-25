const imgOne = document.getElementById('imgOne');
const imgTwo = document.getElementById('imgTwo');
const quantityPoints = document.getElementById('pointsQantity');
const resultOne = document.getElementById('resultOne');
const resultTwo = document.getElementById('resultTwo');
const button = document.getElementById('button');

const canvasOne = document.getElementById('canvas_one');
const canvasTwo = document.getElementById('canvas_two');
let contextOne = canvasOne.getContext('2d');
let contextTwo = canvasTwo.getContext('2d');

let arrayRGBImageOne = [];
let arrayRGBImageTwo = [];
const MAX_PRESITION = 0.01; // 1%

button.addEventListener('click', calculateRGB);

function calculateRGB() {
    arrayRGBImageOne = [];
    arrayRGBImageTwo = [];
    if (imgOne.files && imgOne.files[0] && imgTwo.files && imgTwo.files[0] && quantityPoints.value) {
        let iterations = Number(quantityPoints.value);
        getRGBrandomValues(1, imgOne.files[0], contextOne, canvasOne, iterations, getRGBarray);
        getRGBrandomValues(2, imgTwo.files[0], contextTwo, canvasTwo, iterations, getRGBarray);
    } else {
        window.alert('Aun no ha seleccionado archivos');
    }
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
        // console.log(`img 1: R=${arrayRGBImageOne[0]}, G=${arrayRGBImageOne[1]}, B=${arrayRGBImageOne[2]}`);
        // console.log(`img 2: R=${arrayRGBImageTwo[0]}, G=${arrayRGBImageTwo[1]}, B=${arrayRGBImageTwo[2]}`);
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
            // console.log(`R=${arrayRGB[0]}, G=${arrayRGB[1]}, B=${arrayRGB[2]}`);
            cbArrayRGB(IDImage, arrayRGB);
        }
    }
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