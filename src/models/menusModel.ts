import {Document, Schema, model} from 'mongoose';
import {CourseInterface, plateCategory} from './coursesModel';
import {foodGroup} from './ingredientsModel';

/**
 * @interface IngredientInterface Interface that inherits from the Document class of the mongoose module,
 * this allows us to define what form our documents will take
 */
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
      ref: 'Course',
    }],
    required: true,
    validate: (menu: CourseInterface[]) => {
      if (menu.length < 3) {
        throw new Error('Courses\' minimum amount is 3');
      }
      let group: plateCategory[] = [];
      menu.forEach((element) => {
        group.push(element.type);
      });
      group = group.filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });
      if (group.length < 3) throw new Error('There must be at least 3 differents courses categories');
    },
  },
  foodGroupList: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const Menu = model<MenuInterface>('Menu', MenuSchema);
