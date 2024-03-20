import { Document,Schema, model, models } from "mongoose";

export interface Icategory  extends Document {
    id: string;
    name: string;
}

const CategorySchema = new Schema({
    name: { type: String, required: true unique: true },

});

const Category = models.category || model{'category', CategorySchema};

export default Category;