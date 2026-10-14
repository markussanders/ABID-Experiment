/* global p5, ABIDHelpers */

(() => {
    const tracks = [
        { slug: 'liquid' },
        { slug: 'dark-ocean' },
        { slug: 'green-tea' },
        { slug: 'collage' },
        { slug: 'noise' },
        { slug: 'solar' },
        { slug: 'algorithms' },
        { slug: 'dmt', title: 'DMT' }
    ];

    let currentTrackIndex = 0;
    let currentP5;
    let currentAudio;
    let isAudioReady = false;
    let isChangingTrack = false;

    const getCurrentTrack = () => tracks[currentTrackIndex];
    const getAssetPath = (folder, extension) => `${folder}/${getCurrentTrack().slug}.${extension}`;

    const normalizeHash = () => window.location.hash.replace('#', '').trim().toLowerCase();

    const setInitialTrackFromHash = () => {
        const hash = normalizeHash();
        const hashIndex = tracks.findIndex(track => track.slug === hash);

        if (hashIndex >= 0) currentTrackIndex = hashIndex;
    };

    const updateHash = () => {
        const slug = getCurrentTrack().slug;

        if (normalizeHash() === slug || !window.history?.replaceState) return;

        window.history.replaceState(null, '', `#${slug}`);
    };

    const ensureAudioContext = () => {
        const handleStartError = error => {
            console.warn('Could not start the audio context yet.', error);
        };

        if (currentP5 && typeof currentP5.userStartAudio === 'function') {
            const startResult = currentP5.userStartAudio();

            if (startResult && typeof startResult.catch === 'function') {
                startResult.catch(handleStartError);
            }

            return;
        }

        if (typeof window.userStartAudio === 'function') {
            const startResult = window.userStartAudio();

            if (startResult && typeof startResult.catch === 'function') {
                startResult.catch(handleStartError);
            }
        }
    };

    const disposeCurrentSketch = () => {
        if (currentAudio) {
            currentAudio.stop();

            if (typeof currentAudio.dispose === 'function') {
                currentAudio.dispose();
            }

            currentAudio = undefined;
        }

        if (currentP5) {
            currentP5.remove();
            currentP5 = undefined;
        }

        ABIDHelpers.setPlayingState(false);
        ABIDHelpers.setAudioReady(false);
        isAudioReady = false;
    };

    const startCurrentSketch = () => {
        ABIDHelpers.clearStatusMessage();
        ABIDHelpers.showLoader();
        ABIDHelpers.setAudioReady(false);
        ABIDHelpers.updateCounter(currentTrackIndex, tracks);
        ABIDHelpers.displayPromptsAndCounter();
        updateHash();

        currentP5 = new p5(createSketch);
    };

    const changeTrack = direction => {
        if (isChangingTrack) return;

        isChangingTrack = true;
        disposeCurrentSketch();
        currentTrackIndex = (currentTrackIndex + direction + tracks.length) % tracks.length;
        startCurrentSketch();

        window.setTimeout(() => {
            isChangingTrack = false;
        }, 250);
    };

    const togglePlayback = async () => {
        if (!currentAudio || !isAudioReady) {
            ABIDHelpers.displayPromptsAndCounter();
            return;
        }

        ensureAudioContext();

        if (currentAudio.isPlaying()) {
            currentAudio.pause();
            ABIDHelpers.setPlayingState(false);
            ABIDHelpers.displayPromptsAndCounter();
            return;
        }

        currentAudio.play();
        ABIDHelpers.setPlayingState(true);
    };

    const handleKeyDown = event => {
        if (event.repeat) return;

        switch (event.code) {
            case 'ArrowLeft':
                event.preventDefault();
                changeTrack(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                changeTrack(1);
                break;
            case 'Space':
                event.preventDefault();
                togglePlayback();
                break;
            default:
                break;
        }
    };

    const handleControlClick = event => {
        if (!(event.target instanceof Element)) return;

        const button = event.target.closest('[data-action]');

        if (!button) return;

        const action = button.dataset.action;

        if (action === 'previous') changeTrack(-1);
        if (action === 'next') changeTrack(1);
        if (action === 'toggle') togglePlayback();
    };

    const createSketch = p => {
        let shader;
        let img;
        let dMap;
        let fft;
        let audio;

        p.preload = () => {
            const track = getCurrentTrack();
            isAudioReady = false;

            audio = p.loadSound(
                getAssetPath('audio', 'mp3'),
                () => {
                    currentAudio = audio;
                    isAudioReady = true;
                    ABIDHelpers.setAudioReady(true);
                },
                error => ABIDHelpers.showLoadError(track, error)
            );
            img = p.loadImage(getAssetPath('images', 'jpg'));
            shader = p.loadShader('shaders/base.vert', `shaders/${track.slug}.frag`);
            dMap = p.loadImage('images/clouds.jpg');
        };

        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
            canvas.parent('experience');

            currentAudio = audio;
            isAudioReady = true;
            ABIDHelpers.setAudioReady(true);
            currentAudio.setVolume(0.9);

            p.pixelDensity(1);
            p.noStroke();
            p.shader(shader);

            ABIDHelpers.setShaderUniforms(shader, p, img, dMap);
            ABIDHelpers.hideLoader();
            ABIDHelpers.dismissInitialControls();

            fft = new p5.FFT(0.8, 1024);
            fft.setInput(audio);
        };

        p.draw = () => {
            if (!fft || !audio?.isLoaded()) return;

            fft.analyze();

            const runner = ABIDHelpers.shaderRunners[getCurrentTrack().slug];
            runner({ shader, audio, p, fft });

            p.rect(0, 0, p.width, p.height);
        };

        p.windowResized = () => {
            if (!shader) return;

            p.resizeCanvas(p.windowWidth, p.windowHeight);
            shader.setUniform('u_resolution', [p.windowWidth, p.windowHeight]);
        };
    };

    document.addEventListener('DOMContentLoaded', () => {
        setInitialTrackFromHash();
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleControlClick);
        startCurrentSketch();
    });
})();
