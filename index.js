const express = require('express')
const app = express()

app.get('/:type', (req, res) => {
  let options = {
    root: __dirname,
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  let filename;
  if (req.params.type === 'js') {
    fileName = 'notifyQueue.js';
  } else if (req.params.type === 'css') {
    fileName = 'notifyQueue.css';
  } else {
    return res.send('File does not exist')
  }


  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    }
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))