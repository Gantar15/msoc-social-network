import { gql } from "@apollo/client";


const getAllPostsCount = gql`
    query {
        getTimelinePostsCount
    }
`;
export default getAllPostsCount;

interface allPostsCount_Query{
    getTimelinePostsCount: number
}
export type {allPostsCount_Query};