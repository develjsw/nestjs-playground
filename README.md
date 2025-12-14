## NestJS Playground
NestJS 기능을 테스트하고 실험하기 위한 개인 프로젝트 공간

### 목적
- 구조 실험, 성능 테스트, 설정 검증 등 다양한 Poc(Proof of Concept)에 활용
- 테스트가 완료된 코드는 별도 브랜치로 이동 후, 내용 삭제

---

## Package.json `exports` 필드와 TypeScript 모듈 해석

### 문제 상황

`package.json`에 `exports` 필드만 설정한 경우 다음과 같은 에러가 발생할 수 있음

```
TS2307: Cannot find module 'api-package/database' or its corresponding type declarations.
There are types at 'D:/playground/test/node_modules/api-package/dist/database/index.d.ts',
but this result could not be resolved under your current 'moduleResolution' setting.
Consider updating to 'node16', 'nodenext', or 'bundler'.
```

### 원인 분석

#### TypeScript 옵션 역할

| 옵션 | 역할 | 영향 범위              |
|------|------|--------------------|
| **module** | 최종 JS 출력 형식 결정 (CommonJS/ESM) | 런타임/빌드 O / 타입 분석 X |
| **moduleResolution** | TS가 import 경로를 찾는 방식 (모듈 해석 알고리즘) | 런타임/빌드 X / 타입 분석 O |

#### 에러 발생 이유 (간단 정리)

**현재 상황**:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    // moduleResolution 미설정 → 기본값 "node" (legacy) 사용
  }
}
```

**문제점**:
- `moduleResolution: "node"` (legacy) → `exports` 필드 이해 못함
- `exports` 필드는 modern resolution(`node16`, `nodenext`)만 지원
- → **모듈 시스템 불일치로 타입 해석 실패**

#### 해결 방법

**방법 1: module과 moduleResolution 통일**
```json
{
  "compilerOptions": {
    "module": "esnext",           // ESM으로 변경
    "moduleResolution": "node16"  // modern resolution
  }
}
```
✅ `exports` 필드 완전 지원
❌ **NestJS는 CommonJS 필수라서 불가능**

**방법 2: typesVersions 사용 (NestJS 해결책)**
```json
// package.json
{
  "typesVersions": {
    "*": {
      "database": ["dist/database/index.d.ts"]
    }
  }
}
```
✅ tsconfig 수정 불필요
✅ 모든 모듈 시스템에서 작동
✅ **NestJS CommonJS 환경의 유일한 해결책**

### 최종 정리

**NestJS 라이브러리 권장 설정** (현재 프로젝트):
```json
{
  "exports": {
    "./database": {
      "types": "./dist/database/index.d.ts",
      "import": "./dist/database/index.js",
      "require": "./dist/database/index.js"
    }
  },
  "typesVersions": {
    "*": {
      "database": ["dist/database/index.d.ts"]
    }
  }
}
```

**왜 이 방식인가**:
1. NestJS는 `module: "commonjs"` 고정 → ESM 변경 불가
2. `typesVersions` = 모든 모듈 시스템 호환
3. tsconfig 수정 불필요 (사용자 환경 간섭 없음)

