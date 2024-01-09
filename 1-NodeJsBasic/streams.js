const fs = require('fs')

const readStream = fs.createReadStream('./files.js', {encoding: 'utf-8'})
const writeStream = fs.createWriteStream('./test3.txt')
//.on is event listener
readStream.on('data', (chunk) => {
    console.log('--------New Chunk---------')
    writeStream.write('\n Chunk \n')
    writeStream.write(chunk)

})