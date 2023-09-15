const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const port = 3000
const uploadedFiles = [];

// This is to make the storage be on the local machine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ dest: 'public/uploads/' }, { storage: storage })

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.render('form', { uploadedFiles })
})

app.post('/FormInput', upload.single('Photo'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  const fileName = req.file.filename;

  // Save the filename or file path in your storage or database
  uploadedFiles.push(fileName);
  res.redirect('/')
})




app.listen(port, () => {
  console.log(`App listening on: http://localhost:${port}`)
})