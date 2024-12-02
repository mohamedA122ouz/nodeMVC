import subjectData from "./subjectData";
import subjectsDetails from "./subjectDetails";


interface Subjects {
    indexing: string[];
    [key: string]: subjectsDetails|string[];
}
export default Subjects;
