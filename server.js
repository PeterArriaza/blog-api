const express = require('express');
const morgan = require('morgan');

const app = express();

const BlogPostsRouter = require('./BlogPostsListRouter');

let server;

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

// when requests come into `/shopping-list` or
// `/recipes`, we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
app.use('/blog-posts', BlogPostsRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on("error", err => {
                reject(err);
            });
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);
                // so we don't also call `resolve()`
                return;
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = {
    app,
    runServer,
    closeServer
};
