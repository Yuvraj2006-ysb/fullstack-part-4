const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type:String,
    required: true,
    minlength: 5,
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedOject) => {
    returnedOject.id = returnedOject._id.toString()
    delete returnedOject._id
    delete returnedOject._v
  }
})

module.exports = mongoose.model('Note', noteSchema)