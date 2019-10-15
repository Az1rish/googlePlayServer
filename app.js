const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('dev'));

const playstore = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { sort, genre = "" } = req.query;

    if(sort) {
        if(!['rating', 'app'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be either rating or app');
        }
    }

    if(genre) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)) {
            return res
                .status(400)
                .send('Available genres are: Action, Puzzle, Strategy, Casual, Arcade or Card');
        }
    }

    let results = playstore
            .filter(app =>
                app
                    .Genres
                    .toLowerCase()
                    .includes(genre.toLowerCase()));

    if (sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }

    res.json(results);
});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});