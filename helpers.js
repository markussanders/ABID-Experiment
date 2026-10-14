window.ABIDHelpers = (() => {
    let overlayTimeout;
    let controlsTimeout;

    const getElement = selector => document.querySelector(selector);

    const showLoader = () => {
        const loadScreen = getElement('.loader-screen');

        if (!loadScreen) return;

        loadScreen.hidden = false;
        loadScreen.style.display = 'grid';
    };

    const hideLoader = () => {
        const loadScreen = getElement('.loader-screen');

        if (!loadScreen) return;

        loadScreen.hidden = true;
        loadScreen.style.display = 'none';
    };

    const hidePlayerControls = () => {
        window.clearTimeout(controlsTimeout);
        getElement('.controls-bar')?.classList.remove('controls-visible');
    };

    const dismissInitialControls = () => {
        const controls = getElement('.controls-bar');

        if (!controls?.classList.contains('controls-visible')) return;

        window.clearTimeout(controlsTimeout);
        controlsTimeout = window.setTimeout(hidePlayerControls, 5000);
    };

    const displayPromptsAndCounter = (duration = 5000) => {
        const overlay = getElement('.overlay');

        if (!overlay) return;

        window.clearTimeout(overlayTimeout);
        overlay.classList.remove('overlay-hidden');
        overlay.classList.add('overlay-visible');

        if (duration > 0) {
            overlayTimeout = window.setTimeout(() => {
                overlay.classList.remove('overlay-visible');
                overlay.classList.add('overlay-hidden');
            }, duration);
        }
    };

    const formatTitle = slug => slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const updateCounter = (index, tracks) => {
        const title = getElement('#title');
        const count = getElement('#count');
        const track = tracks[index];

        if (title) title.textContent = track.title || formatTitle(track.slug);
        if (count) count.textContent = `${index + 1} / ${tracks.length}`;
    };

    const setPlayingState = isPlaying => {
        const toggleButton = getElement('[data-action="toggle"]');

        if (!toggleButton) return;

        toggleButton.textContent = isPlaying ? 'Pause' : 'Play';
        toggleButton.setAttribute('aria-pressed', String(isPlaying));

        if (isPlaying) hidePlayerControls();
    };

    const setAudioReady = isReady => {
        const toggleButton = getElement('[data-action="toggle"]');

        if (!toggleButton) return;

        toggleButton.disabled = !isReady;

        if (!isReady) {
            toggleButton.textContent = 'Loading';
            toggleButton.setAttribute('aria-pressed', 'false');
            return;
        }

        if (toggleButton.textContent === 'Loading') {
            toggleButton.textContent = 'Play';
        }
    };

    const setStatusMessage = message => {
        const controls = getElement('.control');

        if (!controls) return;

        let status = getElement('[data-status-message]');

        if (!status) {
            status = document.createElement('span');
            status.className = 'prompt';
            status.dataset.statusMessage = 'true';
            controls.append(status);
        }

        status.textContent = message;
    };

    const showLoadError = (track, error) => {
        console.error(`Could not load ${track.slug}`, error);
        hideLoader();
        setPlayingState(false);
        setStatusMessage(`Could not load ${track.title || formatTitle(track.slug)}`);
        displayPromptsAndCounter(0);
    };

    const clearStatusMessage = () => {
        const status = getElement('[data-status-message]');
        status?.remove();
    };

    const setShaderUniforms = (shader, p, img, dMap) => {
        shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight]);
        shader.setUniform('u_texture', img);
        shader.setUniform('u_tResolution', [img.width, img.height]);
        shader.setUniform('d_map', dMap);
        shader.setUniform('img', img);
        shader.setUniform('texRes', [img.width, img.height]);
    };

    const getLevels = fft => ({
        bass: fft.getEnergy('bass'),
        highMid: fft.getEnergy('highMid'),
        mid: fft.getEnergy('mid'),
        treble: fft.getEnergy('treble')
    });

    const setMappedUniforms = (shader, values) => {
        Object.entries(values).forEach(([uniform, value]) => {
            shader.setUniform(uniform, value);
        });
    };

    const runSoftDisplacement = ({ shader, p, fft }) => {
        const { bass, highMid, mid } = getLevels(fft);

        // These shaders use u_time as displacement strength, not playback progress.
        setMappedUniforms(shader, {
            u_time: 1,
            u_bass: p.map(bass, 0, 255, 0, 0.04),
            u_mid: p.map(highMid, 0, 30, 0, 0.8),
            u_lowmid: p.map(mid, 0, 60, 0, 0.4)
        });
    };

    const runGreenTea = ({ shader, p, fft }) => {
        const { bass, mid } = getLevels(fft);

        setMappedUniforms(shader, {
            u_time: p.frameCount / 20,
            u_bass: p.map(bass, 0, 255, 0, 2),
            u_mid: p.map(mid, 0, 255, 0, 0.05)
        });
    };

    const runNoise = ({ shader, p, fft }) => {
        const { highMid, mid, treble } = getLevels(fft);

        setMappedUniforms(shader, {
            u_time: 1,
            u_bass: Math.max(0.001, p.map(treble, 0, 255, 0, 255)),
            u_mid: p.map(highMid, 0, 50, 0, 0.05),
            u_lowmid: p.map(mid, 0, 20, 0, 20)
        });
    };

    const runBrightDisplacement = ({ shader, p, fft }, midMax) => {
        const { bass, mid } = getLevels(fft);

        setMappedUniforms(shader, {
            u_time: 1,
            u_bass: p.map(bass, 0, 255, 10, 255),
            u_mid: p.map(mid, 0, 255, 0, midMax),
            u_lowmid: p.map(mid, 0, 20, 0, 0.2)
        });
    };

    const shaderRunners = {
        liquid: runSoftDisplacement,
        'dark-ocean': runSoftDisplacement,
        'green-tea': runGreenTea,
        collage: runSoftDisplacement,
        noise: runNoise,
        solar: context => runBrightDisplacement(context, 0.005),
        algorithms: context => runBrightDisplacement(context, 0.008),
        dmt: context => runBrightDisplacement(context, 0.008)
    };

    return {
        clearStatusMessage,
        dismissInitialControls,
        displayPromptsAndCounter,
        hideLoader,
        setAudioReady,
        setPlayingState,
        setShaderUniforms,
        shaderRunners,
        showLoadError,
        showLoader,
        updateCounter
    };
})();
