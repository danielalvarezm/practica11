import * as express from 'express';
import {Course} from '../models/coursesModel';
import {Ingredient} from '../models/ingredientsModel';
import '../db/mongoose';
import {Menu} from '../models/menusModel';

export const deleteRouter = express.Router();

// Ingredients by name
deleteRouter.delete('/ingredients', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }

  try {
    const ingredient = await Ingredient.findOneAndDelete({name: req.query.name.toString()});

    if (!ingredient) {
      return res.status(404).send({
        error: 'The ingredient has not been found',
      });
    }

    return res.send(ingredient);
  } catch (error) {
    return res.status(400).send();
  }
});

// Ingredients by ID
deleteRouter.delete('/ingredients/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) {
      return res.status(404).send();
    }
    return res.send(ingredient);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Courses by name
deleteRouter.delete('/courses', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }

  try {
    const course = await Course.findOneAndDelete({name: req.query.name.toString()});
    if (!course) {
      return res.status(404).send({
        error: 'The course has not been found',
      });
    }
    return res.send(course);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Menus by name
deleteRouter.delete('/menus', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  }
  try {
    const menu = await Menu.findOneAndDelete({name: req.query.name.toString()});
    if (!menu) {
      return res.status(404).send({
        error: 'Delete is not permitted',
      });
    }
    return res.send(menu);
  } catch (error) {
    return res.status(400).send(error);
  }
});
