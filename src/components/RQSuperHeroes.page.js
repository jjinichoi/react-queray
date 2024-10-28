import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const featchSuperHeroes = async () => {
  const res = await fetch("http://localhost:4000/superheroes");
  const result = await res.json();
  return result;
};

export const RQSuperHeroesPage = () => {
  // refetchInterval (기본값 false): 정기적으로 데이터를 가져오는 프로세스를 나타낸다.  (Polling 방식)
  // 예를 들어 매초 데이터를 가져오고 싶은 다양한 주식의 실시간 가격을 표시하는 구성이 있는경우

  // number type으로 ms 단위로 주기를 설정한다.

  // refetchInterval를 사용하면 refetchOnMount, refetchOnWindowFocus 가 중지되기 때문에 refetchOnMount, refetchOnWindowFocus 상관없이 UI가 refetchInterval에 정해논대로 원격 데이터와 동기화되도록 한다.

  // refetchIntervalInBackground (기본값 false)
  // true로 설정하면, refetchInterval로 설정된 쿼리는 탭/창이 백그라운드에 있을 때도 계속해서 재조회된다.

  // Polling(폴링)은 주기적으로 서버에 요청을 보내서 데이터를 가져오는 방식

  const { isLoading, isError, error, isFetching, data } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: featchSuperHeroes,
    // gcTime: 5000,
    // staleTime: 30000,
    // refetchInterval: 2000,
    // refetchIntervalInBackground: true,
    // 위에 refetch~와 상생하지 못함
    // refetchOnMount: true,
    // refetchOnWindowFocus: true,
  });

  console.log({ isLoading, isFetching });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
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
