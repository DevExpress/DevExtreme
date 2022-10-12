$(() => {
  let seconds = 10;
  let inProgress = false;
  let intervalId;

  const progressBarStatus = $('#progressBarStatus').dxProgressBar({
    min: 0,
    max: 100,
    width: '90%',
    statusFormat(ratio) {
      return `Loading: ${ratio * 100}%`;
    },
    onComplete(e) {
      inProgress = false;
      progressButton.option('text', 'Restart progress');
      e.element.addClass('complete');
    },
  }).dxProgressBar('instance');

  const progressButton = $('#progress-button').dxButton({
    text: 'Start progress',
    width: 200,
    onClick() {
      $('#progressBarStatus').removeClass('complete');
      if (inProgress) {
        progressButton.option('text', 'Continue progress');
        clearInterval(intervalId);
      } else {
        progressButton.option('text', 'Stop progress');
        setCurrentStatus();
        intervalId = setInterval(timer, 1000);
      }
      inProgress = !inProgress;
    },
  }).dxButton('instance');

  function setCurrentStatus() {
    progressBarStatus.option('value', (10 - seconds) * 10);
    $('#timer').text((`0${seconds}`).slice(-2));
  }

  function timer() {
    seconds -= 1;
    setCurrentStatus();
    if (seconds === 0) {
      clearInterval(intervalId);
      seconds = 10;
    }
  }
});
