const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/download', (req, res) => {
    const videoUrl = req.body.url; // تأكد من إضافة body-parser إذا لم يكن موجودًا

    const command = `yt-dlp -f best -o "%(title)s.%(ext)s" ${videoUrl}`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error downloading the video');
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send('Error downloading the video');
        }
        console.log(`stdout: ${stdout}`);
        res.send('Video downloaded successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
