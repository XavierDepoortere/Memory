const championNames = [
  "annie",
  "briar",
  "gnar",
  "kled",
  "malphite",
  "monkeyking",
  "olaf",
  "poppy",
  "teemo",
  "trundle",
  "tryndamere",
  "vayne",
  "veigar",
  "yone",
  "zac",
  "zyra",
];

function getChampionNames() {
  championNames.sort(() => (Math.random() > 0.5 ? 1 : -1));
  const firstEight = championNames.slice(0, 8);
  const doubledImages = firstEight.concat(firstEight);
  doubledImages.sort(() => (Math.random() > 0.5 ? 1 : -1));
  return doubledImages;
}

export default getChampionNames;
