var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')

// DATABASE SETTING
var connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '0000',
	database : 'tm',
	charset  : 'utf8'
})

connection.connect()

router.get('/main', function(req,res) {
	res.render('thing.ejs');

});
// 1. /thing , GET
router.get('/', function(req,res) {
	var responseData = {};

	var query = connection.query('select name from thing', function(err, rows) {
		if(err) throw err;
		if(rows.length) {
			responseData.result = 1;
			responseData.data = rows;
		} else {
			responseData.result = 0;
		}
		res.json(responseData)
	})	
})

// 2. /thing , POST
router.post('/', function(req,res){
	var no = req.body.no;
	var name = req.body.name;
	var maker = req.body.maker;
	var size = req.body.size;
	var date = req.body.date;

	var sql = {no, name, maker, size, date};
	var query = connection.query('insert into thing set ?', sql, function(err,rows) {
		if(err) throw err
		return res.json({'result' : 1});
	})

})


// 3. /thing/:name , GET
router.get('/:name', function(req,res) {
	var name = req.params.name;

	var responseData = {};

	var query = connection.query('select * from thing where name =?', [name], function(err, rows) {
		if(err) throw err;
		if(rows[0]) {
			responseData.result = 1;
			responseData.data = rows;
		} else {
			responseData.result = 0;
		}
		res.json(responseData);
	})	
})


// 4. /thing/:no , DELETE
router.delete('/:no', function(req,res) {
	var no = req.params.no;

	var responseData = {};

	var query = connection.query('delete from thing where no =?', [no], function(err, rows) {
		if(err) throw err;

		if(rows.affectedRows > 0) {
			responseData.result = 1;
			responseData.data = no;
		} else {
			responseData.result = 0;
		}
		return res.json(responseData)
	})	
})

// 5. /thing/:no , update
router.post('/thing/:no/update', function(req, res,next){
    
	var no = req.params.no;//url의 파라미터로 no 값을 얻을 수 있다.
	var name = req.body.name; // 사용자가 다시 입력한 title. req객체의 body객체의 title키로 접근가능
    var maker = req.body.maker;
	var size = req.body.size;
	var date = req.body.date;
	console.log(no);
	var sql = 'UPDATE thing SET name=?, maker=?, size=?, date=? WHERE no=?';//수정하는 쿼리문(where가 매우 중요! 없으면, 다 똑같이 수정됨 큰일남.)
	//var responseData = {name, maker, size, date};

	var query = connection.query(sql, [name, maker, size, date, no], function(err, result, fields){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		  } else {
			res.redirect('/update/'+id);
		  }
    });
});


//UPDATE [테이블] SET [열] = '변경할값' WHERE [조건]

module.exports = router;