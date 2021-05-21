import * as express from 'express';
import {Course} from '../models/coursesModel';
import {Ingredient} from '../models/ingredientsModel';
import '../db/mongoose';

export const patchRouter = express.Router();

// Ingredients by name
patchRouter.patch('/ingredient', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  } 
    const allowedUpdates = ['name', 'location', 'carboHydrates', 'proteins', 'lipids', 'price', 'type'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: 'Update is not permitted',
      });
    } 
    try {
      const ingredient = await Ingredient.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      });

      if (!ingredient) {
        return res.status(404).send();
      } else {
        return res.send(ingredient);
      }

    } catch (error) {
      return res.status(400).send(error);
    }
});


// Ingredients by ID
patchRouter.patch('/ingredient/:id', async (req, res) => {
    const allowedUpdates = ['name', 'location', 'carboHydrates', 'proteins', 'lipids', 'price', 'type'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
        actualUpdates.every((update) => allowedUpdates.includes(update));
  
    if (!isValidUpdate) {
      return res.status(400).send({
        error: 'Update is not permitted',
      });
    } 
    try {
      const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
        if (!ingredient) {
          return res.status(404).send();
        } else {
          return res.send(ingredient);
        }
    } catch(error) {
      return res.status(400).send(error);
    }
});

  // Courses by name
  patchRouter.patch('/course', async (req, res) => {
    if (!req.query.name) {
      return res.status(400).send({
        error: 'A name must be provided',
      });
    } 
      const allowedUpdates = ['name', 'carboHydrates', 'proteins', 'lipids', 'groupFood', 'price', 'ingredients', 'type'];
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate =
        actualUpdates.every((update) => allowedUpdates.includes(update));
  
      if (!isValidUpdate) {
        return res.status(400).send({
          error: 'Update is not permitted',
        });
      } 
      try {
        const course = await Course.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
          new: true,
          runValidators: true,
        });
          if (!course) {
            return res.status(404).send();
          } else {
            return res.send(course);
          }    
      } catch(error) {
        return res.status(400).send(error);
      }
  });
