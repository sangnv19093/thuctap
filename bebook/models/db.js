const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sangnvph20103:Sang2003@booking.j0pl2.mongodb.net/?retryWrites=true&w=majority&appName=booking')
       .catch( (err)=>{
               console.log("Loi ket noi CSDL: ");
               console.log(err);
       });
module.exports = { mongoose }