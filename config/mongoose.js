const mongoose = require('mongoose');
async function main(){
    await mongoose.connect('mongodb+srv://subhashchandrav10:QZX4IogdgHeVnijG@cluster0.qelaizv.mongodb.net/?retryWrites=true&w=majority
');
    console.log("connection Successfull !! ");
}
main().catch(error =>console.log("connection not successfull !!"));
