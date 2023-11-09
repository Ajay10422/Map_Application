// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// import required packages
const express = require('express');
// const cors = require('cors');

const https = require('https');

const fs = require('fs');

// create new express app and save it as "app"
const app = express();
// app.use(cors());

app.use(express.static('../mapmap/build'));

const path = require('path');
app.get('/mapmap', (req, res) => {
res.sendFile(path.resolve('../mapmap/build', 'index.html'));
});

// create a route for the app
app.get('/', (req, res) => {
  res.send('Hello!');
});


const httpsServer = https.createServer({
  key: fs.readFileSync("./cert.key"),
  cert: fs.readFileSync('./cert.crt'),
}, app);

httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 3000');
});