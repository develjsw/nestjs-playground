## NestJS Playground
NestJS 기능을 테스트하고 실험하기 위한 개인 프로젝트 공간

### 목적
- 구조 실험, 성능 테스트, 설정 검증 등 다양한 PoC(Proof of Concept)에 활용
- 테스트가 완료된 코드는 삭제하거나 별도 브랜치로 이동하여 정리할 예정

---

## 테스트 기록

### 1. NestJS CLI `sourceRoot` 및 `entryFile` 설정 테스트

#### 테스트 목적
`nest-cli.json`의 `sourceRoot`를 변경했을 때 진입점 파일 탐색 메커니즘 이해

#### nest start 실행 순서

1. **nest-cli.json 읽기**
   - `sourceRoot` 확인 EX) `"new-src"`
   - `entryFile` 확인
     - 설정 없음 → 기본값 `"main"` 사용
     - 설정 있음 → 지정된 파일명 사용


2. **진입점 파일 탐색**
   - 경로 패턴: `{sourceRoot}/{entryFile}.ts`
   - EX) `sourceRoot: "new-src"`, `entryFile: "main"` → `new-src/main.ts` 탐색


3. **문제 발생 시나리오**
   - `sourceRoot`를 `"new-src"`로 변경
   - `entryFile` 설정 누락 (기본값 `"main"` 적용)
   - `new-src/main.ts` 파일 없음
   - `new-src/index.ts`만 존재
   - **결과**: 진입점을 찾지 못해 실행 실패


4. **빌드 프로세스**
   - `nest build` 명령은 TypeScript 컴파일 수행
   - 컴파일 결과물은 `dist/` 폴더에 생성
   - 출력 파일명은 진입점 파일명을 따름 EX) `index.ts` → `dist/index.js`

#### 핵심 정리

**NestJS CLI는 기본적으로 `main.ts`를 진입점으로 탐색함**

| 설정 | 탐색 경로 | 설명 |
|------|----------|------|
| `sourceRoot: "src"`<br>`entryFile` 미설정 | `src/main.ts` | NestJS 기본 구조 |
| `sourceRoot: "new-src"`<br>`entryFile` 미설정 | `new-src/main.ts` | sourceRoot만 변경 시 main.ts 여전히 필요 |
| `sourceRoot: "new-src"`<br>`entryFile: "index"` | `new-src/index.ts` | 커스텀 진입점 설정 |

**주의사항:**
- `entryFile`에는 확장자(`.ts`) 제외하고 파일명만 작성
- `package.json`의 `main` 필드는 npm 패키지용이며, `nest start`와는 무관

#### 해결 방법

**nest-cli.json 수정:**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "new-src",
  "entryFile": "index",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

**결과:**
- `nest start` → `new-src/index.ts` 실행
- `nest build` → `dist/index.js` 생성

---

## 프로젝트 구조

```
nestjs-playground/
├── src/              # 기존 NestJS 기본 구조
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── new-src/          # 테스트용 커스텀 소스 디렉토리
│   └── index.ts
└── nest-cli.json     # NestJS CLI 설정
```
