/* eslint-disable prefer-promise-reject-errors */
import {Ingredient, IngredientInterface, foodGroup} from './models/ingredientsModel';

interface CourseEntry {
    name: string,
    food: IngredientInterface[],
    amountFood: number[],
    type: 'Starter' | 'First' | 'Second' | 'Dessert'
};

export const loadDataCourse = (data: CourseEntry) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { ///////////////////////////////////////////////////////////////////////// MIRAR
      
      // COMPARAR TAMAÑOS DEL food y amountfood
      
      data.food.forEach((element) => {
        Ingredient.find({name: element.name}).catch(() => {
          reject('Food not included in our database');
        });
      });

      // //// Nutritional composition
      let carboHydrates: number = 0;
      let proteins: number = 0;
      let lipids: number = 0;
      for (let i: number = 0; i < data.food.length; i++) {
        carboHydrates += (data.food[i].carboHydrates / 100) * data.amountFood[i];
        proteins += (data.food[i].proteins / 100) * data.amountFood[i];
        lipids += (data.food[i].lipids / 100) * data.amountFood[i];
      }

      // ////// Predominant group
      const counter = new Map<foodGroup, number>();
      let group: foodGroup;

      data.food.forEach((element) => {
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

      // ////////////////// Calculte price
      let totalPrice: number = 0;
      for (let i: number = 0; i < data.food.length; i++) {
        totalPrice += (data.food[i].price / 1000) * data.amountFood[i];
      };

      resolve({
        name: data.name,
        carboHydrates: carboHydrates,
        proteins: proteins,
        lipids: lipids,
        groupFood: maxGroup,
        price: totalPrice,
        food: data.food,
        amountFood: data.amountFood,
        type: data.type,
      });
    }, 1000);
  });
};
