/* eslint-disable prefer-promise-reject-errors */
import {Ingredient, IngredientInterface, foodGroup} from './models/ingredients';

interface CourseEntry {
    name: string,
    food: [IngredientInterface, number][],
    type: 'Starter' | 'First' | 'Second' | 'Dessert'
};

export const loadDataCourse = (data: CourseEntry) => {
  console.log(data.food[0][0]);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      data.food.forEach((element: [IngredientInterface, number]) => {
        Ingredient.find({name: element[0].name}).catch(() => {
          reject('Food not included in our database');
        });
      });

      // //// Nutritional composition
      let carboHydrates: number = 0;
      let proteins: number = 0;
      let lipids: number = 0;
      data.food.forEach((element) => {
        carboHydrates += (element[0].carboHydrates / 100) * element[1];
        proteins += (element[0].proteins / 100) * element[1];
        lipids += (element[0].lipids / 100) * element[1];
      });


      // ////// Predominant group
      const counter = new Map<foodGroup, number>();
      let group: foodGroup;

      data.food.forEach((element) => {
        group = element[0].type;
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
      data.food.forEach((element) => {
        totalPrice += (element[0].price / 1000) * element[1];
      });

      // let aux: string = data.name;
      resolve({
        name: data.name,
        carboHydrates: carboHydrates,
        proteins: proteins,
        lipids: lipids,
        groupFood: maxGroup,
        price: totalPrice,
        food: data.food,
        type: data.type,
      });
    }, 1000);
  });
};
