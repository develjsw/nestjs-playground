import { Logger } from '@nestjs/common';

Logger.debug(
  `nest-cli.json 파일에서 entryFile을 index로 설정했다면 이 파일이 실행될 예정 \n EX) ${JSON.stringify(
    {
      $schema: 'https://json.schemastore.org/nest-cli',
      collection: '@nestjs/schematics',
      sourceRoot: 'new-src',
      entryFile: 'index',
      compilerOptions: {
        deleteOutDir: true,
      },
    },
    null,
    2,
  )}`,
);
