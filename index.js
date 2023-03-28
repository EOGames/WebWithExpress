const express = require ('express');
const bodyParser = require('body-parser');
const { LocalStorage } = require('node-localstorage');

const app  = express();
const localstorage = new LocalStorage('/save');

let data = [];
let count = 0;

app.use(express.json())
app.set('view engine','ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>
{
    res.render('pages/index');
});

app.post('/save',(req,res)=>
{
  //  console.log(req.body);
  HandleStorage(req.body);
    res.render('pages/index');
});

app.get('/add',(req,res)=>
{
    res.render('pages/add');
});

app.get('/data',(req,res)=>
{
    data = [];
    if (localstorage.getItem('data') !==null)
    {
        // means data their
        data = JSON.parse(localstorage.getItem('data'));
        if (data.length >0)
        {
            res.send(data);
        }
    }
    else
    {
        res.send('');        
    }
});

app.get('/edit',(req,res)=>
{
    res.render('pages/edit')
});

app.put('/edit/:id',(req,res)=>
{
    console.log(req.params.id);
    console.log(req.body);

    data = JSON.parse(localstorage.getItem('data'));
    if (data.length >0)
    {
        data[req.params.id] = req.body;

        localstorage.setItem('data',JSON.stringify(data));
    }
    res.send('updated');
});

app.delete('/delselected/:id',(req,res)=>
{
    console.log(req.params.id);
    if (localstorage.getItem('data')!== null)
    {
        let data = [];
        data = JSON.parse(localstorage.getItem('data'));
        
        data.splice(req.params.id,1);

        localstorage.setItem('data',JSON.stringify(data));
        console.log('deleted');
    }
    res.send('deleted Selected');
});

app.delete('/deleteall',(req,res)=>
{
    if (localstorage.getItem('data')!==null)
    {
        localstorage.removeItem('data');
    }
    res.send('done');
});

app.listen(5700,()=>
{
    console.log("Server Is Up And Running On 5700 Port");
});

function HandleStorage(d)
{
    data = [];
    count = 0;
    
    if (localstorage.getItem('data')!==null)
    {
        //means data exist
        data = JSON.parse(localstorage.getItem('data'));
       // console.log("Data Found");

        if (data.length <=0)
        {
            count = 0;
        }else
        {
            count = data.length-1;
            count++;
        }
    }else
    {
        count = 0;
    }
    
    console.log('count is '+count);
    data[count] = d;
    localstorage.setItem('data',JSON.stringify(data));
    //console.log(data);
}