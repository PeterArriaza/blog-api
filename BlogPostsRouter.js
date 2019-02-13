const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {
    BlogPosts
} = require('./models');

// we're going to add some Blog Posts to BlogPosts
// so there's some data to look at
BlogPosts.create(
    'My first blog post!', 'Hello world from my first blog post!', 'Pete Arriaza', '14 Feb 2019');
BlogPosts.create(
    'My second blog post!!', 'You know for the sake of clarity, we need to have a second blog post', 'Pete Arriaza');

// send back JSON representation of all blog posts
// on GET requests to root
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});


// when new blog post added, ensure has required fields. if not,
// log error and return 400 status code with hepful message.
// if okay, add new item, and return it with a status 201.
router.post('/', jsonParser, (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (!('publishDate' in req.body)) {
        const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    } else {
        const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    }
    res.status(201).json(item);
});

// Delete blog posts (by id)!
router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted shopping list item \`${req.params.ID}\``);
    res.status(204).end();
});

// when PUT request comes in with updated blog post, ensure has
// required fields. also ensure that blog post id in url path, and
// blog post id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.updateItem` with updated blog post.
router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post item \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: req.body.date;
    });
    res.status(204).end();
})

module.exports = router;
