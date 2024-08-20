#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

// 언어 설정
const lang = (process.env.LANG || 'en').split('_')[0];
const strings = require(`./lang/${lang}.json`);

// 문자열 포맷 함수
function format(str, ...args) {
  return str.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
}

// 진행 상황을 표시할 프로그레스 바 생성
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

function removeColorCodes(filePath) {
  const outputPath = filePath.replace(/\.log$/, '_cleaned.log');

  // 이미 cleaned 파일이 존재하는 경우 삭제
  if (fs.existsSync(outputPath)) {
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

function cleanLogs(inputPath) {
  const stat = fs.statSync(inputPath);

  if (stat.isFile()) {
    removeColorCodes(inputPath);
  } else if (stat.isDirectory()) {
    const logFiles = processDirectory(inputPath);
    
    console.log(format(strings.totalFilesToProcess, logFiles.length));
    
    // 프로그레스 바 시작
    progressBar.start(logFiles.length, 0);

    logFiles.forEach((file, index) => {
      removeColorCodes(file);
      progressBar.update(index + 1);
    });

    // 프로그레스 바 종료
    progressBar.stop();
  } else {
    console.error(strings.invalidPath);
    process.exit(1);
  }
}

// 커맨드 라인 인자로 파일 또는 디렉토리 경로 받기
const inputPath = process.argv[2];

if (!inputPath) {
  console.error(strings.usage);
} else {
  cleanLogs(path.resolve(inputPath));
}