var express = require('express');
var router = express.Router();
var monk=require('monk');
var moment=require('moment');
var mailer=require('nodemailer');
var multer=require('multer');
/*var upload = multer({ dest: 'uploads/' })
*/var randomstring=require('randomstring');
var db=monk('localhost:27017/aditya');
console.log('connected');
var Collection=db.get('Signup');
var Form=db.get('form');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })
/* GET home page. */

router.get('/',function(req,res,next){
	
res.render('index',{title:'Express'});

});

router.get('/signin',function(req,res,next){
	res.render('signin',{title:'Express'});
});

router.get('/forgot',function(req,res,next){
res.render('forgot',{title:'Express'});
});

router.get('/home',function(req,res)
{

	Form.find({}, function(err,docs){
		/*console.log(docs);*/
		res.locals.data = docs;
		res.render('home');
	});
});

/*jquery*/
router.post('/remove',function(req,res)
{
	var id=req.body.no;
Form.remove({"_id":id},function(err,docs)
	{
		res.send(docs);
	});
	
});

router.post("/edit",function(req,res)
{
	var id=req.body.no;
	Form.find({"_id":id},function(err,docs)
	{	

		res.send(docs);
	});
});

router.post('/Signup',function(req,res)
{
	var name=req.body.name;
	var Username=req.body.email;
	var Phone=req.body.phone;
	var pass=req.body.password;
	var cnfrm=req.body.passwordConf;
	var Gender=req.body.gender;
	var Language=req.body.Lang;
	
	console.log(name);
	console.log(Username);
	console.log(Phone);
	console.log(pass);
	console.log(cnfrm);
	console.log(Gender);
	console.log(Language);

	var data={ 

		Fname:req.body.name,
		username:req.body.email,
		Phnumber:req.body.phone,
		Password:req.body.password,
		
		Confirmpass:req.body.passwordConf,
		Gender:req.body.gender,
		Language:req.body.Lang,
	}

	var transporter = mailer.createTransport({
  service: 'gmail.com',
  auth: {
    user: 'siriv1997@gmail.com',
    pass: 'Madadluv2@',
  }
});

var mailOptions = {
  from: 'siriv1997@gmail.com',
  to: req.body.email,
  subject: 'Sending Email using Node.js',
  text: 'successfully registered'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
	Collection.insert(data,function(err,data)
	{
		if(err)
		{
			console.log("not sent");
		}
		else
		{
			console.log("send");
		}
	});
	
/*
	Collection.insert({"Fname":name,"username":Username,"Phnumber":req.body.phone,"Password":pass,"Confirmpass":cnfrm,"College":college,"Gender":Gender,"Language":Language});*/
	res.redirect("/");
	Collection.insert(data);
});	
router.post('/signin',function(req,res)
{
	
	var Username=req.body.login_username;
	var pass=req.body.login_password;
	console.log(Username);
	console.log(pass);
	var logintime=moment().format("hh:mm:ss a");
	console.log(logintime);
	Collection.update({"username":Username},{$set:{"logintime":logintime}});
	
	Collection.findOne({"username":req.body.login_username,"Password":pass},function(err,docs)
	{
		if(!docs)
		{
			console.log("mismatch");
			res.render('signin',{err:"Invalid username or Password"});

		}
		else if(docs)
		{
			/*console.log("success");*/
			/*delete docs.Password;
			req.session.user=docs;*/
			res.redirect('/home');
		}
		else
		{
			console.log(err);
		}
	});

});	

	router.post('/form',upload.single('image'),function(req,res)
	{
		var Firstname=req.body.firstName;
		var Lastname=req.body.lastName;
		var Email=req.body.email;
		var tele=req.body.telephone;
		var img=req.file.originalname;

		console.log(Firstname);
		console.log(Lastname);
		console.log(req.file);
		console.log(Email);
		console.log(tele);

		Form.insert({"FirstName":Firstname,"LastName":Lastname,"Email":req.body.email,"Mobile":tele,"image":img});
		res.redirect("/home");
	});
	router.post('/update',upload.single('image'),function(req,res)
{
	/*console.log(req.body.firstName);
	console.log(req.body.lastName);
	console.log(req.body.email);
	console.log(req.body.telephone);*/
	var data={
		FirstName:req.body.firstName,
		LastName:req.body.lastName,
		Email:req.body.email,
		Mobile:req.body.telephone,
		image:req.file.originalname,
	}
	Form.update({"_id":req.body.id},{$set:data},function(err,docs)
	{
		res.redirect("/home");
	});
})
router.post('/forgot',function(req,res)
{
	var email=req.body.name;
	console.log(email);
	var otp=randomstring.generate(5);
	var msg="<html><head></head><body><b>"+otp+"</b></body></html>";
	Collection.update({"username":email},{$set:{"Password":otp}});
	var transporter = mailer.createTransport({
  service: 'gmail.com',
  auth: {
    user: 'siriv1997@gmail.com',
    pass: 'Madadluv2@',
  }
});

var mailOptions = {
  from: 'siriv1997@gmail.com',
  to: req.body.name,
  subject: 'Sending Email using Node.js',
  html:msg,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
	res.redirect('/');
});


module.exports=router;