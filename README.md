## NestJS Playground
NestJS 기능을 테스트하고 실험하기 위한 개인 프로젝트 공간

### 목적
- 구조 실험, 성능 테스트, 설정 검증 등 다양한 PoC(Proof of Concept)에 활용
- 테스트가 완료된 코드는 삭제하거나 별도 브랜치로 이동하여 정리할 예정

---

## 테스트 기록

### 1. ESLint no-floating-promises 경고와 CommonJS 제약 충돌 해결

#### 테스트 목적
NestJS main.ts 파일에서 ESLint Promise 처리 규칙과 CommonJS 모듈 시스템 제약 사이의 충돌 해결 방법 검증

#### 문제 상황

**ESLint 경고 발생:**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();  // ⚠️ ESLint: Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator. (@typescript-eslint/no-floating-promises)
```

**원인:**
- `eslint.config.mjs`의 `@typescript-eslint/no-floating-promises: 'warn'` 규칙
- Promise를 반환하는 함수는 반드시 `await` 또는 `.catch()`로 처리해야 함
- `async` 함수 호출 = 반드시 처리해야 한다고 판단

#### 해결 시도 1: await 추가

```typescript
await bootstrap();  // ❌ TypeScript 에러 발생
```

**에러 메시지**
```
TS1378: Top-level await expressions are only allowed when the
'module' option is set to es2022, esnext, system, node16, nodenext,
or preserve, and the 'target' option is set to ES2017 or higher.
```

**원인**
- `tsconfig.json`의 `"module": "commonjs"` 설정
- CommonJS 모듈 시스템에서는 파일 최상단에서 `await` 사용 불가 (top-level await 불가)

---

#### Top-Level Await란?

**정의:**
- 함수 외부, 파일의 최상위 레벨에서 직접 `await`를 사용하는 기능
- ES2022(ES13)에서 도입된 ESM 전용 기능

**일반 await vs Top-Level await 비교**

```typescript
// 일반 await (함수 내부) - 모든 모듈 시스템에서 가능
async function example() {
  const result = await fetch('https://api.example.com');  // ✅ OK
  return result;
}

// ⚠️ Top-Level await (함수 외부) - ESM에서만 가능
const result = await fetch('https://api.example.com');  // ⚠️ CommonJS에서는 불가
console.log(result);
```

**사용 가능 조건**

| 모듈 시스템 | Top-Level Await | 설정 |
|------------|----------------|------|
| **CommonJS** | ❌ 불가 | `"module": "commonjs"` (NestJS 기본) |
| **ESM** | ✅ 가능 | `"module": "esnext"` 또는 `"es2022"` + `"type": "module"` |

**예시**

```typescript
// CommonJS (main.ts) - NestJS 기본
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  // ✅ 함수 내부 await
  await app.listen(3000);
}

await bootstrap();  // ❌ Top-level await - CommonJS에서 불가
bootstrap();        // ✅ 일반 호출 - 가능 (하지만 ESLint 경고)
void bootstrap();   // ✅ 해결책 - ESLint 경고 없음
```

```typescript
// ESM (ES2022+)
import { NestFactory } from '@nestjs/core';

const app = await NestFactory.create(AppModule);  // ✅ Top-level await 가능
await app.listen(3000);
```

**Top-Level Await의 장점**
- 초기화 코드 간결화
- 비동기 모듈 로딩 가능
- 최신 JavaScript 표준

**NestJS에서 사용하지 않는 이유**
- NestJS는 CommonJS 기반 (생태계 호환성)
- ESM 전환 시 설정 복잡도 증가
- 대부분의 라이브러리가 CommonJS 우선 지원

---

#### 핵심 문제 분석

**두 철학의 충돌**

| 측면 | 요구사항 | 제약사항 |
|------|----------|----------|
| **ESLint 철학** | Promise 반환 함수 = 반드시 처리 필요<br>(`await` 또는 `.catch()`) | `bootstrap()` 호출 시 처리 강제 |
| **CommonJS 제약** | 파일 최상단(top-level)에서 `await` 불가 | `await bootstrap()` 사용 불가 |
| **충돌 지점** | 함수 호출은 해야 하는데 `await`도 못 쓰는 상황 |  |

**NestJS 기본 템플릿**
- NestJS CLI가 생성하는 기본 `main.ts`는 `bootstrap()` 그냥 호출
- 의도적으로 Promise 처리를 하지 않음 (ESLint 규칙 없으면 문제 없음)
- 하지만 `@typescript-eslint/no-floating-promises` 규칙 활성화 시 경고 발생

#### 해결 방법

**방법 1: `void` 연산자 사용 (권장)**

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
```

**`void` 연산자의 역할**
- 표현식을 평가하고 `undefined` 반환
- ESLint에게 "의도적으로 Promise를 무시함"을 명시
- TypeScript 에러 없음 (top-level await 사용 안 함)
- CommonJS 모듈 시스템 유지

**방법 2: `.catch()` 체이닝**

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});
```

#### 테스트 결과

**적용 코드**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
```

**테스트:**
1. `npm run lint` → ✅ ESLint 경고 해결
2. `npm run build` → ✅ 빌드 성공
3. `npm start` → ✅ 실행 성공
4. TypeScript 컴파일 → ✅ 에러 없음

#### 핵심 정리

**문제의 본질**
- ESLint의 "Promise는 반드시 처리해야 함" 철학
- CommonJS의 "top-level await 불가" 제약
- 두 가지가 충돌하여 발생하는 구조적 이슈

**해결 원칙**
- `void` 또는 `.catch()`로 "의도적인 Promise 처리"를 명시
- CommonJS 모듈 시스템 유지
- NestJS 생태계 호환성 보장

**권장 패턴**
```typescript
// 개발 환경: void 사용 (간결)
void bootstrap();

// 프로덕션 환경: .catch() 사용 (안전)
bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});
```

---

## 프로젝트 구조

```
nestjs-playground/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts              # void bootstrap() 패턴 적용
├── tsconfig.json            # "module": "commonjs"
├── eslint.config.mjs        # no-floating-promises: 'warn'
└── package.json
```
