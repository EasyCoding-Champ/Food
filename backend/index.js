const connectToMongo=require('./db');
const express = require('express');
var cors = require('cors')


connectToMongo();
const app = express()
const port = 5000
//body me request bhjene ke liy 
app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.use('/api/auth',require('./routes/auth'))
app.use('/api/food',require('./routes/food'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})