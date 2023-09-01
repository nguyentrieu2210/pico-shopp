const mongoose = require("mongoose");
module.exports = ()=>{
    mongoose.connect('mongodb+srv://trieuvannguyen203:1FwZw7NHDdZbRbol@cluster0.bci9utl.mongodb.net/pico?retryWrites=true&w=majority');
    return mongoose;
}
