const { exec } = require('child_process');
const fs = require('fs');

const inputFile = 'cids.txt';

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const cids = data.trim().split('\n');

  cids.forEach(cid => {
    const command = `ipfs pin add ${cid}`;
    console.log(`Pinning CID: ${cid}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error pinning CID ${cid}:`, error);
        return;
      }
      console.log(`CID ${cid} pinned successfully.`);
    });
  });
});
