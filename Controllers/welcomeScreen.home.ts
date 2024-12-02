import { Router } from "express";
import fs from "fs";
import path from "path";
import eHtml from "../index";
import virtualImage from "../Models/virtualImage";
import Subjects from "../Models/Subjects";
import instractionParser from "../Models/instractionParser";
import subjectsDetails from "../Models/subjectDetails";
import subjectData from "../Models/subjectData";
import { PrepareView } from "../index";
const View = PrepareView(import.meta.url);
const router = Router();
export default router;
const takenAlready: any = {
    length: 0,
    insert: function (...data: string[]) {
        for (let i of data) {
            this.length++;
            this[i] = true;
        }
    },
    retake: function (propertyQpath: string) {
        this.length--; delete this[propertyQpath];
    }
};
router.get("/", (req, res) => {
    let subjects: Subjects = {} as Subjects;
    if (!fs.existsSync("./assets/data.json")) {
        fs.writeFileSync("./assets/data.json", JSON.stringify(subjects));
    } else {
        subjects = JSON.parse(fs.readFileSync("./assets/data.json", "utf8")) as unknown as Subjects;
    }
    if (takenAlready.length > 0) {
        Object.keys(takenAlready).forEach(key => {
            if (!(key === "length" || key === "insert" || key === "retake"))
                takenAlready.retake(key);
        });
    }
    const data = {
        indexing: {
            name: subjects["indexing"],
            paths: subjects["indexing"]
        }
    };
    // res.send(eHtml("./View/home.html", { indexing: { name: subjects["indexing"], paths: subjects["indexing"] } }));
    res.send(View(data));
});
router.get("/images", (req, res) => {
    let subject: string = req.query.subject as string;
    let images: (virtualImage | string)[] = ((JSON.parse(fs.readFileSync("./assets/data.json", "utf8")) as Subjects)[subject] as subjectsDetails)["availbleImages"];
    function randomQ(): number {
        let num = parseInt(Math.random() * 538640390 % images.length + "");
        while (images[num] as string in takenAlready) {
            num = parseInt(Math.random() * 538640390 % images.length + "");
            if (takenAlready.length === images.length - 1) {
                for (let i = 0; i < takenAlready.length; i++) {
                    if (images[i] as string in takenAlready) { continue; }
                    takenAlready.insert(i);
                    return i;
                }
            } else if (takenAlready.length === images.length) {
                return -1;
            }
        }
        takenAlready.insert(images[num]);
        return num;
    }
    let randomNum = randomQ();
    if (randomNum !== -1)
        res.send(eHtml("./View/home.main.html", { code: "", imgLength: images.length, takenLength: takenAlready.length, imageURL: typeof images[randomNum] === "string" ? (encodeURI(images[randomNum] as string)) : images[randomNum] }))
    else
        res.send(eHtml("./View/home.main.html", { code: "alert('Congratulations')", codeCase: "alert('Congratulations')" }));
});
router.get("/img", (req, res) => {
    let image: string = req.query.image as string;
    res.sendFile(image);
})
router.get("/submit", (req, res) => {
    //the structure of image must be the following 
    //parentFolder>subjectFolder>lectureFolderNamed:lec1|lec2|...>FolderNamed:q|Q
    let pathFromRoot: string = req.query.path as unknown as string;
    const dataToSave: Subjects = { indexing: [] };
    let images: (string | virtualImage)[] = [];
    if (fs.existsSync(pathFromRoot)) {
        let subjectsFoldersArr: string[] = fs.readdirSync(pathFromRoot);
        subjectsFoldersArr = subjectsFoldersArr.map(el => path.join(pathFromRoot, el)).filter((paths) => { if (!paths.includes("_") && fs.statSync(paths).isDirectory()) return true; else return false; });//adding subject files to the root
        dataToSave.indexing = subjectsFoldersArr.map(el => path.basename(el));
        subjectsFoldersArr.forEach((file, i) => {
            let lectures: string[] = (fs.readdirSync(file));
            lectures = lectures.map(el => path.join(file, el));//adding subject files to the root
            lectures = lectures.filter(el => fs.statSync(el).isDirectory());
            lectures.forEach(lecture => {
                lecture = path.join(lecture, "q");
                if (fs.existsSync(lecture)) {
                    images.push(...readImageFile(lecture));
                }
            });
            let subjectData: subjectData = { finishedQ: [], favorite: [], lastImage: [] };
            if ((JSON.parse(fs.readFileSync("./assets/data.json", "utf8")) as unknown as subjectsDetails)["subjectData"])
                subjectData: subjectData = (JSON.parse(fs.readFileSync("../assets/data.json", "utf8")) as unknown as subjectsDetails)["subjectData"];
            let subjectDetails: subjectsDetails = {
                name: dataToSave.indexing[i],
                path: file,
                availbleImages: images,
                subjectData: subjectData,
            };//intial data
            subjectDetails.availbleImages = images;
            images = [];
            dataToSave[dataToSave.indexing[i]] = subjectDetails;
        });
    }
    fs.writeFileSync("./assets/data.json", JSON.stringify(dataToSave));
    res.redirect("/home");
});
function readImageFile(directory: string) {
    let dirData: string[] = fs.readdirSync(directory);
    let insPath: string[] = [];
    const images: (string | virtualImage)[] = dirData.map((el) => {
        if (el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif"))
            return path.join(directory, el);
        else if (el.includes('.ins')) {
            insPath.push(el);
            return "";
        }
        else
            return "";
    }).filter((el) => el);
    const folders = dirData.map((el) => {
        if (!(el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif")))
            return path.join(el);
        else
            return "";
    }).filter((el) => el);
    console.log(folders);
    if (insPath) {
        insPath.forEach(el => {
            images.push(...instractionParser(el));
        })
    }
    folders.forEach(folder => {
        let direction: string = path.join(directory, folder);
        if (fs.statSync(direction).isDirectory())
            images.push(...readImageFile(direction));
    })
    return images;
}