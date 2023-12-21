const cards = document.querySelectorAll(".card");
const turnL = document.querySelectorAll(".L");
const turnR = document.querySelectorAll(".R");
const mix = document.querySelectorAll(".cardS");
const victory = document.querySelector(".victory");
const failure = document.querySelector(".failure");
const button = document.querySelector(".action");
const flipCount = document.getElementById("flipCount");
const timeCount = document.getElementById("timeCount");
const timerCount = document.getElementById("timerCount");
const toModify = document.getElementById("toModify");
const rangeThumbSE = document.getElementById("range-thumbSE");
const rangeNumberSE = document.getElementById("range-numberSE");
const rangeLineSE = document.getElementById("range-lineSE");
const rangeInputSE = document.getElementById("sliderSE");
const rangeBubbleSE = document.getElementById("bubbleSE");
const rangeBubblePointSE = document.getElementById("bubble-pointSE");
const rangeThumbSM = document.getElementById("range-thumbSM");
const rangeNumberSM = document.getElementById("range-numberSM");
const rangeLineSM = document.getElementById("range-lineSM");
const rangeInputSM = document.getElementById("sliderSM");
const rangeBubbleSM = document.getElementById("bubbleSM");
const rangeBubblePointSM = document.getElementById("bubble-pointSM");
const checkDifficulty = document.getElementById("checkbox");
const boxTimer = document.getElementById("box-timer");
const bSFlip = document.getElementById("bSFlip");
const bSChrono = document.getElementById("bSChrono");
const bSRank = document.getElementById("bSRank");

let chrono = 0;
let intervalChrono = null;
let intervalTimer = null;
let timer = 30;
let matchedCard = 0;
let cardOne, cardTwo;
let disableDeck = true;
let flip = 0;
let difficulty = 0;

const shakeSound = createSound("../Assets/sound/shake.wav", 0.5);
const successSound = createSound("../Assets/sound/success.mp3", 0.5);
const demacia_rising = createSound("../Assets/sound/demacia_rising.mp3", 0);

button.addEventListener("click", actionButton);
toModify.textContent = "play";

rangeInputSE.addEventListener("input", updateVolume);
function updateVolume(e) {
  console.log(e);
  const newVolume = e.target.value / 100;
  console.log(newVolume);
  shakeSound.volume = newVolume;
  successSound.volume = newVolume;
}

rangeInputSM.addEventListener("input", updateVolume2);
function updateVolume2(e) {
  const newVolume = e.target.value / 100;

  demacia_rising.volume = newVolume;
}

checkDifficulty.addEventListener("change", changeDifficulty);

function changeDifficulty() {
  if (this.checked) {
    boxTimer.classList.remove("disable");
    difficulty = 1;
  } else {
    boxTimer.classList.add("disable");
    difficulty = 0;
  }
}

function createSound(url, initialVolume) {
  const sound = new Audio(url);
  sound.volume = initialVolume;
  return sound;
}

// for (let i = 0; i < cards.length; i++) {
//     console.log(cards[i]);
//   }
let test = 1;
function backgrounMusic() {
  demacia_rising
    .play()
    .then(() => {
      console.log("Lecture de la musique réussie.");
    })
    .catch((error) => {
      console.log("La lecture a échoué : ", error);
    });
}

