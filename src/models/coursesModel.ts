import {Document, Schema, model} from 'mongoose';
// import {foodGroup} from './ingredientsModel';

export interface CourseInterface extends Document {
  name: string,
  carboHydrates: number,
  proteins: number,
  lipids: number,
  groupFood: 'Proteins'|'Vegetables'|'Dairy'|'Cereals'|'Fruits',
  price: number,
  ingredients: [{
    "ingredient": {
      "name": string,
      "location": string,
      "carboHydrates": number,
      "proteins": number,
      "lipids": number,
      "price": number,
      "type": 'Proteins'|'Vegetables'|'Dairy'|'Cereals'|'Fruits',
    },
    "quantity": number
  }],
  type: 'Starter' | 'First' | 'Second' | 'Dessert',
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
  ingredients: {
    type: [{
      "ingredient": {
        "name": String,
        "location": String,
        "carboHydrates": Number,
        "proteins": Number,
        "lipids": Number,
        "price": Number,
        "type": {
          type: String,
          enum: ['Proteins', 'Vegetables', 'Dairy', 'Cereals', 'Fruits'],
        },
      },
      "quantity": Number,
    }],
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['Starter', 'First', 'Second', 'Dessert'],
  },
});

export const Course = model<CourseInterface>('Course', CourseSchema);
