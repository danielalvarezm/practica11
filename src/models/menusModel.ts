/*import {Document, Schema, model} from 'mongoose';

interface MenuInterface extends Document {
    name: string,
    carboHydrates: number,
    proteins: number,
    lipids: number,
    plates: [{
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


});
*/