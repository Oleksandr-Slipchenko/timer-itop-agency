import './styles.css';

const refs = {
  startBtn: document.querySelector('[data-action="start"]'),
  stopBtn: document.querySelector('[data-action="stop"]'),
  waitBtn: document.querySelector('[data-action="wait"]'),
  resetBtn: document.querySelector('[data-action="reset"]'),
  clockface: document.querySelector('.js-clockface'),
};

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;

    this.init();
  }

  init() {
    const time = this.getTimeComponents(0);
    this.onTick(time);
  }

  // Замена кнопки Стоп на Старт

  // activeButtonStart() {
  //   if (refs.startBtn.hasAttribute('data-action', 'stop')) {
  //     refs.startBtn.removeAttribute('data-action', 'stop');
  //     refs.startBtn.setAttribute('data-action', 'start');
  //     refs.startBtn.textContent = 'Start';
  //     refs.startBtn.addEventListener('click', timer.start.bind(timer));
  //   }
  // }

  // Замена кнопки Старт на Стоп

  // activeButtonStop() {
  //   if (refs.startBtn.hasAttribute('data-action', 'start')) {
  //     refs.startBtn.removeAttribute('data-action', 'start');
  //     refs.startBtn.setAttribute('data-action', 'stop');
  //     refs.startBtn.textContent = 'Stop';
  //     refs.startBtn.addEventListener('click', timer.stop.bind(timer));
  //   }
  // }

  countTime() {
    const startTime = Date.now();
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;

      const time = this.getTimeComponents(deltaTime);

      this.onTick(time);
    }, 1000);
  }

  start() {
    if (this.isActive) {
      return;
    }

    if (localStorage.time && refs.clockface.textContent !== '00:00:00') {
      // Значение localStorage переводим в милисекунды //

      const spendTime =
        Number(localStorage.getItem('time').split(':').join('')) * 1000;

      const startTime = Date.now();
      this.isActive = true;

      this.intervalId = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = currentTime - startTime + spendTime;
        const time = this.getTimeComponents(deltaTime);

        this.onTick(time);
      }, 1000);
    } else {
      this.countTime();
    }

    // this.countTime();

    // this.activeButtonStop();
  }

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const time = this.getTimeComponents(0);
    this.onTick(time);

    // this.activeButtonStart();
  }

  wait() {
    // this.clockfaceValueToNumber();

    localStorage.setItem('time', refs.clockface.textContent);
    clearInterval(this.intervalId);
    this.isActive = false;

    // this.activeButtonStart();
  }

  reset() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const time = this.getTimeComponents(0);
    this.onTick(time);
    this.countTime();

    // this.activeButtonStop();
  }

  pad(value) {
    return String(value).padStart(2, '0');
  }

  getTimeComponents(time) {
    const hours = this.pad(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    );
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    return { hours, mins, secs };
  }
}

const timer = new Timer({
  onTick: updateClockFace,
});

refs.startBtn.addEventListener('click', timer.start.bind(timer));

refs.stopBtn.addEventListener('click', timer.stop.bind(timer));

refs.waitBtn.addEventListener('click', timer.wait.bind(timer));

refs.resetBtn.addEventListener('click', timer.reset.bind(timer));

function updateClockFace({ hours, mins, secs }) {
  refs.clockface.textContent = `${hours}:${mins}:${secs}`;
}
