import { gql, useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import Image from 'next/image';

const getPost = gql`
query getPost($postId: Int!){
    getPost(postId: $postId){
      desc,
      imgs,
      likes,
      user
    }
  }
`;

const Home: NextPage = () => {
  const {data, error, loading} = useQuery(getPost, {
    variables: {postId: 2},
    errorPolicy: 'ignore',
  });

  if(loading) return <div>Loading...</div>;
  if(error) console.log(error)
  return (
    <h1 style={{font: '900 italic 25px Roboto'}}>
      {data.getPost.desc}
    </h1>
  );
}

export default Home;
