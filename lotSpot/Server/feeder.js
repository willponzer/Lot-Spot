const fs = require('fs');
const path = require('path');
const SftpClient = require('ssh2-sftp-client');

// Configuration
const config = {
  host: '148.100.143.224',
  username: 'lotspot',
  password: 'lotspot',
  port: 22
};

// Use absolute path for output directory
const OUTPUT_DIR = path.join(__dirname, 'video_recordings');
const REMOTE_VIDEO_DIR = '/home/lotspot/Videos';  // Fixed case to match Pi's directory
const CHECK_INTERVAL = 5000; // 5 seconds

let lastDownloadedFile = '';

async function getLatestRemoteVideo(sftp) {
  try {
    console.log(`Checking directory: ${REMOTE_VIDEO_DIR}`);
    const files = await sftp.list(REMOTE_VIDEO_DIR);
    
    console.log('All files in directory:');
    files.forEach(file => {
      console.log(`- ${file.name} (Modified: ${new Date(file.modifyTime * 1000).toISOString()})`);
    });
    
    const videoFiles = files
      .filter(file => file.type === '-' && file.name.startsWith('video_') && file.name.endsWith('.mp4'))
      .sort((a, b) => b.modifyTime - a.modifyTime);

    console.log('\nFiltered video files:');
    videoFiles.forEach(file => {
      console.log(`- ${file.name} (Modified: ${new Date(file.modifyTime * 1000).toISOString()})`);
    });

    if (videoFiles.length === 0) {
      console.log('No matching video files found');
      return null;
    }

    console.log(`\nSelected newest file: ${videoFiles[0].name}`);
    return videoFiles[0].name;
  } catch (error) {
    console.error('Error listing remote files:', error.message);
    return null;
  }
}

async function downloadVideo() {
  const sftp = new SftpClient();
  
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`Created directory: ${OUTPUT_DIR}`);
    }

    console.log('Connecting to SFTP server...');
    await sftp.connect(config);
    console.log('Successfully connected to SFTP server');

    while (true) {
      try {
        const latestVideo = await getLatestRemoteVideo(sftp);
        
        if (!latestVideo) {
          console.log('Waiting for new videos...');
          await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
          continue;
        }

        if (latestVideo === lastDownloadedFile) {
          console.log(`Already downloaded ${latestVideo}, waiting for new videos...`);
          await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
          continue;
        }

        // Use forward slashes for remote path
        const remoteVideoPath = `${REMOTE_VIDEO_DIR}/${latestVideo}`;
        const localVideoPath = path.join(OUTPUT_DIR, latestVideo);

        console.log('\nDownloading:');
        console.log('From:', remoteVideoPath);
        console.log('To:', localVideoPath);

        // Check if remote file exists before downloading
        const exists = await sftp.exists(remoteVideoPath);
        if (!exists) {
          console.log(`File no longer exists: ${remoteVideoPath}`);
          continue;
        }

        await sftp.get(remoteVideoPath, localVideoPath);
        console.log(`Successfully downloaded: ${latestVideo}`);
        lastDownloadedFile = latestVideo;

      } catch (loopError) {
        console.error('Error in download loop:', loopError.message);
        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
      }

      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }

  } catch (error) {
    console.error('Fatal error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    throw error;
  } finally {
    try {
      await sftp.end();
      console.log('SFTP connection closed');
    } catch (err) {
      console.error('Error closing SFTP connection:', err.message);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  process.exit(0);
});

console.log('Starting continuous video download process...');
console.log(`Checking for new videos every ${CHECK_INTERVAL/1000} seconds...`);

downloadVideo()
  .catch(error => {
    console.error('Download process failed:', error.message);
    process.exit(1);
  });