const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const validator = require('validator');

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/download', (req, res) => {
    const videoUrl = req.body.url;

    if (!validator.isURL(videoUrl)) {
        return res.status(400).send('Invalid URL');
    }

    const command = `yt-dlp -f best -o "%(title)s.%(ext)s" ${videoUrl}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error downloading the video');
        }

        // لا ترجع stderr كخطأ إذا كان التحميل قد تم بنجاح
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        console.log(`stdout: ${stdout}`);
        res.send('Video downloaded successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
