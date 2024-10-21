import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const featchSuperHeroes = async () => {
  const res = await fetch("http://localhost:4000/superheroes");
  const result = await res.json();
  return result;
};

export const RQSuperHeroesPage = () => {
  //첫번째 인자: 이 쿼리를 식별하는 고유 키 (캐시에서 데이터를 관리하는 기준이 됨)
  //두번째 인자: 데이터를 가져오는 비동기 함수 (콜백 함수)
  //캐시 는 react-query가 데이터를 저장하고 관리하는 메모리 영역(react-query의 캐시는 브라우저 메모리 안에 저장)
  // 캐시는 메모리 기반으로 동작하며, useQuery로 동일한 쿼리를 다시 요청할 때, 캐시에 있는 데이터를 우선적으로 사용하고, 필요하면 서버에서 새 데이터를 가져온다.useState에 data를 담았던 이전 방식과 달리
  // react-query는 컴포넌트에서 데이터를 가져오는것을 단순화해주고, sate변수를 따로 관리할 필요가 없어진다.
  const { isLoading, data } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: featchSuperHeroes,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
      {data?.map((hero) => {
        return <div key={hero.id}>{hero.name}</div>;
      })}
    </>
  );
};
