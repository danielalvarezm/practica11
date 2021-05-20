import * as express from 'express';
import {loadDataCourse} from './courses';
import './db/mongoose';
import {Course} from './models/coursesModel';
import {Ingredient} from './models/ingredientsModel';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ///////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////// INGREDIENTS ///////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////

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

// Get id

app.get('/ingredient/:id', (req, res) => {
  Ingredient.findById(req.params.id).then((ingredient) => {
    if (!ingredient) {
      res.status(404).send();
    } else {
      res.send(ingredient);
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// Patch

app.patch('/ingredient', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['name', 'location', 'carboHydrates', 'proteins', 'lipids', 'price', 'type'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Ingredient.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((ingredient) => {
        if (!ingredient) {
          res.status(404).send();
        } else {
          res.send(ingredient);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

// Patch id

app.patch('/ingredient/:id', (req, res) => {
  const allowedUpdates = ['name', 'location', 'carboHydrates', 'proteins', 'lipids', 'price', 'type'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'Update is not permitted',
    });
  } else {
    Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).then((ingredient) => {
      if (!ingredient) {
        res.status(404).send();
      } else {
        res.send(ingredient);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});

// Delete

app.delete('/ingredient', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    Ingredient.findOneAndDelete({name: req.query.name.toString()}).then((ingredient) => {
      if (!ingredient) {
        res.status(404).send();
      } else {
        res.send(ingredient);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});

// Delete id

app.delete('/ingredient/:id', (req, res) => {
  Ingredient.findByIdAndDelete(req.params.id).then((ingredient) => {
    if (!ingredient) {
      res.status(404).send();
    } else {
      res.send(ingredient);
    }
  }).catch(() => {
    res.status(400).send();
  });
});

// ///////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////// COURSES ///////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////

// Post

app.post('/course', (req, res) => {
  const courseData = loadDataCourse(req.body);
  const course = new Course(courseData);
  console.log(course);
  course.save().then((course) => {
    res.status(201).send(course);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// Get

app.get('/course', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Course.find(filter).then((course) => {
    if (course.length !== 0) {
      res.send(course);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

// Patch

app.patch('/course', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['name', 'carboHydrates', 'proteins', 'lipids', 'groupFood', 'price', 'type', 'ingredients'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Course.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((course) => {
        if (!course) {
          res.status(404).send();
        } else {
          res.send(course);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

// Delete

app.delete('/course', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    Course.findOneAndDelete({name: req.query.name.toString()}).then((course) => {
      if (!course) {
        res.status(404).send();
      } else {
        res.send(course);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});

app.all('*', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
