import subjectData from "./subjectData";
import virtualImage from "./virtualImage";

interface subjectsDetails {
    name: string;
    path: string;
    subjectData: subjectData;
    availbleImages:(virtualImage|string)[];
}
export default subjectsDetails;