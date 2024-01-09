const fs = require('fs')

//reading file 
fs.readFile('./nodejsBasic.js', (err, data) => {
    if(err) {
        console.log(err)
    }
    console.log(data.toString())
})

// wrting file 
fs.writeFile('./test.txt', 'hello, node ', () => {
    console.log('file was written')
})

// create a new file and write data in it 
fs.writeFile('./test2.txt', 'this is second text', () => {
    console.log('test2 is written')
})

//Directories
if (!fs.existsSync('./assets')) {
    fs.mkdir('./assets', (err) => {
        if(err) {
         console.log(err)
        }
        console.log('folder created ')
     })
} else {
   fs.rmdir('./assets', (err) => {
    if(err) {
        console.log(err)
    }
    console.log('folder deleted')
   })
}

// deleting files 
if (fs.existsSync('./testDelete.txt')) {
    fs.unlink('./testDelete.txt', (err) => {
        if(err) {
            console.log(err)
        }
        console.log('file deleted')
    })
} else {
    console.log('file not exist')
}
