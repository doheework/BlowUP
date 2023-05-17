let audioContext;


const windowHeight = window.innerHeight;
var video = document.getElementById("background-video");
let backgroundVideoElement = document.querySelector("#background-video");
let backgroundVideoBottomValue = 0;
let mobile = document.querySelector("#mobile");
let mobileBottomValue = 0;




const textElement = document.querySelector('#text');
const instruct = document.querySelector('#instruction');
const notice = document.querySelector('#notice');
const mice = document.querySelector('#mic');
const blow = document.querySelector('#blow');



textElement.addEventListener("input", function() {
  var text = textElement.innerText;
  var animatedText = "";

  for (var i = 0; i < text.length; i++) {
    var randomColor = getRandomColor();
    var randomDelay = getRandomDelay();
    animatedText += '<span class="moving-text moving-text-' + i + '" style="color: ' + randomColor + '; animation-delay: ' + randomDelay + 's">' + text[i] + '</span>';
  }

  textElement.innerHTML = animatedText;
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }

  return color;
}

function getRandomDelay() {
  return Math.random() * 8; // Adjust the range of delay as desired
}


// Set up the audio context and microphone input when the start button is clicked
document.querySelector('#startButton').addEventListener('click', async () => {
  // Set up the Web Audio API context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();


  notice.style.visibility = 'hidden';
  mic.style.visibility = 'hidden';
  blow.style.visibility = 'visible';

  

  // Set up the microphone input
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyserNode = audioContext.createAnalyser();
  source.connect(analyserNode);

  // Set up the font weight update loop
  let duration = 0;
  let maxDuration = 4;
  let maxWeight = 1000;
  let isBreathing = false;
  let weight = 0;
  let sustainTime = 0;
  let decreaseStep = maxWeight * 0.05 * (1 / maxDuration);


  // Set up the animation loop
  let bottomValue = 50;
  let isRotating = false;


  window.addEventListener('DOMContentLoaded', () => {
    const textElement = document.querySelector('#text');
    const text = textElement.innerText.trim();
    let direction = 1;
    let position = 3;
    const speed = 70;
    
    function animateText() {
        position += speed * direction;
        if (position > window.innerWidth - textElement.offsetWidth || position < 0) {
            direction *= -1;
        }
        textElement.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animateText);
    }

    animateText();
});


  // Update the font weight, position, and rotation
  function update() {
    // Get the frequency data from the analyzer node
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(dataArray);

    // Calculate the average frequency
    const frequencySum = dataArray.reduce((sum, value) => sum + value, 0);
    const frequencyAvg = frequencySum / dataArray.length;

    const textHeight = textElement.offsetHeight;

    textElement.style.bottom = `${bottomValue}px`;
 const movingTextElements = document.querySelectorAll('.moving-text');



    if (frequencyAvg > 20 || weight === maxWeight) {
      duration = Math.min(duration + 0.05, maxDuration);
      isBreathing = true;
      weight = Math.min(weight + (maxWeight * 0.05 * (duration / maxDuration)), maxWeight);
      sustainTime = 0;

      if (weight === maxWeight) {

        textElement.style.backgroundColor = 'transparent';

        movingTextElements.forEach((element) => {
          element.style.animationPlayState = 'running';
          
        });

        blow.style.visibility = 'hidden';

        //video movement
        backgroundVideoBottomValue -= (backgroundVideoElement.offsetHeight / 600);
        if (backgroundVideoBottomValue <= -(backgroundVideoElement.offsetHeight - windowHeight)) {
          backgroundVideoBottomValue = -(backgroundVideoElement.offsetHeight - windowHeight);
        }
        backgroundVideoElement.style.bottom = backgroundVideoBottomValue + "px";

        mobileBottomValue -= (mobile.offsetHeight / 550);
        if (mobileBottomValue <= -(mobile.offsetHeight - windowHeight)) {
          mobileBottomValue = -(mobile.offsetHeight - windowHeight);
        }
        mobile.style.bottom = mobileBottomValue + "px";

        //text floating
        bottomValue += weight * 0.01 / 7;
        if (bottomValue + textHeight >= windowHeight) {
          textElement.style.visibility = 'hidden'; // Set visibility to hidden
          instruct.style.visibility = 'visible';
        }

        
      }
    } else {


      if (weight > 0) {
        duration = Math.max(duration - 0.05, 0);
        isBreathing = false;
        weight = Math.max(weight - (maxWeight * 0.05 * (duration / maxDuration)), 0);
        sustainTime += 0.05;
      }
      if (sustainTime >= maxDuration) {
        duration = 0;
        weight = 0;
        sustainTime = 0;
      }
    }
    




    // Set the font variation settings
    const fontVariationSettings = `'wght' ${weight}`;
    textElement.style.fontVariationSettings = fontVariationSettings;

    // Update the position based on the font weight


    // Request the next animation frame
    requestAnimationFrame(update);
  }

  // Start the animation loop
  update();
});

