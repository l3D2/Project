const express = require('express');
const app = express();

const port = process.env.PORT || 1000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/', (req, res) => {
    res.send('API is available')
})

app.get('/api/data/:id', (req, res) => {
    let id = req.params.id
})

app.listen(port, () => {
    console.log('Server listening on port ' + port)
})