var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Course = require('../models/course');

router.get('/', ensureAuthenticated, function(req, res){
	Course.find({username : req.user.username}, function(err, courseList) {
		if (err) res.redirect(303, '/500/database access at home');
		res.render('index', {courses: courseList}); });
});

router.get('/addcourse', ensureAuthenticated, function(req, res) { res.render('addcourse'); });
router.post('/addcourse', ensureAuthenticated, function(req, res) { 
  var newCourse = new Course(); 
  newCourse.title = req.body.title; 
  newCourse.instructor = req.body.instructor; 
  newCourse.semester = req.body.semester; 
  newCourse.username = req.user.username;
  newCourse.save().then(res.redirect(303, '/')); 
});

router.get('/update', ensureAuthenticated, function(req, res){
	Course.findByIdAndUpdate(req.query.id, 
        {$set:{title:req.query.title,
               instructor:req.query.instructor,
               semester:req.query.semester}
        }, function(err) {
          if (err) res.redirect(303, '/500/database fail to update');
        });
        res.redirect(303, '/');
});

router.get('/edit', ensureAuthenticated, function(req, res){
	Course.findOne({_id: req.query.id}, function(err, foundCourse) {
	  if (err) res.redirect(303,'/500/database access looking up user'); 
	  res.render('edit', {course: foundCourse});
	}); 
  });

  router.get('/delete', ensureAuthenticated, function(req, res){
    found = Course.findByIdAndRemove(req.query.id, function(err) {
    if (err) res.redirect(303, '/500/database access deleting course'); 
    res.redirect(303, '/');
  });
});

router.get('/course', ensureAuthenticated, function(req, res){
	Course.findOne({_id: req.query.id}, function(err, foundCourse) {
        if (err) res.redirect(303,'/500/database access looking up user'); 
        res.render('course', {course: foundCourse});
    });
});



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;