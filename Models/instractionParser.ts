import virtualImage from "./virtualImage";
import fs from "fs";
export default function instractionParser(fatherDirctory:string):virtualImage[] {
    let instraction = fs.readFileSync(fatherDirctory,"utf8");
    let instractionsArr: string[] = instraction.split(';');
    const imageArr: virtualImage[] = [];
    for (let i in instractionsArr) {
        let startIndex: number = parseInt(instractionsArr[i].substring(0, instractionsArr[i].indexOf("-")));
        let endIndex: number = parseInt(instractionsArr[i].substring(0, instractionsArr[i].indexOf("-")));
        for (let i = startIndex; i <= endIndex;i++){
            let temp: virtualImage = { text: "", path: "" };
            temp.text = instractionsArr[i].substring(instractionsArr[i].indexOf('$'), instractionsArr[i].length).replace("-", "to");
            temp.path = fatherDirctory+i+".vimg";//vimg standsFor virtual image
            imageArr.push(temp);
        }
    }
    return imageArr;
}
//instraction exmple
//startImageNumber-finalImageNumber$startPageNumber-finalPageNumber$Message;
//.
//.
//.
//___________________________________________________________
//You can add multiLine
//The message could be something like: "pages mensioned is in the small book" or "pdf num1"
//Notice I didn't add specific thing because start page and end page will be shown in the image

//image will be something like this 
/*
Message
Open Question Number {quetionNumber} which is exist in page from startPageNumber to final PageNumber
*/