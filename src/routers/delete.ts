import * as express from 'express';
import {Course} from '../models/coursesModel';
import {Ingredient} from '../models/ingredientsModel';
import '../db/mongoose';

export const deleteRouter = express.Router();

// Ingredients by name
deleteRouter.delete('/ingredient', async (req, res) => {
  if(!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }

  try {
    const ingredient = await Ingredient.findOneAndDelete({name: req.query.name.toString()});

    if(!ingredient) {
      return res.status(404).send();
    }

    return res.send(ingredient);
  } catch (error) {
    return res.status(400).send();
  }
});

// Ingredients by ID
deleteRouter.delete('/ingredient/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) {
      return res.status(404).send();
    } 
    return res.send(ingredient);
      
  } catch (error) {
    return res.status(400).send();
  }
});

// Courses by name
deleteRouter.delete('/course', async(req, res) => {
  if(!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }

  try {
    const course = await Course.findOneAndDelete({name: req.query.name.toString()});

    if(!course) {
      return res.status(404).send();
    }

    return res.send(course);
  } catch (error) {
    return res.status(400).send();
  }
});
