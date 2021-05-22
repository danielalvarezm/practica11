import * as express from 'express';
import {Course, CourseInterface} from '../models/coursesModel';
import {Ingredient, IngredientInterface} from '../models/ingredientsModel';
import {loadDataCourse} from '../utilities/courses';
import {nutritionalComposition, getFoodList, calculatePrice} from '../utilities/menus';
import {Menu} from '../models/menusModel';
import '../db/mongoose';

export const postRouter = express.Router();

// Ingredients
postRouter.post('/ingredients', async (req, res) => {
  const ingredient = new Ingredient(req.body);
  try {
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
    return res.status(500).send({
      error: 'All courses\' properties must be included. Also the number of ingredients and quantity must be the same',
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

  const courseCorrectly = {
    name: courseObject.name,
    ingredients: arrayIngredients,
    quantity: courseObject.quantity,
    type: courseObject.type,
  };

  try {
    const course = new Course(loadDataCourse(courseCorrectly));
    await course.save();
    return res.status(201).send(course);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Menus by name
postRouter.post('/menus', async (req, res) => {
  const menuObject = req.body;
  if (!menuObject.name || !menuObject.courses) {
    return res.status(500).send({
      error: 'One of the properties required to create a plate has not been defined',
    });
  }
  const arrayCourses: CourseInterface[] = [];
  for (let i: number = 0; i < menuObject.courses.length; i++) {
    const filter = {name: menuObject.courses[i]};
    const courseCorrect = await Course.findOne(filter);
    if (courseCorrect != null) {
      arrayCourses.push(courseCorrect);
    } else {
      return res.status(500).send({
        error: 'An course is not found in the database',
      });
    }
  }

  const macronutrients = nutritionalComposition(arrayCourses);
  const menuCorrectly = {
    name: menuObject.name,
    carboHydrates: macronutrients[0],
    proteins: macronutrients[1],
    lipids: macronutrients[2],
    courses: arrayCourses,
    foodGroupList: getFoodList(arrayCourses),
    price: calculatePrice(arrayCourses),
  };

  try {
    const menu = new Menu(menuCorrectly);
    await menu.save();
    return res.status(201).send(menu);
  } catch (error) {
    return res.status(400).send(error);
  }
});
