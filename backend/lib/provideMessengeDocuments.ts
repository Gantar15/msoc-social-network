import Messenge from "../models/Messenge";

export default async function provideMessengeDocuments(messenge: Messenge){
    //@ts-expect-error
    messenge.documents = (await messenge.getAccordFiles()).map(({filename, codedFilename}) => ({filename, codedFilename}));
}