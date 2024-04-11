const cloudinary = require("cloudinary");

cloudinary.config({ 
  cloud_name: 'dippjnh3g', 
  api_key: '847789449836236', 
  api_secret: 'MInNXHClRZGOscQiLL1q5tFMuX4' 
})

module.exports = { cloudinary };
