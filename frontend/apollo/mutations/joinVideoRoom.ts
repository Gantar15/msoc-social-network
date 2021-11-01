import { gql } from "@apollo/client";


const joinVideoRoom = gql`
    mutation joinVideoRoom($roomId: Int!){
        joinVideoRoom(roomId: $roomId)
    }
`;

export default joinVideoRoom;