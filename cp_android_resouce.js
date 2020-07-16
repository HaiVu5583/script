// @1x -> drawable-mdpi
// @2x -> drawable-hdpi
// @3x -> drawable-xhdpi, drawable-xxhdpi
// assume drawable, drawable-mdpi, drawable-hdpi, drawable-xhdpi, drawable-xxhdpi folder already exists
const SOURCE_DIR = "/Users/ns/Project/ReactNative/EKycVideoCall/assets";
const TARGET_DIR =
  "/Users/ns/Project/ReactNative/HiSalon/android/app/src/main/res";

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
      const destFile = `${TARGET_DIR}/drawable/${fileMap[key][0]}`;
      if (fs.existsSync(destFile)) {
        fs.unlinkSync(destFile);
      }
      fs.copyFileSync(sourceFile, destFile, fs.constants.COPYFILE_EXCL);
      console.log("Copy success to drawable", fileMap[key][0]);
    } else {
      // copy drawable-mdpi, drawable-hdpi, drawable-xhdpi, drawable-xxhdpi
      fileMap[key].forEach((fileName) => {
        const nameWithoutResolution = getFileNameWithoutResolution(fileName);
        let folderName = "drawable";
        let sourceFile = `${SOURCE_DIR}/${fileName}`;
        let destFile;
        let destFile2;
        if (fileName.includes("@2x")) {
          destFile = `${TARGET_DIR}/drawable-hdpi/${nameWithoutResolution}`;
          folderName = "drawable-hdpi";
        } else if (fileName.includes("@3x")) {
          folderName = "drawable-xhdpi";
          destFile = `${TARGET_DIR}/drawable-xhdpi/${nameWithoutResolution}`;
          destFile2 = `${TARGET_DIR}/drawable-xxhdpi/${nameWithoutResolution}`;
        } else {
          folderName = "drawable-mdpi";
          destFile = `${TARGET_DIR}/drawable-mdpi/${nameWithoutResolution}`;
        }
        if (fs.existsSync(destFile)) {
          fs.unlinkSync(destFile);
        }
        if (destFile2 && fs.existsSync(destFile2)) {
          fs.unlinkSync(destFile2);
        }
        fs.copyFileSync(sourceFile, destFile, fs.constants.COPYFILE_EXCL);
        console.log(`Copy success to ${folderName}`, fileName);
        if (destFile2) {
          fs.copyFileSync(sourceFile, destFile2, fs.constants.COPYFILE_EXCL);
          console.log("Copy success to drawable-xxhdpi", fileName);
        }
      });
    }
  }
});
