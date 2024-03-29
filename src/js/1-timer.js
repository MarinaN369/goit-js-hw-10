import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputForme = document.querySelector('#datetime-picker');
const clockface = document.querySelector('.field');
const startBtn = document.querySelector('[data-start]');
const daysElem = document.querySelector('[data-days]');
const hoursElem = document.querySelector('[data-hours]');
const minutesElem = document.querySelector('[data-minutes]');
const secondsElem = document.querySelector('[data-seconds]');

let userSelectedDate;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date().getTime()) {
      startBtn.disabled = true;
      iziToast.show({
        title: '❌',
        message: 'Please choose a date in the future',
        messageColor: '#fff',
        messageSize: '16px',
        position: 'topRight',
        backgroundColor: '#EF4040',
        close: false,
        closeOnClick: true,
      });
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr(inputForme, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

startBtn.addEventListener('click', onStartTimer);

function onStartTimer() {
  startBtn.disabled = true;
  inputForme.disabled = true;
  const interval = setInterval(() => {
    const diff = userSelectedDate - Date.now();
    if (diff <= 1000) {
      clearInterval(interval);
      inputForme.disabled = false;
    }
    const time = convertMs(diff);
    daysElem.textContent = addLeadingZero(time.days);
    hoursElem.textContent = addLeadingZero(time.hours);
    minutesElem.textContent = addLeadingZero(time.minutes);
    secondsElem.textContent = addLeadingZero(time.seconds);
  }, 1000);
}