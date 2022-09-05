const { render } = require("ejs");
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const webScrapping = require("../public/puppeteer/index")
const excelCreate = require("../public/excel/creater")
const excelDelete = require("../public/excel/delete")
var emailUser
var nameUser
var token
var confirmUser
var imoList
var searchValue
//When i need put something in delay
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }


const registerget = async(req,res) => {
    try {
        res.render("register")
    } catch (error) {
        res.status(404).send({error:error.menssage});
    }
}

const registerpost = async(req,res) => {
    try {
        const {username,email,password } = req.body
        passwordWorth = bcrypt.hashSync(password)
        const user = {
            username,
            email,
            password:passwordWorth
        }

        const confirmUser = await User.findOne({email:req.body.email})
        if(confirmUser){
            erro = "Esse e-mail ja existe"
            return res.render("registernotsuccess",{erro})
        }

        await User.create(user)
        res.render("registerSuccess")
    } catch (error) {
        res.status(500).send({error:error.menssage});
    }
}

const loginget = async(req,res) => {
    try {
        res.render("login")
    } catch (error) {
        res.status(404).send({error:error.menssage})
    }
}

const loginpost = async(req,res) => {
    try {
        confirmUser = await User.findOne({email:req.body.email})
        if(!confirmUser){
            erro = "Esse e-mail não existe"
            return res.render("registernotsuccess",{erro})
        }

        const passwordAndUserMatch = bcrypt.compareSync(req.body.password, confirmUser.password)
        if(!passwordAndUserMatch){
            erro = "Senha e e-mail não convergem"
            return res.render("registernotsuccess",{erro})
        }

        token = jwt.sign({_id:confirmUser._id},process.env.TOKEN_SECRET)
        emailUser = confirmUser.email
        nameUser = confirmUser.username
        
        res.redirect("/painel")
    } catch (error) {
        res.status(404).send({error:error.menssage})
    }
}

const painel = async(req,res) =>{
    try {
        res.header("authorization-token",token)
        confirmUser = await User.findOne({email:emailUser})
        imoList = await confirmUser.imo
        res.render("painel",{imoList,imoIDUpdate:null,imoIDDelete:null,nameUser})
    } catch (error) {
        res.send("Apenas usuarios logados pode entrar nesse ambiente")
    }

}

const createPainel = async(req,res) => {
    try {
        const {imo} = req.body
        if(!imo){
            return res.redirect("/painel")
        }
        await User.updateOne({email:emailUser},{$push:{imo:{_id:imo,imo:imo}}})
        res.redirect("/painel")
    } catch (error) {
        res.status(404).send({error:error.mensage}) 
    }


}

const getById = async(req,res) => {
    try {
        if(req.params.method == "update"){
            const imoIDUpdate = confirmUser.imo[req.params.id]
            res.render("painel",{imoList,imoIDUpdate,imoIDDelete:null,nameUser})
        }else{
            const imoIDDelete = confirmUser.imo[req.params.id]
            console.log(`imodelete é ${imoIDDelete.imo}`)
            res.render("painel",{imoList,imoIDUpdate:null,imoIDDelete,nameUser})
        }
    } catch (error) {
        res.status(404).send({error:error.message}) 
    }
}

const deleteId = async(req,res) => {
    try {
            const imo= req.params.id
        //     await User.updateOne( 
        //     {email:emailUser},
        //     { $pull: { imo:{_id:imo,imo:imo} } }
        //   )
        await User.updateOne({email:emailUser,'imo._id':imo},{$pull:{imo:{'imo':imo}}})
        // const livro = await User.findOne({'imo.imo':imo})
        // console.log(livro)
        res.redirect("/painel")
    } catch (error) {
        res.status(404).send({error:error.message }) 
    }
}

const update = async (req,res) => {
    try {
        const imo = req.body
        const imoID = req.params.id
        await User.updateOne( 
            {email:emailUser,"imo._id":imoID},
            { $set: {"imo.$.imo":imo.imo }}
          )
          await User.updateOne( 
            {email:emailUser,"imo._id":imoID},
            {$set: {"imo.$._id":imo.imo }}
          )
        // await User.updateOne({email:emailUser,'imo._id':imo},{$pull:{imo:{'imo':imo}}})

        console.log(`BATATA`+ imo.imo)
        console.log(`FEIJAO`+ imoID)
        res.redirect("/painel")
    } catch (error) {
        res.status(404).send({error:error.message})
    }
}

const SearchShip = async(req,res) => {
    try {
        res.header("authorization-token",token)
        confirmUser = await User.findOne({email:emailUser})
        imoList = await confirmUser.imo
        searchValue = await webScrapping.webScrapping(imoList)
        res.render("SearchShip",{searchValue})
    } catch (error) {
        res.send("Apenas usuarios logados pode entrar nesse ambiente")
    }
}

const excelpage  = async(req,res) => {
    try {
        res.header("authorization-token",token)
        console.log('esse é o searchValue'+ searchValue)
        const emailUser = confirmUser.email
        const excel = await excelCreate.excelCreate(searchValue,emailUser)
        if(excel){
            await res.download(emailUser+'.xlsx')
        }
        await sleep(3000)
        const excelDeletador = await excelDelete.excelDelete(emailUser)
    } catch (error) {
        res.send("Apenas usuarios logados pode entrar nesse ambiente")
        console.log(error)
    }
}



module.exports = {registerget,registerpost,loginget,loginpost,painel,createPainel,getById,deleteId,update,SearchShip,excelpage}