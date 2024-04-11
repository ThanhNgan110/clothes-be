const mongoose = require("mongoose");

function Connect(app) {
  mongoose
    .connect(
      "mongodb+srv://thanhngan:Ngan1102002@cluster0.dl0caaz.mongodb.net/dbClothes?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Success.....");
      app.listen(5000, () => {
        console.log("Running success123.....");
      });
    });
}

module.exports = Connect;

