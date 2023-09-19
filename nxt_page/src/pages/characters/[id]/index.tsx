import { RickandmortyCharacter } from '@/pages'
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// 我保留csr的部分讓大家好對比
// const Character = () => {
//   const [roleDetail, setRoleDetail] = useState<RickandmortyCharacter | null>(null)
//   const router = useRouter()
//   useEffect(() => {
//     const controller = new AbortController();
//     const signal = controller.signal;
//     fetch(`https://rickandmortyapi.com/api/character/${router.query.id}`, {
//       signal: signal
//     })
//     .then((response) => response.json())
//     .then((response: RickandmortyCharacter) => {
//       // 成功之後的處理
//       setRoleDetail(response)
//     });
//     return () => controller.abort();
//   }, [router.query.id])
//   return (
//     <div>
//       <h2>here is {router.query.id}</h2>
//       <div>{roleDetail?.name}</div>
//     </div>
//   )
// }

// 下面是SSG/ISR
interface CharacterProps {
  roleDetail: RickandmortyCharacter;
}

const Character: React.FC<CharacterProps> = ({roleDetail}) => {
  const router = useRouter()
  
  return (
    <div>
      <h2>here is {router.query.id}</h2>
      <div>
        <p>Name: {roleDetail?.name}</p>
        <p>status: {roleDetail?.status}</p>
        <p>species: {roleDetail?.species}</p>
        <p>gender: {roleDetail?.gender}</p>
        <p>origin: {roleDetail?.origin.name}</p>
        <p>location: {roleDetail?.location.name}</p>
      </div>
      <button 
        className="p-2 mx-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-300 disabled:bg-gray-100 min-w-40"
        onClick={() => router.back()}
      >back</button>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const numArr = (num: number) => {
    if (num > 0) {
      let result = [];
      for(let i = 1; i <= num; i++) {
        result.push(i)
      }
      return result
    } else return 
  }
  const possibleIds = numArr(20);
  
  const paths = possibleIds!.map((id) => ({
    params: { id: id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking',// 可以設定為 false, true, blocking
  };
};

export const getStaticProps: GetStaticProps<CharacterProps> = async ({ params }) => {
  const characterId = params?.id;

  if (!characterId) {
    return {
      notFound: true,
    };
  }

  const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
  const roleDetail: RickandmortyCharacter = await response.json();

  return {
    props: {
      roleDetail,
    },
    revalidate: 60 // 代表每60秒會重發確認頁面資訊是否有異動需要重新生成
  };
};

export default Character
