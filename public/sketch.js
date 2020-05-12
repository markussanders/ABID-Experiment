let audioLink, imageLink;
let index;
let audioImageTitles;


document.addEventListener('DOMContentLoaded', () => setAudioAndImage());

const setAudioAndImage = () => {
  audioImageTitles = [
    'liquid',
    'dark-ocean',
    'green-tea',
    'collage',
    'noise',
    'solar',
    'algorithms'
  ];

  if (audioImageTitles[index] === undefined) index = 0;
  audioLink = 'audio/' + audioImageTitles[index] + '.mp3';
  imageLink = 'images/' + audioImageTitles[index] + '.jpg';

  updateCounter(index, audioImageTitles);  
  new p5(sketch);
  displayPromptsAndCounter();
} 

const sketch = p => {
  let shader, img, d_map, fft, audio;

  p.preload = () => {
    audio = p.loadSound(audioLink, null, displayLoader());
    img = p.loadImage(imageLink);
    shader = p.loadShader('shaders/base.vert', `shaders/${audioImageTitles[index]}.frag`);
    d_map = p.loadImage('images/clouds.jpg');
  };

  p.setup = () => {
    hideLoader();

    p.pixelDensity(1);
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);

    p.shader(shader);
    setShaderUniforms(shader, p, img, d_map);

    fft = new p5.FFT();
  };
 
  p.keyPressed = () => {
    if (event.keyCode === p.LEFT_ARROW) {
      setTimeout(() => {
        stopAudioAndResetCanvas(audio, p);
        index === 0 ? index = audioImageTitles.length - 1 : index--;
        setAudioAndImage();
      }, 500);

    } else if (event.keyCode === p.RIGHT_ARROW) {
      setTimeout(() => {
        stopAudioAndResetCanvas(audio, p);
        index === audioImageTitles.length - 1 ? index = 0 : index++;
        setAudioAndImage();
      }, 500);

    }
  };

  document.addEventListener('keydown', event => {
    if (event.keyCode === 32) handleStopPlaySequence(audio);
  });

  // document.addEventListener('mousemove', () => {
  //   displayPromptsAndCounter();
  // });

  p.draw = () => {
    fft.analyze();
    let bass, mapBass, mid, mapMid, treble, lowMid, mapLowMid;

    switch (index) {
      case 0:
        runLiquid(bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft);
      break;
      case 1:
        runDarkOcean(bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft);
        break;
      case 2:
        runGreenTea(bass, mapBass, mid, mapMid, shader, p, fft);
        break;
      case 3:
        runCollage(bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft);
        break;
      case 4:
        runNoise(bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft);
        break;
      case 5:
        runSolar(bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft);
        break;
      case 6:
        runAlgorithms(bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft);
        break;
      default: 
        location.reload();
    }
    p.rect(0, 0, p.width, p.height);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight]);
  };
};
