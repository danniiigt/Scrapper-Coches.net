const goNextPage = (nextButton) => {
  let endOfPages = nextButton[nextButton.length - 1];
  if (endOfPages == false) {
    return 2;
  } else {
    return 0;
  }
};

module.exports = goNextPage;
