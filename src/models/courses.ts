import {Document, Schema, model} from 'mongoose';
import {IngredientSchema, IngredientInterface} from './ingredients';

interface CourseInterface extends Document {
    name: string,
    carboHydrates: number,
    proteins: number,
    lipids: number,
    groupFood: 'Proteins'|'Vegetables'|'Dairy'|'Cereals'|'Fruits',
    price: number,
    food: [IngredientInterface, number][],
    type: 'Starter' | 'First' | 'Second' | 'Dessert',
}

const CourseSchema = new Schema({
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
  food: {
    type: [[IngredientSchema, Number]],
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
