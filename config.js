const mongoose = require("mongoose");

function Connect(app) {
  mongoose
    .connect(
      "mongodb+srv://thanhngan:Ngan1102002@cluster0.dl0caaz.mongodb.net/foodie_?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Success.....");
      app.listen(5000, () => {
        console.log("Running success.....");
      });
    });
}

module.exports = Connect;

