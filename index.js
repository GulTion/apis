const express = require('express');
const libgen = require('libgen')
const app = express();

const axios = require('axios')
var request = require("request");
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

app.get('/', (req,res)=>{
	res.send(`<h1>Welcome to GulTion API</h1>`)
})
function urlDown(md5){
  try{
  const c = libgen.utils.check.canDownload(md5);
  return c
  }
  catch(err){
    console.log(err)
  }
}
app.post('/libgen',async (req,res)=>{
  try{
  console.log("Searching for "+req.body.query)
  const books =await libgen.search(req.body)

  console.log('Complete')
  const arr = []
  console.log(books)
  for(let e of books){
    arr.push({
    title:e.title,
    author:e.author,
    year:e.year,
    edition:e.edition,
    publisher:e.publisher,
    pages:e.pages,
    language:e.language,
    md5:e.md5,
    cover:`http://libgen.lc/covers/${e.coverurl}`,
    descr:e.descr,
    filesize:e.filesize,
    extension:e.extension

    })
  }




console.log(arr)
console.log(books)
  res.json(arr)
  }
  catch(err){
    console.log(err)
  }

})
app.get('/book/:md5',(res,req)=>{
  axios.get(`http://library.lol/main/${res.params.md5.toUpperCase()}`)
  .then(re=>{

      const patt = new RegExp(`http://93.174.95.29/main.*\"`);
      var ret = patt.exec(re.data);

    req.send(ret[0])
    }
  )
  .catch(err=>req.send(err))

})
app.get('/csalgo',(req,res)=>{
console.log(`calling for ${req.query.url}`)
var options = {
  method: 'POST',
  url: req.query.url,
  headers: {
    'content-type': 'application/json',
    authorization: 'Basic SGFySGFyTWFoYWRldjpIYXJIYXJNYWhhZGV2'
  },
  body: {q: '', password: null, page_token: null, page_index: 0},
  json: true,
  jar: 'JAR'
};


request(options, function (error, response, body) {

  if (error) throw new Error(error);
  res.json(body)
});

})
app.listen(process.env.PORT||3001,()=>{                                                            
	console.log('Server is Starting');
})