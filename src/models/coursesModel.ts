import {Document, Schema, model} from 'mongoose';
// import {IngredientInterface, IngredientSchema} from './ingredientsModel';

export type plateCategory = 'Starter' | 'First' | 'Second' | 'Dessert';

/**
 * @interface IngredientInterface Interface that inherits from the Document class of the mongoose module,
 * this allows us to define what form our documents will take
 */
export interface CourseInterface extends Document {
  name: string,
  carboHydrates: number,
  proteins: number,
  lipids: number,
  groupFood: 'Proteins'|'Vegetables'|'Dairy'|'Cereals'|'Fruits',
  price: number,
  ingredients: [{
    id_: string,
  }],
  quantity: number[],
  type: plateCategory,
}

export const CourseSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  carboHydrates: {
    type: Number,
    required: true,
  },
  proteins: {
    type: Number,
    required: true,
  },
  lipids: {
    type: Number,
    required: true,
  },
  groupFood: {
    type: String,
    required: true,
    trim: true,
    enum: ['Proteins', 'Vegetables', 'Dairy', 'Cereals', 'Fruits'],
  },
  price: {
    type: Number,
    required: true,
  },
  ingredients: { // SE PERMITE EL VACIO?
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
    }],
    required: true,
  },
  quantity: {
    type: [Number],
    required: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['Starter', 'First', 'Second', 'Dessert'],
  },
});

export const Course = model<CourseInterface>('Course', CourseSchema);
