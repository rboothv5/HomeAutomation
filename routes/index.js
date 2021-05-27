var express = require('express');
var router = express.Router();

router.get('/getIPAddress', function(req, res, next) {

  var query=req.query
   query["Location"] = (query.Location);
   var db = req.db;
   var collection = db.get('IPAddresses');
   collection.findOne(query,function(e,result){
     output=result
     res.send(output)  
   });
 });

router.get('/getAPIKey', function(req, res, next) {
	var db = req.db;
  var collection = db.get('APIKey');
  collection.find({},function(e,data){
  	APIKeys=data
  	res.send(APIKeys)  
	});
});

router.get('/getAllDeviceIDs', function(req, res, next) {
  var db = req.db;
  var collection = db.get('ControllerAddresses');
  collection.find({},function(e,data){
	  deviceIDs=data
    res.send(deviceIDs)  
  });
});

router.get('/getDeviceID', function(req, res, next) {
  let db = req.db;
  let collection = db.get('ControllerAddresses');
	query=req.query
  query["Location"] = (query.Location);
  collection.findOne(query,function(e,data){
 		deviceID=data
  	res.send(deviceID)  
  });
});

router.get('/', function(req, res, next) {
	res.render('index')
});

module.exports = router;
