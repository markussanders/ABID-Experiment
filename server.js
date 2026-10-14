const { createReadStream } = require('node:fs');
const { stat } = require('node:fs/promises');
const { createServer } = require('node:http');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.frag': 'x-shader/x-fragment',
    '.html': 'text/html; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.mp3': 'audio/mpeg',
    '.png': 'image/png',
    '.vert': 'x-shader/x-vertex'
};

const isInsideRoot = filePath => filePath === ROOT || filePath.startsWith(`${ROOT}${path.sep}`);

const getFilePath = pathname => {
    const requestPath = pathname === '/' ? '/index.html' : pathname;
    return path.normalize(path.join(ROOT, decodeURIComponent(requestPath)));
};

const sendError = (response, statusCode, message) => {
    response.writeHead(statusCode, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    response.end(message);
};

const server = createServer(async (request, response) => {
    try {
        const requestUrl = new URL(request.url, `http://${request.headers.host}`);
        let filePath = getFilePath(requestUrl.pathname);

        if (!isInsideRoot(filePath)) {
            sendError(response, 403, 'Forbidden');
            return;
        }

        const fileStat = await stat(filePath);

        if (fileStat.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        response.writeHead(200, {
            'Cache-Control': 'no-store',
            'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream'
        });
        createReadStream(filePath).pipe(response);
    } catch (error) {
        if (error.code === 'ENOENT') {
            sendError(response, 404, 'Not found');
            return;
        }

        console.error(error);
        sendError(response, 500, 'Internal server error');
    }
});

server.listen(PORT, () => {
    console.log(`ABID Experiment is running at http://localhost:${PORT}`);
});
