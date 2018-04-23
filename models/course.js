var mongoose = require('mongoose');

var CourseSchema = mongoose.Schema({
	title: {
		type: String,
		index:true
	},
	instructor: {
		type: String
	},
	semester: {
		type: String
    },
    username: {
        type: String
    }
});

var Course = module.exports = mongoose.model('Course', CourseSchema);
