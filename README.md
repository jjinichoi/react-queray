# useQuery

- **첫번째 인자:** 이 쿼리를 식별하는 고유 키 (캐시에서 데이터를 관리하는 기준이 됨)

- **두번째 인자:** 데이터를 가져오는 비동기 함수 (콜백 함수)

- 캐시 는 react-query가 데이터를 저장하고 관리하는 메모리 영역(`react-query`의 캐시는 브라우저 메모리 안에 저장)

- 캐시는 메모리 기반으로 동작하며, `useQuery`로 동일한 쿼리를 다시 요청할 때, 캐시에 있는 데이터를 우선적으로 사용하고, 필요하면 서버에서 새 데이터를 가져온다.`useState`에 `data`를 담았던 이전 방식과 달리 `react-query`는 컴포넌트에서 데이터를 가져오는것을 단순화해주고, `sate`변수를 따로 관리할 필요가 없어진다.

- useQuery 는 `isError` 플래그도 반환하고 요청에서 발생한 `error`도 반환한다.
```jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const featchSuperHeroes = async () => {
  const res = await fetch("http://localhost:4000/superheroes");
  const result = await res.json();
  return result;
};

export const RQSuperHeroesPage = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: featchSuperHeroes,
  });

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

```
- 쿼리가 처음 실행 될때 isLoading이 true로 설정되고 요청이 완료되면 data를 가져오기 위해 네트워크 요청이 전송되며, 쿼리 키를 사용하여 캐싱된다.

- 그 후 다른 페이지를 갔다가 다시 돌어오면 쿼리 키를 사용하여 캐시된 데이터가 로딩없이 즉시 반환하기 때문에 이 쿼리에 대한 데이터가 캐시에 존재하는 지 확인한다.

- 다만 서버 데이터가 업데이트되었을 수 있고, 캐시에 최신 데이터가 포함되어 있지 않을 수 있음을 알고 있으므로, background refetch가 발생하여 최신 데이터를 다시 가져오는 과정이 트리거(재실행)하고 가져오기가 성공하면 새 데이터가 UI에 업데이트된다.

- background refetch를 나타내는 blooean플래그를 제공한다. -> isFetching

- React Query의 기본 캐시 유효 시간(cacheTime)은 5분이다. 변경하고 싶은 경우 세번째 인수에 gcTime를 추가한다.
  
```jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const featchSuperHeroes = async () => {
  const res = await fetch("http://localhost:4000/superheroes");
  const result = await res.json();
  return result;
};

export const RQSuperHeroesPage = () => {
  const { isLoading, isError, error, isFetching, data } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: featchSuperHeroes,
    gcTime: 5000,
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
```
## staleTime

- **stale time:** 서버 데이터가 자주 변경되지 않거나 유저에게 완전 최신 데이터가 표시되지 않아도 되는 경우 매번 페이지 접속때마다 백그라운드에 refetch을 할 필요 없이 캐싱된 데이터를 사용할 수 있다. (기본 시간 0초)
```jsx
.
.
.
export const RQSuperHeroesPage = () => {
  const { isLoading, isError, error, isFetching, data } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: featchSuperHeroes,
    // 만약 30초 동안 오래된(stale) 데이터를 봐도 괜찮을 경우 
    staleTime: 30000,
  });
.
.
.
```
---

## refetch 관련 두가지 구성

### refetchOnMount
- `true` 로 설정하면, 데이터가 오래된 경우(staleTime 기준) 쿼리는 마운트 시 재조회(기본값은 true)

- `false`로 설정하면, 마운트 시 쿼리가 재조회되지 않는다.

- `"always"`로 설정하면, 쿼리는 항상 마운트 시 재조회
  
```jsx
.
.
.
export const RQSuperHeroesPage = () => {
  const { isLoading, isError, error, isFetching, data } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: featchSuperHeroes,
    staleTime: 5000,
    refetchOnMount: true,
  });
.
.
.
```

### refetchOnWindowFocus

- 브라우터 창에 focus할때 refetch(다른 탭 눌렀다가 눌렀을 때)

- refetchOnMount보다 약간 더 중요함.

- 서버 데이터가 변경되면 브라우저 탭 화면에 전통적인 `axios`를 사용할때는  그 전 데이터가 그대로이고 새로고침 시 업데이트 되지만, **react-query를 사용하면 새로고침을 하지않아도 원격으로 데이터와 동기화**된다.

- 기본적으로 windowFocus에 대한 구성(Configuration)을 다시 가져오기 때문에 가능하다.

- **유저가 다른 어플리케이션에서 우리 어플리케이션으로 돌아올 때 원격 데이터로 UI를 최신 상태로 유지할 때 유용**하다.

- `true`로 설정하면, 쿼리가 오래된(stale) 상태인 경우에만 윈도우 포커스 시 refetch
- `false`로 설정하면, 쿼리가 윈도우 포커스 시 재조회되지 않습니다.
- `"always"`로 설정하면, 쿼리는 항상 윈도우 포커스 시 refetch
  
```jsx
.
.
.
  const { isLoading, isError, error, isFetching, data } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: featchSuperHeroes,
    refetchOnWindowFocus: true,
  });
.
.
.
```

## refetchInterval (기본값 false)
- 정기적으로 데이터를 가져오는 프로세스를 나타낸다. (Polling 방식)
  - 예) 매초 데이터를 가져오고 싶은 다양한 주식의 실시간 가격을 표시하는 구성이 있는경우

- number type으로 ms 단위로 주기를 설정한다.

- `refetchInterval`를 사용하면 `refetchOnMount`, `refetchOnWindowFocus` 가 중지되기 때문에 `refetchOnMount`, `refetchOnWindowFocus` 상관없이 UI가 `refetchInterval`에 정해논대로 원격 데이터와 동기화되도록 한다.

>**Polling(폴링)**은 주기적으로 서버에 요청을 보내서 데이터를 가져오는 방식

### refetchIntervalInBackground (기본값 false)
- `true`로 설정하면, `refetchInterval`로 설정된 쿼리는 탭/창이 백그라운드에 있을 때도 계속해서 재조회된다.

```jsx
.
.
.
  const { isLoading, isError, error, isFetching, data } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: featchSuperHeroes,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });
.
.
.
```
---
> https://www.youtube.com/playlist?list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2
