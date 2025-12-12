import { Logger } from '@nestjs/common';

Logger.debug(
  `nest-cli.json 파일에서 entryFile을 설정하지 않았다면 디폴트는 main.ts 파일을 찾아서 실행함 \n EX) ${JSON.stringify(
    {
      $schema: 'https://json.schemastore.org/nest-cli',
      collection: '@nestjs/schematics',
      sourceRoot: 'new-src',
      compilerOptions: {
        deleteOutDir: true,
      },
    },
    null,
    2,
  )}`,
);
