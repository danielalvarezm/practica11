import * as express from 'express';
import './db/mongoose';
import {Ingredient} from './models/ingredients';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Post
app.post('/ingredient', (req, res) => {
  const ingredient = new Ingredient(req.body);

  ingredient.save().then((ingredient) => {
    res.status(201).send(ingredient);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// Get
app.get('/ingredient', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Ingredient.find(filter).then((ingredient) => {
    if (ingredient.length !== 0) {
      res.send(ingredient);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// Patch
/*
app.patch('/notes', (req, res) => {
  if (!req.query.title) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    const allowedUpdates = ['title', 'body', 'color'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Note.findOneAndUpdate({title: req.query.title.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((note) => {
        if (!note) {
          res.status(404).send();
        } else {
          res.send(note);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});*/

app.all('*', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
