import {Document, Schema, model} from 'mongoose';
import {foodGroup} from './ingredientsModel';

export interface MenuInterface extends Document {
  name: string,
  carboHydrates: number,
  proteins: number,
  lipids: number,
  courses: [{
    id_: string,
  }],
  foodGroupList: foodGroup[],
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
      type: Schema.Types.ObjectId,
      ref: 'Courses',
    }],
    required: true,
  },
  foodGroupList: {
    type: [String],
    required: true, //mirar como validar que son todos foodGroup
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Menu = model<MenuInterface>('Menu', MenuSchema);