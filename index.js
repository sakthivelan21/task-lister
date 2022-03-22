const express = require('express');
const mysql = require('mysql2');

const app = express();
// adding middle ware for url encoding
app.use(express.urlencoded({extended:true}));
// setting view engine as ejs
app.set("view engine","ejs");
// setting up static files folder
app.use(express.static('public'));

const db = mysql.createConnection({
	host:'localhost',
	user:'sakthi',
	password:'Sakthi@123',
	database:'task_scheduler'
});


app.listen('3000',()=>{
	console.log('server listening to port 3000');
});


// db connection
db.connect( (err) =>{
	if(err)
	{
		console.log("Error");
		throw err;
	}
	
	console.log("My Sql Got Connected !!!");

	const sql_table_create = "CREATE TABLE IF NOT EXISTS task_table(id INT AUTO_INCREMENT NOT NULL,task_name VARCHAR(255),time_created VARCHAR(255),PRIMARY KEY(id) ) ";
	db.query( sql_table_create ,(err,result) => {
		if(err)
		{
			throw err;
		}
		console.log('table created if not already exist');
		
	})
	
	
});

// index page route
app.get('/', (req,res)=>{
	
	console.log('index route called !!!');
	
	const sql_select_command = "SELECT * FROM task_table";
	
	db.query(sql_select_command, (err,result) =>{
		if(err)
		{
			throw err;
		}
		// to send a html ejs file as response
		res.render('home',{table:result});
	});
	
});

// update page route
app.get('/update/:id', (req,res)=>{
	
	const id = req.params.id;
	
	console.log('update route called !!!');
	
	const sql_select_command = `SELECT * FROM task_table where id=${id}`;
	
	console.log(sql_select_command);
	
	db.query(sql_select_command, (err,result) =>{
		if(err)
		{
			throw err;
		}
		// to send a html ejs file as response
		res.render('update',{tableDetail:result[0]});
	});
	
	// to send a html ejs file as response
	
});

//addData request 
app.post('/addData',(req,res)=>{
	
	console.log('handling updateData request');
	
	const task_name = req.body.task_name;
	
	const time_created = new Date().toLocaleString();
	
	const sql_insert_command =`insert into task_table(task_name,time_created) values('${task_name}','${time_created}')`;
	
	console.log(sql_insert_command);
	
	db.query(sql_insert_command, (err,result) =>{
		if(err)
		{
			throw err;
		}
		
		res.redirect("/");
	});
	
	
	
});

// updateData request
app.post('/updateData/:id',(req,res)=>{
	
	console.log('handling updateData request');
	
	const id = req.params.id;
	
	const task_name = req.body.task_name;
	
	const time_created = new Date().toLocaleString();
	
	const sql_update_command =`UPDATE task_table SET task_name = '${task_name}', time_created = '${time_created}' where id = ${id}`;
	
	console.log(sql_update_command);
	
	db.query(sql_update_command, (err,result) =>{
		if(err)
		{
			throw err;
		}
		
		res.redirect("/");
	});
	
	
});

// deleteData request
app.get('/deleteData/:id',(req,res)=>{

	const id = req.params.id;
	
	console.log('handling deleteData request');
	
	const sql_delete_command =`DELETE FROM task_table where id = ${id}`;
	
	console.log(sql_delete_command);
	
	db.query(sql_delete_command, (err,result) =>{
		if(err)
		{
			throw err;
		}
		
		res.redirect("/");
	});
	
});

// 404 page redirect to home 
app.use((req,res)=>{
	console.log('404 page redirected to home page');
	res.redirect('/');
});
