const Excel = require('exceljs');


module.exports.generateReport = async function(dataSet){
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Instagram Data', {properties:{tabColor:{argb:'FFC0000'}}});

  worksheet.columns = [
      { header: "Username", key: 'username', width: 30 },
      { header: "Bio" ,     key: 'bio',      width: 40 },
      { header: "Likes",    key: 'likes',     width: 15 }
  ];

  for(let dataPiece of dataSet){
    console.log(dataPiece.username);
    worksheet.addRow([dataPiece.username, dataPiece.bio, dataPiece.likes]);
  }
  let filename = './bin/Report_' + new Date() + "_.xlsx";
  await workbook.xlsx.writeFile(filename);
  return filename;
};
