import * as express from 'express';
import {loadDataCourse} from '../courses';
import {Course} from '../models/coursesModel';
import {Ingredient, IngredientInterface} from '../models/ingredientsModel';
import '../db/mongoose';

export const postRouter = express.Router();

// Ingredients
postRouter.post('/ingredients', async(req, res) => {
    const ingredient = new Ingredient(req.body);
  
    try  {
        await ingredient.save();
        res.status(201).send(ingredient);
      } catch (error) {
        res.status(400).send(error);
    }
  });

  // Courses
  postRouter.post('/courses', async (req, res) => {
    const courseObject = req.body;
    if (!courseObject.name || !courseObject.ingredients || !courseObject.quantity || !courseObject.type ||
      courseObject.ingredients.length != courseObject.quantity.length) {
      res.status(500).send({
        error: 'One of the properties required to create a plate has not been defined', // /////////MIRAR ERRORES
      });
      return;
    }
    const arrayIngredients: IngredientInterface[] = [];
    for (let i: number = 0; i < courseObject.ingredients.length; i++) {
      const filter = {name: courseObject.ingredients[i]};
      const ingredientCorrect = await Ingredient.findOne(filter);
      if (ingredientCorrect != null) {
        arrayIngredients.push(ingredientCorrect);
      } else {
        res.status(500).send({
          error: 'An ingredient is not found in the database',
        });
        return;
      }
    }
  
    const courseCorrectly = {
      name: courseObject.name,
      ingredients: arrayIngredients,
      quantity: courseObject.quantity,
      type: courseObject.type,
    };
  
    try {
      const course = new Course(loadDataCourse(courseCorrectly));
      await course.save();
      res.status(201).send(course);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  