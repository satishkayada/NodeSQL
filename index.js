var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const sql = require('mssql')
/*
var logger = function(req,res,next){
    console.log('Logging...');
    next();
};
app.use(logger);
*/

//View Engine

var accounts = [
    {
        accountid:1,
        accountname:'Profit And Loss',
        balance:1000
    },
    {
        accountid:2,
        accountname:'Balance Sheet',
        balance:134
    },
    
]
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static(path.join(__dirname,'public')));

//set staic path
const DbConnectionString = 'mssql://sa:OPTICAL@127.0.0.1:1433/Account';

sql.on('error', err => {
    console.dir(err);
    sql.close();
});
app.get('/GetAccount',function(req,res){
    var title='Account';
    
    sql.connect(DbConnectionString).then(pool => {
        return pool.request()
            .query('select * from Account_Master;');
    }).then(result => {
        sql.close();
        res.send( 
                    {
                        Responce:"Success",
                        Result:result.recordset 
                    }
                );
    }).catch(err => {
        sql.close();
        res.send( 
            {
                Responce:"failed",
                Result:err 
            }
        );
    });
  });

app.listen(3000, function(){
    console.log('Server Started on port 3000');
})
