function get(id) {
    return document.getElementById(id);
}
const url = "https://orf.at/";

const lblContent = get('lblContent');
const lblTime = get('lblTime');
const lblPrimes = get('lblPrimes');
const lblNuc = get('lblNuc');
const lblLog = get('lblLog');

const btnStress1 = get('btnStress1');
const btnStress2 = get('btnStress2');
const btnStress3 = get('btnStress3');
const btnStress4 = get('btnStress4');
const btnStress5 = get('btnStress5');

const btnCpu1 = get('btnCpu1');
const btnCpu2 = get('btnCpu2');
const btnCpu3 = get('btnCpu3');
const btnCpu4 = get('btnCpu4');
const btnCpu5 = get('btnCpu5');

btnStress1.addEventListener('click', () => {
   console.log('StressTestRam Frequent Small Allocations');
   lblLog.textContent = 'StressTestRam Frequent Small Allocations';
     sustainedMemoryStressTest(1, 10);
});

btnStress2.addEventListener('click', () => {
   console.log('StressTest Ram Large Allocations in Small Time');
   lblLog.textContent = 'StressTest Ram Large Allocations in Small Time';
     sustainedMemoryStressTest(50, 10);
});

btnStress3.addEventListener('click', () => {
   console.log('StressTestRam long-term impact of small continous allocations');
   lblLog.textContent = 'StressTestRam long-term impact of small continous allocations';
     sustainedMemoryStressTest(1, 300);
});

btnStress4.addEventListener('click', () => {
   console.log('StressTestRam large allocations over an extended period');
   lblLog.textContent = 'StressTestRam large allocations over an extended period';
     sustainedMemoryStressTest(50, 300);
});

btnStress5.addEventListener('click', () => {
   console.log('StressTestRam PUSH THE LIMIT');
   lblLog.textContent = 'StressTestRam PUSH THE LIMIT';
     sustainedMemoryStressTest(100, 600);
});

btnCpu1.addEventListener('click', () => {
  //  console.log('StressTestCpu 10 Seconds started...');
  //  lblLog.textContent = 'StressTestCpu 10 Seconds started...';
  //    cpuStressTest(10);
  window.open(url,'_blank');
});

btnCpu2.addEventListener('click', () => {
   console.log('StressTestCpu 1 Minute started...');
   lblLog.textContent = 'StressTestCpu 1 Minute started...';
     cpuStressTest(60);
});

btnCpu3.addEventListener('click', () => {
   console.log('StressTestCpu 10 Minutes started...');
   lblLog.textContent = 'StressTestCpu 10 Minutes started...';
     cpuStressTest(600);
});

btnCpu4.addEventListener('click', () => {
   console.log('StressTestCpu 1 Hour started...');
   lblLog.textContent = 'StressTestCpu 1 Hour started...';
     cpuStressTest(3600);
});

btnCpu5.addEventListener('click', () => {
   console.log('StressTestCpu 12 Hours started...');
   lblLog.textContent = 'StressTestCpu 12 Hours started...';
     startStressTest(100000);
});

//--------------------------LOGS----------------------------------------
function showUsage() {
    setInterval(() => {
    const usedMemoryInMB = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2);
    console.log(`Used memory: ${usedMemoryInMB} MB`);
   lblContent.textContent = usedMemoryInMB + ' MB';
}, 1000);
}
function logTime() {
    setInterval(() => {
        const time = performance.now();
        console.log(`Time Since started: ${(time.toFixed(2)/1000).toFixed(1)} s`);
        lblTime.textContent = (time.toFixed(2)/1000).toFixed(1) + ' s';
    }, 1000);
}
//--------------------------LOGS----------------------------------------

function sustainedMemoryStressTest(chunkSizeInMB, durationInSeconds) {
const chunkSize = chunkSizeInMB * 1024 * 1024; 
const endTime = Date.now() + durationInSeconds * 1000;
const memoryChunks = [];

function allocateMemory() {
    const array = new Array(chunkSize);
    for (let i = 0; i < array.length; i++) {
        array[i] = i % 256; 
    }
    memoryChunks.push(array);

    if (Date.now() < endTime) {
        setTimeout(allocateMemory, 100); 
    } else {
        console.log(`Allocated memory for ${durationInSeconds} seconds with chunks of ${chunkSizeInMB} MB`);
        lblLog.textContent = `Allocated memory for ${durationInSeconds} seconds with chunks of ${chunkSizeInMB} MB`;
    }
}
allocateMemory();
}

function cpuStressTest(durationInSeconds) {
let startTime = performance.now();
let endTime = startTime + durationInSeconds * 1000;
let primeCount = 0;
let currentNumber = 2; 

function isPrime(number) {
    for (let i = 2, s = Math.sqrt(number); i <= s; i++) {
        if (number % i === 0) return false;
    }
    return number > 1;
}

function performTest() {
    if (performance.now() < endTime) {
        if (isPrime(currentNumber)) {
            primeCount++;
        }
        currentNumber++;
        lblPrimes.textContent = currentNumber;
        setTimeout(performTest, 0); 
    } else {
        let totalTime = (performance.now() - startTime) / 1000;
        console.log(`Test completed in ${totalTime.toFixed(2)} seconds`);
        console.log(`%cPrimes found: ${primeCount}`, "color: red; font-weight: bold;");
        lblLog.textContent = "Primes found: " + primeCount;
    }
}
performTest();
}

function getBrowserNameAndVersion(userAgent) {
    let name = "unknown";
    let version = "unknown";
  
    if (userAgent.includes("Firefox")) {
      name = "Mozilla Firefox";
      version = userAgent.match(/Firefox\/([\d.]+)/)[1];
    } else if (userAgent.includes("SamsungBrowser")) {
      name = "Samsung Internet";
      version = userAgent.match(/SamsungBrowser\/([\d.]+)/)[1];
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      name = "Opera";
      version = userAgent.match(/(Opera|OPR)\/([\d.]+)/)[2];
    } else if (userAgent.includes("Edge")) {
      name = "Microsoft Edge (Legacy)";
      version = userAgent.match(/Edge\/([\d.]+)/)[1];
    } else if (userAgent.includes("Edg")) {
      name = "Microsoft Edge (Chromium)";
      version = userAgent.match(/Edg\/([\d.]+)/)[1];
    } else if (userAgent.includes("Chrome")) {
      name = "Google Chrome or Chromium";
      version = userAgent.match(/Chrome\/([\d.]+)/)[1];
    } else if (userAgent.includes("Safari")) {
      name = "Apple Safari";
      version = userAgent.match(/Version\/([\d.]+)/)[1];
    }
  
    return `${name} ${version}`;
  }
  
  const browserNameAndVersion = getBrowserNameAndVersion(navigator.userAgent);
  console.log(`You are using: ${browserNameAndVersion}`);
  lblNuc.textContent = browserNameAndVersion;


    var script=document.createElement('script');
    script.src='https://rawgit.com/paulirish/memory-stats.js/master/bookmarklet.js';
    document.head.appendChild(script);
//cpuStressTest(20);
// sustainedMemoryStressTest(50, 1000); 

let workers = [];
const numWorkers = navigator.hardwareConcurrency || 4; 

function startStressTest(durationMilliseconds) {
    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker('worker.js');
        workers.push(worker);
    }
    setTimeout(stopStressTest, durationMilliseconds);
}

function stopStressTest() {
    for (const worker of workers) {
        worker.terminate();
    }
    workers = [];
}


showUsage();
logTime();