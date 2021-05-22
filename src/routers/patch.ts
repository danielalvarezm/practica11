import * as express from 'express';
import {Course} from '../models/coursesModel';
import {calculateMacronutrients, predominantGroup, totalPrice} from '../courses';
import {Ingredient, IngredientInterface} from '../models/ingredientsModel';
import '../db/mongoose';

export const patchRouter = express.Router();

// Ingredients by name
patchRouter.patch('/ingredients', async (req, res) => {
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
patchRouter.patch('/ingredients/:id', async (req, res) => {
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
  patchRouter.patch('/courses', async (req, res) => {
    console.log('hola');
    if (!req.query.name) {
      console.log('hola1');
      return res.status(400).send({
        error: 'A name must be provided',
      });
    } else {
      console.log('hola2');
      const allowedUpdates = ['name', 'ingredients', 'quantity', 'type'];
      const actualUpdates = Object.keys(req.body);
      console.log(actualUpdates);
      const isValidUpdate =
        actualUpdates.every((update) => allowedUpdates.includes(update));
  
      if (!isValidUpdate) {
        return res.status(400).send({
          error: 'Update is not permitted',
        });
      } else {
        const courseObject = req.body;
        if ((courseObject.ingredients && !courseObject.quantity) ||
        (!courseObject.ingredients && courseObject.quantity)) {
          return res.status(500).send({
            error: 'PARAMETROS', // //// CAMBIAR ERRRRRRRRRROR
          });
        }
        if (courseObject.ingredients) {
          if (courseObject.ingredients.length != courseObject.quantity.length) {
            return res.status(500).send({
              error: 'PARAMETROS', // //// CAMBIAR ERRRRRRRRRROR
            });
          }
          const arrayIngredients: IngredientInterface[] = [];
          for (let i: number = 0; i < courseObject.ingredients.length; i++) {
            const filter = {name: courseObject.ingredients[i]};
            const ingredientCorrect = await Ingredient.findOne(filter);
            if (ingredientCorrect != null) {
              arrayIngredients.push(ingredientCorrect);
            } else {
              return res.status(500).send({
                error: 'An ingredient is not found in the database',
              });
            }
          }
          const macronutrients = calculateMacronutrients(arrayIngredients, courseObject.quantity);
          const newData = {
            carboHydrates: macronutrients[0],
            proteins: macronutrients[1],
            lipids: macronutrients[2],
            groupFood: predominantGroup(arrayIngredients),
            price: totalPrice(arrayIngredients, courseObject.quantity),
            ingredients: arrayIngredients,
          };
          Object.assign(courseObject, newData);
        }

        try {
          const course = await Course.findOneAndUpdate({name: req.query.name.toString()}, courseObject, {
            new: true,
            runValidators: true,
          });

          if (course === null) {
            return res.status(404).send({
              error: 'Update is not permitted',
            });
          } else {
            return res.send(course);
          }
        }  catch (error)  {
          return res.status(400).send(error);
        }
      }
    }
  });
