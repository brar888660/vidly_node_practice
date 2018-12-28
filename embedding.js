const express = require('express');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground', {'useNewUrlParser' : true})
.then(() => {console.log('connecting....')})
.catch(() => console.log('connecting failed...'));




const authorSchema = new mongoose.Schema({
    'name' : String,
    'bio' : String,
    'website' : String
});

const Author = new mongoose.model('Author', authorSchema);

const courseSchema = new mongoose.Schema({
    name : String,
    authors : [authorSchema]
});

const Course = new mongoose.model('Course', courseSchema);


async function createAuthor(name , bio , website){

    let author =  new Author({
        name,
        bio,
        website
    });

    console.log(await author.save());

}

async function createCourse(name, authors)
{
    let course = new Course({
        name,
        authors
    });
    console.log(await course.save());
}

async function updateAuthor(courseId, authorId) {
    const course = await Course.findOne({"_id" : courseId});
    const author = course.authors.id(authorId);
    author.name = 'hahalolly';
    await  course.save();

}
updateAuthor('5c2635000f23b471910bac41', '5c2635000f23b471910bac3f');


async function addAuthor(courseId, author)
{
    const course = await Course.findOne({"_id" : courseId});
    course.authors.push(author);
    console.log(await course.save());
}
//addAuthor('5c2635000f23b471910bac41', new Author({"name" : "akko"}));


// (async function(courseId){

//     const course = Course.findOne({_id : courseId});
//     const result = await course.updateOne({
//         $set : {
//             'author.name' : 'hello'
//         }
//     });
//     console.log(result);
// })('5c262fca95aa8b710bae6160');

// (async function(){
//     console.log(await Course.find().populate('author', 'name -_id'));
// })();
//createAuthor('willy', 'cheng', 'http://yahoo.com.tw');
// createCourse("monkey", [
//     new Course({name : 'teacher1 lin'}),
//     new Course({name : 'teacher2 wu'}),
//     new Course({name : 'teacher3 lun'})
//     ]);

