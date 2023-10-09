const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect('mongodb+srv://subhashchandrav10:QZX4IogdgHeVnijG@cluster0.qelaizv.mongodb.net/?retryWrites=true&w=majority');
    console.log("Connection successful!");
  } catch (error) {
    console.error("Connection not successful:", error);
  }
}

main();
