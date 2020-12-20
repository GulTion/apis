const express = require('express');
const libgen = require('libgen');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const fileUpload = require('express-fileupload');
const body_paraser = require('body-parser');
const app = express();

const JsonDB  = require('node-json-db');
const Config = require('node-json-db/dist/lib/JsonDBConfig')

const db = new JsonDB.JsonDB(new Config.Config("myDataBase", true, false, '/'));

app.use(fileUpload());

// DataBase

 
// 
const axios = require('axios')
var request = require("request");
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

function urlDown(md5){
  try{
  const c = libgen.utils.check.canDownload(md5);
  return c
  }
  catch(err){
    console.log(err)
  }
}
app.get('/recentlib',(req,res)=>{
  try{
    res.json(libdb.getData('/recent'))
  }catch(err){
    console.log(err)
  }
})
app.post('/libgen',async (req,res)=>{
  try{
  console.log("Searching for "+req.body.query)
  const books =await libgen.search(req.body)
  libdb.push('/recent[]',{date:new Date().toLocaleString,bookName:req.body.query},true)
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
app.get('/cse',(r,s)=>{
    db.push('/test',{arr:[1,2,3,4]});
console.log(db.getData('/test'));
  s.send('CSE')
})

const token = fs.readFileSync('token.json')
const auth = JSON.parse(token);
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const TOKEN_PATH = 'token.json';

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

const RandomKey = (a,b)=>{
  return Number(Math.floor(a + (b-a)*Math.random())).toString(10);
}

app.post('/bytebin',(req,res)=>{

    console.log(req.files);
    
    let _file = req.files.file;
    _file.mv('./upload/' + _file.name)




fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), uploadfiletodrive);
});


const uploadfiletodrive=(auth)=>{
  const drive = google.drive({version: 'v3', auth});
var fileMetadata = {
  'name': _file.name,
  'mimeType': _file.mimetype,
  'parents':['1kXbR8I8QgS4JxzzQxnJnVvpaRy_IATCq']
};
var media = {
  mimeType: _file.mimetype,
  body: fs.createReadStream("./upload/"+_file.name)
};
drive.files.create({
  resource: fileMetadata,
  media: media,
  fields: 'id'
}, function (err, file) {
  if (err) {
    // Handle error
    console.error(err);
  } else {
    console.log('File Id:', file.data.id);
    const MetaData = {
      name:_file.name,
      size:_file.size,
      mimeType:_file.mimetype,
      gid:file.data.id
    };
    if(req.query.mode==2){
        const {id,key}=req.query;
        const got=db.getIndex('/mainArr',Number(id));
        if(got!=-1){
        const _block = db.getData(`/mainArr[${got}]`);
        if(_block.key==key){
          db.push(`/mainArr[${got}]/files[]`,MetaData,true);
          res.send({files:db.getData(`/mainArr[${got}]`).files,mode:2})
        }else{

        }
        }
    }

    if(req.query.mode=="0"){
    const now = db.getData('/now');
    const key = RandomKey(1111,9999);

    db.push('/mainArr[]',{id:now,key:key, files:[MetaData]},true);
    res.send({id:now, key:key});
    db.push('/now',now+1); 
    }
    fs.unlink("./upload/"+_file.name, (err) => {
    if (err) throw err;
    console.log(_file.name+" is Deleted");
    
});
  }
});
}


})

app.get('/bytebin/:id',(req,res)=>{
  console.log(req.params);
  res.send("Public");
})

app.post('/getbytebinforadmin',(req,res)=>{
  const {key, id} = req.body;
  console.log(req.body);
  const got = db.getIndex('/mainArr',Number(id));
  if(got!=-1){
  const _current = db.getData(`/mainArr[${got}]`);
  if(_current.key==key){
    res.send({files:_current.files,mode:2});
  }else{
    res.send({files:_current.files,mode:1});
  }
  }else{
    res.send({files:[],mode:0})
  }
})

app.get('/driveinit',(req,res)=>{
  // If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}
res.send("DONE");
})


app.listen(process.env.PORT||3001,()=>{                                                            
	console.log('Server is Starting');
})




