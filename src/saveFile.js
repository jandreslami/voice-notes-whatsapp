const fs = require('node:fs');

function saveAudio(binaryAudioData, destinationFolder, fileName) {
  const filePath = `${destinationFolder}/${fileName}.ogg`;

  fs.writeFileSync(filePath, binaryAudioData, 'binary');
}

module.exports = { saveAudio };