function start() {
  toModify.textContent = "progress...";
  let array = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  array.sort(() => (Math.random() > 0.5 ? 1 : -1));
  cards.forEach((card, index) => {
    let imgTag = card.querySelector(".back-view img");
    imgTag.src = `./Assets/img/${array[index]}.jpg`;
    card.addEventListener("click", flipCard);
  });
}
function actionButton() {
  if (matchedCard == 8) {
    checkDifficulty.disabled = false;
    victory.classList.remove("hidden");
    chrono = 0.0;
    timeCount.textContent = `${chrono}` / 10;
    cards.forEach((card) => {
      card.classList.remove("flip");
    });
    flip = 0;
    updateFlipCount();
    matchedCard = 0;
    disableDeck = true;
    toModify.textContent = "play";
  } else if (timer == 0) {
    checkDifficulty.disabled = false;
    failure.classList.remove("hidden");
    chrono = 0.0;
    timer = 30;
    timeCount.textContent = `${chrono}` / 10;
    timerCount.textContent = timer;
    cards.forEach((card) => {
      card.classList.remove("flip");
    });
    flip = 0;
    updateFlipCount();
    matchedCard = 0;
    disableDeck = true;
    toModify.textContent = "play";
  } else {
    checkDifficulty.disabled = true;
    disableDeck = false;
    button.classList.add("disable");
    clearInterval(intervalChrono);
    clearInterval(intervalTimer);
    intervalChrono = setInterval(updateChrono, 100);
    if (difficulty == 1) {
      intervalTimer = setInterval(updateTimer, 1000);
    }

    toModify.textContent = "progress...";
    start();
  }
}
function updateChrono() {
  chrono++;
  timeCount.textContent = (chrono / 10).toFixed(1);
}
function updateTimer() {
  timer--;
  timerCount.textContent = timer;
  if (timer == 0) {
    clearInterval(intervalTimer);
    clearInterval(intervalChrono);
    setTimeout(() => {
      failure.classList.add("hidden");
    }, 400);
    button.classList.remove("disable");
    toModify.textContent = "reset";
    disableDeck = true;
  }
}
function updateFlipCount() {
  flipCount.textContent = `${flip}`;
}
function flipCard(e) {
  if (disableDeck) return;
  let clickedCard = e.target;
  clickedCard.classList.add("flip");
  //   cardOne = clickedCard;
  //   cardTwo = clickedCard;

  if (clickedCard !== cardOne) {
    clickedCard.classList.add("flip");
    flip++;
    updateFlipCount();
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;

    disableDeck = true;
    // console.log(cardOne, cardTwo);
    let cardOneImg = cardOne.querySelector(".back-view img").src;
    let cardTwoImg = cardTwo.querySelector(".back-view img").src;

    // console.log(cardOneImg, cardTwoImg);
    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  // console.log(img1, img2);
  if (img1 === img2) {
    // console.log("match");
    matchedCard++;
    setTimeout(() => {
      successSound.play();
    }, 400);

    // console.log(matchedCard);
    if (matchedCard == 8) {
      saveLocalstorage(flip, chrono);
      clearInterval(intervalChrono);
      getBestScore();
      setTimeout(() => {
        victory.classList.add("hidden");
      }, 400);
      button.classList.remove("disable");
      toModify.textContent = "reset";
      disableDeck = true;
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = "";
    cardTwo = "";
    disableDeck = false;
  } else {
    setTimeout(() => {
      cardOne.classList.add("shake");
      cardTwo.classList.add("shake");
      shakeSound.play();
    }, 400);

    setTimeout(() => {
      cardOne.classList.remove("shake", "flip");
      cardTwo.classList.remove("shake", "flip");
      cardOne = "";
      cardTwo = "";
      disableDeck = false;
    }, 1000);

    // console.log("no match");
  }
}
/*-----------------------------------*\
  #CUSTOM INPUT RANGE
\*-----------------------------------*/
// Update the value displayed next to the range input
const updateRangeValue = () => {
  rangeNumberSE.textContent = rangeInputSE.value + "%";
};

// Update the position of the range thumb and the width of the range line
const updateRangeVisuals = () => {
  const thumbPositionSE = rangeInputSE.value / rangeInputSE.max;
  const spaceSE = rangeInputSE.offsetWidth - rangeThumbSE.offsetWidth;

  // Calculate and set the left position of the range thumb
  rangeThumbSE.style.left = thumbPositionSE * spaceSE + "px";

  // Set the width of the range line based on the input value
  rangeLineSE.style.width = rangeInputSE.value + "%";
};

// Add event listener to the range input for real-time updates
rangeInputSE.addEventListener("input", () => {
  updateRangeValue();
  updateRangeVisuals();
});

// Initialize the range slider
const initializeRangeSlider = () => {
  updateRangeValue();
  updateRangeVisuals();
};

/*NEW*/

const updateRangeValue2 = () => {
  rangeNumberSM.textContent = rangeInputSM.value + "%";
};

// Update the position of the range thumb and the width of the range line
const updateRangeVisuals2 = () => {
  const thumbPositionSM = rangeInputSM.value / rangeInputSM.max;
  const spaceSM = rangeInputSM.offsetWidth - rangeThumbSM.offsetWidth;

  // Calculate and set the left position of the range thumb
  rangeThumbSM.style.left = thumbPositionSM * spaceSM + "px";

  // Set the width of the range line based on the input value
  rangeLineSM.style.width = rangeInputSM.value + "%";
};

// Add event listener to the range input for real-time updates
rangeInputSM.addEventListener("input", () => {
  updateRangeValue2();
  updateRangeVisuals2();
});

// Initialize the range slider
const initializeRangeSlider2 = () => {
  updateRangeValue2();
  updateRangeVisuals2();
};

rangeInputSE.addEventListener("mouseover", () => {
  rangeLineSE.classList.add("range__slider-line-hover");
  rangeThumbSE.classList.add("hover");
  rangeBubbleSE.classList.add("opacity");
  rangeBubblePointSE.classList.add("opacity");
});
rangeInputSE.addEventListener("mouseout", () => {
  rangeLineSE.classList.remove("range__slider-line-hover");
  rangeThumbSE.classList.remove("hover");
  rangeBubbleSE.classList.remove("opacity");
  rangeBubblePointSE.classList.remove("opacity");
});
rangeInputSE.addEventListener("mousedown", () => {
  rangeLineSE.classList.add("range__slider-line-pointeur");
  rangeThumbSE.classList.add("pointeur");
  rangeBubbleSE.classList.add("opacity");
  rangeBubblePointSE.classList.add("opacity");
});
rangeInputSE.addEventListener("mouseup", () => {
  rangeLineSE.classList.remove("range__slider-line-pointeur");
  rangeThumbSE.classList.remove("pointeur");
});

rangeInputSM.addEventListener("mouseover", () => {
  rangeLineSM.classList.add("range__slider-line-hover");
  rangeThumbSM.classList.add("hover");
  rangeBubbleSM.classList.add("opacity");
  rangeBubblePointSM.classList.add("opacity");
});
rangeInputSM.addEventListener("mouseout", () => {
  rangeLineSM.classList.remove("range__slider-line-hover");
  rangeThumbSM.classList.remove("hover");
  rangeBubbleSM.classList.remove("opacity");
  rangeBubblePointSM.classList.remove("opacity");
});
rangeInputSM.addEventListener("mousedown", () => {
  backgrounMusic();
  rangeLineSM.classList.add("range__slider-line-pointeur");
  rangeThumbSM.classList.add("pointeur");
  rangeBubbleSM.classList.add("opacity");
  rangeBubblePointSM.classList.add("opacity");
});
rangeInputSM.addEventListener("mouseup", () => {
  rangeLineSM.classList.remove("range__slider-line-pointeur");
  rangeThumbSM.classList.remove("pointeur");
});

function saveLocalstorage(newFlip, newChrono) {
  const dataRecovery = localStorage.getItem("saveScore");
  const newRank = Math.round((newChrono / newFlip) * 10);
  if (dataRecovery) {
    const saveScore = JSON.parse(dataRecovery);
    if (newRank < parseInt(saveScore.rank)) {
      saveScore.flip = newFlip;
      saveScore.chrono = newChrono;
      saveScore.rank = newRank;
      localStorage.setItem("saveScore", JSON.stringify(saveScore));
    }
  } else {
    let saveScore = { flip: newFlip, chrono: newChrono, rank: newRank };
    localStorage.setItem("saveScore", JSON.stringify(saveScore));
  }
}

initializeRangeSlider();
initializeRangeSlider2();
/*FUNCTION TO RECOVER THE BEST SCORE OF LOCALSTORAGE*/
function getBestScore() {
  const bestScore = JSON.parse(localStorage.getItem("saveScore"));
  console.log(bestScore);
  if (bestScore) {
    bSFlip.textContent = `${bestScore.flip}`;
    bSChrono.textContent = `${bestScore.chrono}`;
    bSRank.textContent = `${bestScore.rank}`;
  }
}
getBestScore();
