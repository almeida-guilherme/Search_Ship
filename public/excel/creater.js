
async function excelCreate(searchValue,fileUserName){
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet('Search Ship');

    sheet.columns = [
        { header: 'Name', key:'Name'},
        {header: 'Situation', key:'Situation'},
    ]

    searchValue[0].forEach((searchValueElement,i)=>{
        sheet.addRow({Name:searchValue[0][i],Situation:searchValue[1][i]})
    })

    sheet.getRow(1).font = {
        bold: true,
        color : {argb: 'FFCCCCCC'}
    }

    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        bgColor: {rgb:'FF000000'}
    }

    await sheet.workbook.xlsx.writeFile(fileUserName + ".xlsx")
    return true
}

module.exports = {excelCreate}
