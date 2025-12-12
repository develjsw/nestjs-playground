## NestJS Playground
NestJS 기능을 테스트하고 실험하기 위한 개인 프로젝트 공간

### 목적
- 구조 실험, 성능 테스트, 설정 검증 등 다양한 PoC(Proof of Concept)에 활용
- 테스트가 완료된 코드는 삭제하거나 별도 브랜치로 이동하여 정리할 예정

---

## 테스트 기록

### 1. Prettier 설정 파일 우선순위 및 커스텀 설정 테스트

#### 테스트 목적
`package.json`의 `format` script 실행 시 Prettier 설정 파일 탐색 메커니즘 이해

#### Prettier 설정 파일 탐색 우선순위

Prettier는 프로젝트 루트에서 아래 순서대로 설정 파일을 자동 탐색

| 우선순위 | 파일명 | 형식 | 설명 |
|---------|--------|------|------|
| 1 | `package.json` | JSON | `"prettier": {...}` 필드 |
| 2 | `.prettierrc` | JSON/YAML | 확장자 없는 설정 파일 |
| 3 | `.prettierrc.json` | JSON | JSON 형식 명시 |
| 4 | `.prettierrc.yaml` / `.prettierrc.yml` | YAML | YAML 형식 |
| 5 | `.prettierrc.js` | CommonJS | `module.exports = {...}` |
| 6 | `prettier.config.js` | CommonJS | `module.exports = {...}` |
| 7 | `prettier.config.cjs` | CommonJS | `module.exports = {...}` |

**중요:** 위 순서는 공식 문서 기준이며, 실제로는 **먼저 발견된 파일이 우선** 적용됨

#### 핵심 정리

**Prettier는 표준 파일명만 자동 인식함**

| 설정 파일 | 자동 인식 여부 | 사용 방법 |
|----------|--------------|----------|
| `.prettierrc` | ✅ 자동 인식 | `prettier --write "src/**/*.ts"` |
| `.prettierrc.json` | ✅ 자동 인식 | `prettier --write "src/**/*.ts"` |
| `prettier.config.js` | ✅ 자동 인식 | `prettier --write "src/**/*.ts"` |
| `.new-prettierrc` | ❌ 인식 불가 | `prettier --config .new-prettierrc --write "src/**/*.ts"` |
| `custom-prettier.json` | ❌ 인식 불가 | `prettier --config custom-prettier.json --write "src/**/*.ts"` |

#### 문제 발생 시나리오

**잘못된 설정**
```json
{
  "scripts": {
    "format": "new-prettierrc --write \"src/**/*.ts\""
  }
}
```

**문제점**
- `new-prettierrc`를 **명령어**로 사용하려고 시도
- 실제 명령어는 항상 `prettier`여야 함
- 커스텀 설정 파일은 `--config` 옵션으로 지정

#### 해결 방법

**방법 1: 표준 파일명 사용 (권장)**

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\""
  }
}
```

- `.prettierrc`, `.prettierrc.json`, `prettier.config.js` 등 표준 파일명 사용
- 자동 탐색으로 간편하게 사용
- 팀원들이 쉽게 이해 가능

**방법 2: 커스텀 파일명 사용 (비권장)**

```json
{
  "scripts": {
    "format": "prettier --config .new-prettierrc --write \"src/**/*.ts\" \"test/**/*.ts\""
  }
}
```

**커스텀 파일명을 권장하지 않는 이유:**
- 표준 규칙에서 벗어나 다른 개발자들의 혼란 유발
- IDE/에디터의 자동 감지 기능이 작동하지 않을 수 있음
- `--config` 옵션을 매번 명시해야 하는 번거로움
- 팀 협업 시 설정 파일을 찾기 어려움

#### JavaScript 모듈 형식 예시

**`.prettierrc.js` / `prettier.config.js` / `prettier.config.cjs`**

```javascript
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
};
```

**JSON 형식 (`.prettierrc`, `.prettierrc.json`)**

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

**YAML 형식 (`.prettierrc.yaml`)**

```yaml
singleQuote: true
trailingComma: all
```

---

#### 우선순위 테스트 실습

**테스트 시나리오:**
1. `package.json`에 `"prettier"` 필드 미설정
2. `.prettierrc` 파일 삭제
3. 다음 우선순위인 `.prettierrc.json` 파일에 `"singleQuote": false` 설정

**테스트 결과:**

`.prettierrc.json` 내용:
```json
{
  "singleQuote": false,
  "trailingComma": "all"
}
```

`npm run format` 실행 시:
- Prettier가 우선순위에 따라 `.prettierrc.json` 파일을 자동 탐색
- `singleQuote: false` 설정 적용
- 모든 `.ts` 파일의 싱글쿼터(`'`)가 더블쿼터(`"`)로 변경됨

**핵심 발견:**
- 우선순위가 높은 파일(`package.json`, `.prettierrc`)이 없으면 자동으로 다음 순위 파일 탐색
- 여러 설정 파일이 존재해도 **가장 먼저 발견된 파일만** 적용됨
- 다른 설정 파일은 무시됨

**실습 전후 비교:**

```typescript
// 실습 전 (singleQuote: true)
const message = 'Hello World';

// 실습 후 (singleQuote: false)
const message = "Hello World";
```

---

## 프로젝트 구조

```
nestjs-playground/
├── src/                    # 기존 NestJS 기본 구조
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── new-src/                # 테스트용 커스텀 소스 디렉토리
│   └── index.ts
├── nest-cli.json           # NestJS CLI 설정
├── .prettierrc.json        # Prettier JSON 설정
├── .prettierrc.js          # Prettier JS 설정 (CommonJS)
├── prettier.config.js      # Prettier JS 설정 (CommonJS)
└── prettier.config.cjs     # Prettier CJS 설정
```
