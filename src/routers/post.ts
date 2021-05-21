import * as express from 'express';
import {loadDataCourse} from '../courses';
import {Course} from '../models/coursesModel';
import {Ingredient} from '../models/ingredientsModel';
import '../db/mongoose';

export const postRouter = express.Router();

// Ingredients
postRouter.post('/ingredient', async(req, res) => {
    const ingredient = new Ingredient(req.body);
  
    try  {
        await ingredient.save();
        res.status(201).send(ingredient);
      } catch (error) {
        res.status(400).send(error);
    }
  });

  // Courses
  postRouter.post('/course', async (req, res) => {
    const courseData = loadDataCourse(req.body);
    const course = new Course(courseData);
    try  {
        await course.save();
        res.status(201).send(course);
      } catch (error) {
        res.status(400).send(error);
    }
  });
  