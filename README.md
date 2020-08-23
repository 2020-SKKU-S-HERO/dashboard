# 대시보드

## 프로젝트 구조

- ts : 타입스크립트로 작성된 백엔드 node.js 파일들과 프론트엔드 스크립트 파일
- scss : scss 파일
- template : nunjucks 템플릿 엔진을 사용하는 템플릿 파일
- images : 프론트엔드에 사용되는 이미지와 벡터 파일
- fonts : 폰트 파일
- js : 타입스크립트가 자바스크립트로 컴파일된 파일
- css : scss가 css로 컴파일된 파일

## 웹 서버 실행하기

먼저 프로젝트 파일을 받는다.

```shell script
git clone https://github.com/2020-SKKU-S-HERO/dashboard.git
```

해당 프로젝트 파일의 root 경로에서 node module을 다운받는다.

```shell script
npm install
```

웹 서버를 실행한다.

```shell script
npm start
```

포트는 3000으로 설정되어 있다. 만약 포트 충돌 에러가 일어난다면, 
`js/server/server.js`에서 port 변수의 값을 수정한다.

## 외부 라이브러리 및 API

1. [Bootstrap](http://bootstrapk.com/)
2. [Switchery](https://github.com/abpetkov/switchery)
3. [OpenWeather](https://openweathermap.org/)