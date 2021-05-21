import * as express from 'express';
import {Course} from '../models/coursesModel';
import {Ingredient} from '../models/ingredientsModel';
import '../db/mongoose';

export const getRouter = express.Router();

// Ingredients by name
getRouter.get('/ingredient', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const ingredients = await Ingredient.find(filter);
    if (ingredients.length !== 0) {
      return res.send(ingredients);
    }
    return res.status(404).send();
  } catch (error) {
        return res.status(500).send();
    }
});

// Ingredients by ID
getRouter.get('/ingredient/:id', async(req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).send();
    }
    
    return res.send(ingredient);
  } catch(error) {
    return res.status(500).send();
  }
});

// Courses by name
getRouter.get('/course', async(req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const courses = await Course.find(filter);

    if (courses.length !== 0) {
      return res.send(courses);
    }

    return res.status(404).send();
  } catch (error) {
        return res.status(500).send();
    }
});
