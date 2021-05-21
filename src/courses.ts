import {foodGroup, IngredientInterface} from './models/ingredientsModel';

export interface CourseEntry {
    name: string,
    ingredients: IngredientInterface[],
    quantity: number[],
    type: 'Starter' | 'First' | 'Second' | 'Dessert'
};

export function loadDataCourse(data: CourseEntry) { // //////////// MIRAR LA UTITLIDAD DE ESTA FUNCION
  const macronutrients = calculateMacronutrients(data.ingredients, data.quantity);

  return {
    name: data.name,
    carboHydrates: macronutrients[0],
    proteins: macronutrients[1],
    lipids: macronutrients[2],
    groupFood: predominantGroup(data.ingredients),
    price: totalPrice(data.ingredients, data.quantity),
    ingredients: data.ingredients,
    quantity: data.quantity,
    type: data.type,
  };
}

export function calculateMacronutrients(ingredients: IngredientInterface[], quantity: number[]): number[] {
  const result: number[] = [0, 0, 0];

  for (let i: number = 0; i < ingredients.length; i++) {
    result[0] += (ingredients[i].carboHydrates / 100) * quantity[i];
    result[1] += (ingredients[i].proteins / 100) * quantity[i];
    result[2] += (ingredients[i].lipids / 100) * quantity[i];
  }

  return result;
}

export function predominantGroup(ingredients: IngredientInterface[]): foodGroup {
  const counter = new Map<foodGroup, number>();
  let group: foodGroup;

  ingredients.forEach((element) => {
    group = element.type;
    if (counter.has(group)) {
      counter.set(group, Number(counter.get(group)) + 1);
    } else {
      counter.set(group, 0);
    }
  });

  let max: number = [...counter.values()][0];
  let maxGroup: foodGroup = [...counter.keys()][0];
  counter.forEach(function(amount: number, group: foodGroup) {
    if (amount > max) {
      max = amount;
      maxGroup = group;
    }
  });
  return maxGroup;
}

export function totalPrice(ingredients: IngredientInterface[], quantity: number[]): number {
  let totalPrice: number = 0;
  for (let i: number = 0; i < ingredients.length; i++) {
    totalPrice += (ingredients[i].price / 1000) * quantity[i];
  }
  return totalPrice;
}


/*
export function getIngredients(ingredients: string[]): IngredientInterface[] {
  const arrayIngredients: IngredientInterface[] = [];
  ingredients.forEach(async (element) => {
    const filter = {name: element};
    const ingredientCorrect = await Ingredient.findOne(filter);
    if (ingredientCorrect != null) {
      arrayIngredients.push(ingredientCorrect);
      console.log(arrayIngredients);
    } else {
      throw new Error('Error');
    }
  });
  return arrayIngredients;
};*/
