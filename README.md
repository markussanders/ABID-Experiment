# ABID Experiment

Audio-based Image Distortion Experiment I.

Eight pieces pairing still images with audio. Each track's frequencies feed a WebGL shader, making the image stretch, ripple, or shift with the sound.

[View the live experiment](https://markussanders.github.io/ABID-Experiment/)

## Controls

| Input | Action |
| --- | --- |
| Space | Play or pause audio |
| Left / right arrow keys | Previous / next piece |
| Prev, Play / Pause, Next buttons | Playback and navigation on touch screens |
| Tab | Focus the player buttons, revealing them on desktop |

On desktop, the buttons fade away five seconds after loading or when playback starts. They stay visible on small screens. Changing pieces stops the current track; start playback again to hear the next one.

Each piece also has its own URL fragment, such as [`#dark-ocean`](https://markussanders.github.io/ABID-Experiment/#dark-ocean), for sharing a direct link.

## Run Locally

With Node.js and npm installed:

```sh
git clone https://github.com/markussanders/ABID-Experiment.git
cd ABID-Experiment
npm start
```

Open [localhost:3000](http://localhost:3000). You can also run `node server.js` directly.

There are no npm dependencies to install. The browser loads p5.js and p5.sound from jsDelivr, so an internet connection is needed. Serve the project over HTTP rather than opening `index.html` directly so the browser can load the audio, images, and shaders.

To use a different port on macOS or Linux:

```sh
PORT=3001 npm start
```

## How It Works

p5.sound analyzes the playing track with an FFT. JavaScript maps the energy in different frequency bands to shader uniforms, and a GLSL fragment shader distorts the image using those values. The pieces use different effects, with a shared cloud texture providing displacement data.

| File or folder | Purpose |
| --- | --- |
| `index.html` | Page markup and library loading |
| `style.css` | Fullscreen layout and responsive controls |
| `sketch.js` | Track selection, playback, and the p5 canvas lifecycle |
| `helpers.js` | Player UI and audio-to-shader mappings |
| `shaders/` | Shared vertex shader and each piece's fragment shader |
| `audio/` | MP3 tracks |
| `images/` | Source images and displacement texture |
| `server.js` | Local static file server |

## Checks

```sh
npm test
```

This checks JavaScript syntax. Check playback, distortion, and navigation in a browser when changing audio or rendering behavior.

## Deployment

The site is static and is hosted on GitHub Pages. To publish from `main`, select **Settings > Pages > Deploy from a branch**, then choose **main** and **/(root)**. The Node server is only needed for local development.

