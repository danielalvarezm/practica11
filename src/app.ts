import * as express from 'express';
import {calculateMacronutrients, loadDataCourse, predominantGroup, totalPrice} from './courses';
import './db/mongoose';
import {Course} from './models/coursesModel';
import {Ingredient, IngredientInterface} from './models/ingredientsModel';
import {CourseInterface} from './models/coursesModel';
import {nutritionalComposition, getFoodList, calculatePrice} from './menus';
import { Menu } from './models/menusModel';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ///////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////// INGREDIENTS ///////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////

// Post

app.post('/ingredients', (req, res) => {
  const ingredient = new Ingredient(req.body);

  ingredient.save().then((ingredient) => {
    res.status(201).send(ingredient);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// Get

app.get('/ingredients', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Ingredient.find(filter).then((ingredient) => {
    if (ingredient.length !== 0) {
      res.send(ingredient);
    } else {
      res.status(404).send({
        error: 'Get is not permitted',
      });
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});

// Get id

app.get('/ingredients/:id', (req, res) => {
  Ingredient.findById(req.params.id).then((ingredient) => {
    if (!ingredient) {
      res.status(404).send({
        error: 'Get is not permitted',
      });
    } else {
      res.send(ingredient);
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});

// Patch

app.patch('/ingredients', (req, res) => {
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
          res.status(404).send({
            error: 'Update is not permitted',
          });
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

app.patch('/ingredients/:id', (req, res) => {
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
        res.status(404).send({
          error: 'Update is not permitted',
        });
      } else {
        res.send(ingredient);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});

// Delete

app.delete('/ingredients', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    Ingredient.findOneAndDelete({name: req.query.name.toString()}).then((ingredient) => {
      if (!ingredient) {
        res.status(404).send({
          error: 'Delete is not permitted',
        });
      } else {
        res.send(ingredient);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});

// Delete id

app.delete('/ingredients/:id', (req, res) => {
  Ingredient.findByIdAndDelete(req.params.id).then((ingredient) => {
    if (!ingredient) {
      res.status(404).send({
        error: 'Delete is not permitted',
      });
    } else {
      res.send(ingredient);
    }
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// ///////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////// COURSES ///////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////

// Post

app.post('/courses', async (req, res) => {
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

// Get

app.get('/courses', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Course.find(filter).then((course) => {
    if (course.length !== 0) {
      Ingredient.populate(course, {path: "ingredients"}, (_, courseData) => { // MIRAR err
        res.send(courseData);
      });
    } else {
      res.status(404).send({
        error: 'Get is not permitted', // ////////// REVISAR MENSAJES
      });
    }
  }).catch((error) => {
    res.status(500).send(error);
  });
});

// Patch

app.patch('/courses', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['name', 'ingredients', 'quantity', 'type'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      const courseObject = req.body;
      if ((courseObject.ingredients && !courseObject.quantity) ||
      (!courseObject.ingredients && courseObject.quantity)) {
        res.status(500).send({
          error: 'PARAMETROS', // //// CAMBIAR ERRRRRRRRRROR
        });
        return;
      }
      if (courseObject.ingredients) {
        if (courseObject.ingredients.length != courseObject.quantity.length) {
          res.status(500).send({
            error: 'PARAMETROS', // //// CAMBIAR ERRRRRRRRRROR
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
      Course.findOneAndUpdate({name: req.query.name.toString()}, courseObject, {
        new: true,
        runValidators: true,
      }).then((course) => {
        if (!course) {
          res.status(404).send({
            error: 'Update is not permitted',
          });
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

app.delete('/courses', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    Course.findOneAndDelete({name: req.query.name.toString()}).then((course) => {
      if (!course) {
        res.status(404).send({
          error: 'Delete is not permitted',
        });
      } else {
        res.send(course);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});


// ///////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////// MENUS ///////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////

// Post

app.post('/menus', async (req, res) => {
  const menuObject = req.body;
  if (!menuObject.name || !menuObject.courses) {
    res.status(500).send({
      error: 'One of the properties required to create a plate has not been defined', // /////////MIRAR ERRORES
    });
    return;
  }
  const arrayCourses: CourseInterface[] = [];
  for (let i: number = 0; i < menuObject.courses.length; i++) {
    const filter = {name: menuObject.courses[i]};
    const courseCorrect = await Course.findOne(filter);
    if (courseCorrect != null) {
      arrayCourses.push(courseCorrect);
    } else {
      res.status(500).send({
        error: 'An course is not found in the database',
      });
      return;
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

  const menu = new Menu(menuCorrectly);
  menu.save().then((menu) => {
    res.status(201).send(menu);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

// Get

/*app.get('/menus', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};


});*/

// Patch

app.patch('/menus', async (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['name', 'courses'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      const menuObject = req.body;
      if (menuObject.courses) {
        const arrayCourses: CourseInterface[] = [];
        for (let i: number = 0; i < menuObject.courses.length; i++) {
          const filter = {name: menuObject.courses[i]};
          const courseCorrect = await Course.findOne(filter);
          if (courseCorrect != null) {
            arrayCourses.push(courseCorrect);
          } else {
            res.status(500).send({
              error: 'An course is not found in the database',
            });
            return;
          }
        }
        const macronutrients = nutritionalComposition(arrayCourses);
        const newData = {
          carboHydrates: macronutrients[0],
          proteins: macronutrients[1],
          lipids: macronutrients[2],
          courses: arrayCourses,
          foodGroupList: getFoodList(arrayCourses),
          price: calculatePrice(arrayCourses),
        };
        Object.assign(menuObject, newData);
      }
      Menu.findOneAndUpdate({name: req.query.name.toString()}, menuObject, {
        new: true,
        runValidators: true,
      }).then((course) => {
        if (!course) {
          res.status(404).send({
            error: 'Update is not permitted',
          });
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

app.delete('/menus', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    Menu.findOneAndDelete({name: req.query.name.toString()}).then((menu) => {
      if (!menu) {
        res.status(404).send({
          error: 'Delete is not permitted',
        });
      } else {
        res.send(menu);
      }
    }).catch((error) => {
      res.status(400).send(error);
    });
  }
});

app.all('*', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
