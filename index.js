require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./router/router');
const bodyparser = require('body-parser');

// app.get('/api',(req,res,next) =>{
//     res.json(
//         {
//             status: "ok",
//             author: "tanlg95"
//         }
//     );
// });
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use('/api',router);

const port = process.env.SERVER_PORT || 3333;
app.listen(port,() => console.log(`sever is running at port ${port}`));