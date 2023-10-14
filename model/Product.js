const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    price: {type: Number, min:[0, 'Wrong min Price'], max:[10000, 'Wrong max Price'], required: true},
    discountPercentage: {type: Number, min:[1, 'Wrong min Discount'], max:[80, 'Wrong max Discount'], required: true},
    rating: {type: Number, min:[0, 'Wrong min Rating'], max:[5, 'Wrong max Rating'], default:0},
    stock: { type: Number, min:[0, 'Wrong min Stock'], default:0},
    brand: {type: String, required: true},
    category: {type: String, required: true},
    thumbnail: {type: String, required: true},
    images: {type: [String], required: true},
    deleted: {type: Boolean, default: false},
});

const virtual = productSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
productSchema.set("toJSON",{
    virtual: true,
    versionKey: false,
    transform: function(doc, ret){
        delete ret._id;
    }
})

exports.Product = mongoose.model('Product', productSchema);