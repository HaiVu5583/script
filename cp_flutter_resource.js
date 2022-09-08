// @1x -> main
// @2x -> 2.0x
// @3x -> 3.0x
// assume main, 2.0x, 3.0x folder already exists
const SOURCE_DIR = "/Users/ns/Desktop/assets_cut/mobile_banking_icon";
const TARGET_DIR = "/Users/ns/Project/Flutter/mobile_banking/assets/images";

// const SOURCE_DIR = "/Users/ns/Desktop/assets_cut/tnn";
// const TARGET_DIR = "/Users/ns/Project/Flutter/factory_app/assets/images";

const fs = require("fs");

function getFileNameWithoutResolution(fileName) {
  return fileName.replace(/@1x|@1\.5x|@2x|@3x/g, "");
}

fs.readdir(SOURCE_DIR, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  const fileMap = {};
  //listing all files using forEach
  files.forEach(function (fileName) {
    // Do whatever you want to do with the file
    if (
      !(
        fileName.endsWith("png") ||
        fileName.endsWith("jpg") ||
        fileName.endsWith("gif") ||
        fileName.endsWith("jpeg")
      )
    )
      return;
    const fileNameKey = fileName.split(/@|\./g)[0];
    console.log(fileNameKey);
    if (!fileMap[fileNameKey]) {
      fileMap[fileNameKey] = [fileName];
    } else {
      fileMap[fileNameKey].push(fileName);
    }
  });
  for (let key in fileMap) {
    if (fileMap[key] && fileMap[key].length == 1) {
      // copy to drawable
      const sourceFile = `${SOURCE_DIR}/${fileMap[key][0]}`;
      const destFile = `${TARGET_DIR}/${fileMap[key][0]}`;
      if (fs.existsSync(destFile)) {
        fs.unlinkSync(destFile);
      }
      fs.copyFileSync(sourceFile, destFile, fs.constants.COPYFILE_EXCL);
      console.log("Copy success to images", fileMap[key][0]);
    } else {
      // copy main, 2.0x, 3.0x
      fileMap[key].forEach((fileName) => {
        const nameWithoutResolution = getFileNameWithoutResolution(fileName);
        let folderName = "drawable";
        let sourceFile = `${SOURCE_DIR}/${fileName}`;
        let destFile;
        let destFile2;
        if (fileName.includes("@2x")) {
          destFile = `${TARGET_DIR}/2.0x/${nameWithoutResolution}`;
          folderName = "2.0x";
        } else if (fileName.includes("@3x")) {
          folderName = "3.0x";
          destFile = `${TARGET_DIR}/3.0x/${nameWithoutResolution}`;
        } else {
          folderName = "main";
          destFile = `${TARGET_DIR}/${nameWithoutResolution}`;
        }
        if (fs.existsSync(destFile)) {
          fs.unlinkSync(destFile);
        }
        fs.copyFileSync(sourceFile, destFile, fs.constants.COPYFILE_EXCL);
        console.log(`Copy success to ${folderName}`, fileName);
      });
    }
  }
});
