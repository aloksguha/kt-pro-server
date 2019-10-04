const XLSX = require('xlsx');

module.exports.readFile = function(filename, next){
    filename = filename || 'samplevendorandproductid.xlsx'
    var workbook = XLSX.readFile('uploads/'+filename);
    var sheets = workbook.SheetNames;

    const productNameCol = "A";
    const productVendorCol = "B";

    //console.log(workbook.Sheets[sheets[0]])
    var firstSheet = workbook.Sheets[sheets[0]]
    var keys = Object.keys(firstSheet)
    keys = keys.filter( (ele)=>{
        return !ele.startsWith('!')
    })
    console.log(keys)

    var searchStrings = [];
    for(let i=2; i <= (keys.length / 2); i++){
        proCode = firstSheet['A'+i].v
        vencode = firstSheet['B'+i].v
        searchString = proCode+'+'+vencode
        searchString = searchString.replace(/(\r\n|\n|\r)/gm, "");
        searchStrings.push(searchString)
    }
    console.log(searchStrings)
    next(searchStrings)
}


//module.exports.readFile();