/* eslint-disable prefer-promise-reject-errors */
import {foodGroup} from './models/ingredientsModel';

interface CourseEntry {
    name: string,
    ingredients: [{
      ingredient: {
        "name": string,
        "location": string,
        "carboHydrates": number,
        "proteins": number,
        "lipids": number,
        "price": number,
        "type": foodGroup
      },
      quantity: number
    }],
    type: 'Starter' | 'First' | 'Second' | 'Dessert'
};

export function loadDataCourse(data: CourseEntry) {
  // //// Nutritional composition
  let carboHydrates: number = 0;
  let proteins: number = 0;
  let lipids: number = 0;

  data.ingredients.forEach((element) => {
    carboHydrates += (element.ingredient.carboHydrates / 100) * element.quantity;
    proteins += (element.ingredient.proteins / 100) * element.quantity;
    lipids += (element.ingredient.lipids / 100) * element.quantity;
  });

  // ////// Predominant group
  const counter = new Map<foodGroup, number>();
  let group: foodGroup;

  data.ingredients.forEach((element) => {
    group = element.ingredient.type;
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

  // ////////////////// Calculte price
  let totalPrice: number = 0;
  data.ingredients.forEach((element) => {
    totalPrice += (element.ingredient.price / 1000) * element.quantity;
  });

  return {
    name: data.name,
    carboHydrates: carboHydrates,
    proteins: proteins,
    lipids: lipids,
    groupFood: maxGroup,
    price: totalPrice,
    ingredients: data.ingredients,
    type: data.type,
  };
}
