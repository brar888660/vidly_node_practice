const express = require('express');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground', {'useNewUrlParser' : true})
.then(() => {console.log('connecting....')})
.catch(() => console.log('connecting failed...'));


const courseSchema = new mongoose.Schema({
    name : String,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Author'
    }
});

const Course = new mongoose.model('Course', courseSchema);

const authorSchema = new mongoose.Schema({
    'name' : String,
    'bio' : String,
    'website' : String
});

const Author = new mongoose.model('Author', authorSchema);


async function createAuthor(name , bio , website){

    let author =  new Author({
        name,
        bio,
        website
    });

    console.log(await author.save());

}

async function createCourse(name, author)
{
    let course = new Course({
        name,
        author
    });
    console.log(await course.save());
}


(async function(){
    console.log(await Course.find().populate('author', 'name -_id'));
})();
//createAuthor('willy', 'cheng', 'http://yahoo.com.tw');
//createCourse("monkey", "5c260c4d6285736fedb82db3");

