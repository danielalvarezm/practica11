import {Document, Schema, model} from 'mongoose';
// import {CourseSchema, CourseInterface} from './coursesModel'

interface MenuInterface extends Document {
    name: string,
    carboHydrates: number,
    proteins: number,
    lipids: number,
    cources: [{
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
    }]
    price: number
}

const MenuSchema = new Schema({
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
  courses: {
    type: [{
        name: String,
        carboHydrates: Number,
        proteins: Number,
        lipids: Number,
        groupFood: {
            type: String,
            enum: ['Proteins', 'Vegetables', 'Dairy', 'Cereals', 'Fruits'],
        },
        price: Number,
        "ingredients": [{
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
            quantity: Number
        }],
        "type": {
            type: String,
            enum: ['Proteins', 'Vegetables', 'Dairy', 'Cereals', 'Fruits'],
        },
    }],
    requiered: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Menu = model<MenuInterface>('Menu', MenuSchema);