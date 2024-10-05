#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

// 언어 설정
const lang = (process.env.LANG || 'en').split('_')[0];
const langFilePath = `./lang/${lang}.json`;

// 언어 파일이 존재하지 않으면 기본적으로 'en'을 사용
const strings = fs.existsSync(langFilePath) ? require(langFilePath) : require('./lang/en.json');

// 문자열 포맷 함수
function format(str, ...args) {
  return str.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
}

// 진행 상황을 표시할 프로그레스 바 생성
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

function removeColorCodes(filePath, overwrite) {
  const outputPath = overwrite ? filePath : filePath.replace(/\.log$/, '_cleaned.log');

  // 이미 cleaned 파일이 존재하는 경우 삭제 (덮어쓰지 않을 때만)
  if (!overwrite && fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  // 파일 읽기
  const data = fs.readFileSync(filePath, 'utf8');

  // ANSI 색상 코드를 제거하는 정규 표현식
  const colorCodeRegex = /\u001b\[\d{1,2}m/g;

  // 색상 코드 제거
  const cleanedData = data.replace(colorCodeRegex, '');

  // 정제된 데이터를 새 파일에 쓰기
  fs.writeFileSync(outputPath, cleanedData, 'utf8');

  console.log(format(strings.processingComplete, outputPath));
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  const logFiles = [];

  // .log 파일과 디렉토리 찾기
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      logFiles.push(...processDirectory(itemPath));
    } else if (stat.isFile() && path.extname(item) === '.log') {
      logFiles.push(itemPath);
    }
  });

  return logFiles;
}

function cleanLogs(inputPath, overwrite) {
  const stat = fs.statSync(inputPath);

  if (stat.isFile()) {
    removeColorCodes(inputPath, overwrite);
  } else if (stat.isDirectory()) {
    const logFiles = processDirectory(inputPath);
    
    console.log(format(strings.totalFilesToProcess, logFiles.length));
    
    // 프로그레스 바 시작
    progressBar.start(logFiles.length, 0);

    logFiles.forEach((file, index) => {
      removeColorCodes(file, overwrite);
      progressBar.update(index + 1);
    });

    // 프로그레스 바 종료
    progressBar.stop();
  } else {
    console.error(strings.invalidPath);
    process.exit(1);
  }
}

// 커맨드 라인 인자 처리
const args = process.argv.slice(2);
let inputPath = null;
let overwrite = false;

function help() {
  console.log(strings.usage);
  console.log('-o, --overwrite:', strings.overwriteOption);
  console.log('-h, --help:', strings.helpOption);
  process.exit(0);
}

args.forEach(arg => {
  if (arg === '--overwrite' || arg === '-o') {
    overwrite = true;
  } else if (arg === '--help' || arg === '-h') {
    help();
  } else {
    inputPath = arg;
  }
});

if (!inputPath) {
  help();
} else {
  cleanLogs(path.resolve(inputPath), overwrite);
}