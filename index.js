
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
const sql = require('mssql')

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
// app.get('/GetAccount',function(req,res){
//     var title='Account';
//     sql.connect(DbConnectionString).then(pool => {
//         return pool.request()
//             .query('select * from Account_Master;');
//     }).then(result => {
//         sql.close();
//         res.send( 
//                     {
//                         Responce:"Success",
//                         Result:result.recordset 
//                     }
//                 );
//     }).catch(err => {
//         sql.close();
//         res.send( 
//             {
//                 Responce:"failed",
//                 Result:err 
//             }
//         );
//     });
// });

app.get('/api/GetAccounts',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', '*');
    
    var title='Account';
    sql.connect(DbConnectionString).then(pool => {
        return pool.request()
            .query('select id,name,balance from Account_Master;');
    }).then(result => {
        sql.close();
        res.send( 
                    result.recordset 
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
app.get('/api/GetAccount/:id',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', '*');
    var title='Account';
    var tid=req.params.id;
    var sqlquery='select id,name,balance from account_master where id='+tid+';';
    sql.connect(DbConnectionString).then(pool => {
        return pool.request()
            .query(sqlquery);
    }).then(result => {
        sql.close();
        var numRows = result.recordset.length;
        if (numRows == 0)
        {
            res.send(
                        {
                            Responce:"failed no data",
                            Result:"No Data Found"
                        } 
                    );
        }
        else
        {
            res.send( 
                        result.recordset[0]
                    );
        }
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
