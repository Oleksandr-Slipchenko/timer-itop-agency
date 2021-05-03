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

    this.pressed = null;
    this.lastPressed = null;
    this.isDoublePress = null;
  }

  init() {
    const time = this.getTimeComponents(0);
    this.onTick(time);
  }

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
    refs.startBtn.style.visibility = 'hidden';
    refs.stopBtn.style.visibility = 'visible';

    if (this.isActive) {
      return;
    }

    if (localStorage.time && refs.clockface.textContent !== '00:00:00') {
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
  }

  stop() {
    refs.stopBtn.style.visibility = 'hidden';
    refs.startBtn.style.visibility = 'visible';
    clearInterval(this.intervalId);
    this.isActive = false;
    const time = this.getTimeComponents(0);
    this.onTick(time);
  }

  timeOut = () => setTimeout(() => (this.isDoublePress = false), 300);

  wait(e) {
    this.pressed = e.keyCode;

    if (this.isDoublePress && this.pressed === this.lastPressed) {
      this.isDoublePress = false;
      refs.stopBtn.style.visibility = 'hidden';
      refs.startBtn.style.visibility = 'visible';
      localStorage.setItem('time', refs.clockface.textContent);
      clearInterval(this.intervalId);
      this.isActive = false;
    } else {
      this.isDoublePress = true;
      this.timeOut();
    }

    this.lastPressed = this.pressed;
  }

  reset() {
    clearInterval(this.intervalId);
    this.isActive = false;
    const time = this.getTimeComponents(0);
    this.onTick(time);
    this.countTime();
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
