import {join, parse} from 'path';
import fs from 'fs';
import {Readable} from 'stream';
import {v4 as uuidv4} from 'uuid';
import { FileUpload } from 'graphql-upload';


async function saveFilesFromStream(files: Promise<FileUpload>[], path: string){
    const imgsPath: string[] = await Promise.all(files.map(async (file) => {
        const fileUploadObj = await file;
        const fileStream: Readable = fileUploadObj.createReadStream();
        const fileExt = parse(fileUploadObj.filename).ext;
        const filename = uuidv4() + fileExt;
        const imgPath = join(__dirname, '..', '..', '..', 'files', path, filename);
        fileStream.pipe(fs.createWriteStream(imgPath));
        return `${process.env.SITE_URL}/${path}/${filename}`;
    }));

    return imgsPath;
}
export default saveFilesFromStream;