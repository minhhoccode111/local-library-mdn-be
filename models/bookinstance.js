const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', require: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  due_back: { type: Date, default: Date.now },
});

// virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function () {
  // we don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

// virtual for bookinstance's due_back_formatted
BookInstanceSchema.virtual('due_back_formatted').get(function () {
  return this.due_back ? DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED) : 'Not specified';
});

// virtual to store date that user input in (which yyyy_mm_dd format) instead of ISO format in database
BookInstanceSchema.virtual('due_back_yyyy_mm_dd').get(function () {
  return DateTime.fromJSDate(this.due_back).toISODate(); // format 'YYYY-MM-DD'
});

// export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
