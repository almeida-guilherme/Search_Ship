const mongoose = require("mongoose")

const connectToDb = () => [
    mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
        console.log("Conectado ao banco de dados")
    }).catch((error)=>{
        console.log(error)
    })
]

module.exports = connectToDb