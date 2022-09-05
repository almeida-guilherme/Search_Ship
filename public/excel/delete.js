const fs = require("fs")


async function excelDelete(fileUserName){
    await fs.unlink(fileUserName+".xlsx",(error)=>{
        if(error) throw error;
        console.log("ARQUIVO DELETADO");
    })
}

module.exports = {excelDelete}
