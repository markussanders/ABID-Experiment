const hideLoader = () => {
    const loadScreen = document.querySelector('.loader-screen');
    loadScreen.style.display = 'none';
};

const displayLoader = () => {
    const loadScreen = document.querySelector('.loader-screen');
    loadScreen.style.display = 'block';
    setTimeout(() => undefined, 2000);
};

const displayPrompts = () => {
    const prompts = document.querySelector('.control');
    prompts.style.display = 'block';
};

const handleStopPlaySequence = audio => {
    if (audio.isPlaying()) {
        audio.pause();
    } else {
        audio.play();
    }
};

const setShaderUniforms = (shader, p, img, d_map) => {
    shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight]);
    shader.setUniform('u_texture', img);
    shader.setUniform('u_tResolution', [img.width, img.height]);
    shader.setUniform('d_map', d_map);
    shader.setUniform('img', img);
    shader.setUniform('texRes', [img.width, img.height]);
};

const stopAudioAndResetCanvas = (audio, p) => {
    audio.stop();
    audio.dispose();
    p.remove();
    displayPrompts();
};

const runGreenTea = (bass, mapBass, mid, mapMid, shader, p, fft) => {
    bass = fft.getEnergy("bass");
    mid = fft.getEnergy("mid");

    mapBass = p.map(bass, 0, 255, 0.0, 2.0);
    mapMid = p.map(mid, 0, 255, 0.0, 0.05);

    shader.setUniform('u_time', p.frameCount / 20.0);
    shader.setUniform('u_bass', mapBass);
    shader.setUniform('u_mid', mapMid);
};

const runDarkOcean = (bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft) => {
    bass = fft.getEnergy('bass');
    treble = fft.getEnergy('treble');
    mid = fft.getEnergy('highMid');
    lowMid = fft.getEnergy('mid');

    mapBass = p.map(bass, 0, 255, 0.0, 0.04);
    mapMid = p.map(mid, 0, 30, 0.0, 0.8);
    mapLowMid = p.map(lowMid, 0, 60, 0.0, 0.4);

    const tc = p.map(audio.currentTime(), 0, audio.duration(), 1.0, 1.0);

    shader.setUniform('u_time', tc);
    shader.setUniform('u_bass', mapBass);
    shader.setUniform('u_mid', mapMid);
    shader.setUniform('u_lowmid', mapLowMid);
};

const runSucioBlanco = (bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft) => {
    bass = fft.getEnergy('bass');
    treble = fft.getEnergy('treble');
    mid = fft.getEnergy('highMid');
    lowMid = fft.getEnergy('mid');

    mapBass = p.map(bass, 0, 255, 0.0, 0.04);
    mapMid = p.map(mid, 0, 30, 0.0, 0.8);
    mapLowMid = p.map(lowMid, 0, 60, 0.0, 0.4);

    const tc = p.map(audio.currentTime(), 0, audio.duration(), 1.0, 1.0);

    shader.setUniform('u_time', tc);
    shader.setUniform('u_bass', mapBass);
    shader.setUniform('u_mid', mapMid);
    shader.setUniform('u_lowmid', mapLowMid);
};

const runLiquid = (bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft) => {
    bass = fft.getEnergy('bass');
    treble = fft.getEnergy('treble');
    mid = fft.getEnergy('highMid');
    lowMid = fft.getEnergy('mid');

    mapBass = p.map(bass, 0, 255, 0.0, 0.04);
    mapMid = p.map(mid, 0, 30, 0.0, 0.8);
    mapLowMid = p.map(lowMid, 0, 60, 0.0, 0.4);

    const tc = p.map(audio.currentTime(), 0, audio.duration(), 1.0, 1.0);

    shader.setUniform('u_time', tc);
    shader.setUniform('u_bass', mapBass);
    shader.setUniform('u_mid', mapMid);
    shader.setUniform('u_lowmid', mapLowMid);
};

const runNoise = (bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft) => {
    bass = fft.getEnergy('bass');
    treble = fft.getEnergy('treble');
    mid = fft.getEnergy('highMid');
    lowMid = fft.getEnergy('mid');

    mapBass = p.map(bass, 0, 255, 0.0, 255);
    mapMid = p.map(mid, 0, 50, 0.0, 0.05);
    mapLowMid = p.map(lowMid, 0, 20, 0.0, 20);

    const tc = p.map(audio.currentTime(), 0, audio.duration(), 1.0, 1.0);

    shader.setUniform('u_time', tc);
    shader.setUniform('u_bass', mapBass);
    shader.setUniform('u_mid', mapMid);
    shader.setUniform('u_lowmid', mapLowMid);
};;

const runSolar = (bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft ) => {
    bass = fft.getEnergy("bass");
    treble = fft.getEnergy('treble');
    mid = fft.getEnergy("mid");
    lowMid = fft.getEnergy('mid');

    mapBass = p.map(bass, 0, 255, 10, 255);
    mapMid = p.map(mid, 0, 255, 0.0, 0.005);
    mapLowMid = p.map(lowMid, 0, 20, 0.0, 0.2);

    const tc = p.map(audio.currentTime(), 0, audio.duration(), 1.0, 1.0);

    shader.setUniform('u_time', tc);
    shader.setUniform('u_bass', mapBass);
    shader.setUniform('u_mid', mapMid);
    shader.setUniform('u_lowmid', mapLowMid);
};

const runAlgorithms = (bass, mapBass, mid, mapMid, lowMid, treble, mapLowMid, shader, audio, p, fft) => {
    bass = fft.getEnergy("bass");
    treble = fft.getEnergy('treble');
    mid = fft.getEnergy("mid");
    lowMid = fft.getEnergy('mid');

    mapBass = p.map(bass, 0, 255, 10, 255);
    mapMid = p.map(mid, 0, 255, 0.0, 0.008);
    mapLowMid = p.map(lowMid, 0, 20, 0.0, 0.2);

    const tc = p.map(audio.currentTime(), 0, audio.duration(), 1.0, 1.0);

    shader.setUniform('u_time', tc);
    shader.setUniform('u_bass', mapBass);
    shader.setUniform('u_mid', mapMid);
    shader.setUniform('u_lowmid', mapLowMid);
};