const progressiveDownScroll = require("./scrollDown");

const selectors = async (page, baseURL) => {
  await progressiveDownScroll(page);

  let carTitles = await page.$$eval(
    "div.sui-AtomCard-info > a > h2",
    (allTitles) => allTitles.map((title) => title.textContent)
  );

  let carLinks = await page.$$eval("div.sui-AtomCard-info > a", (allLinks) =>
    allLinks.map((link) => link.getAttribute("href"))
  );

  let carPrices = await page.$$eval(
    "div.sui-AtomCard-info > a > div.mt-CardAdPrice > div.mt-CardAdPrice-cash > div.mt-CardAdPrice-cashAmount > div > h3",
    (allPrices) =>
      allPrices.map((price) =>
        parseInt(
          price.textContent
            .trim()
            .substring(0, price.textContent.length - 2)
            .replace(".", "")
        )
      )
  );

  let carLocations = await page.$$eval(
    "div.sui-AtomCard-info > a > ul.mt-CardAd-attr",
    (allPrices) => allPrices.map((price) => price.children[0].textContent)
  );

  let carMotors = await page.$$eval(
    "div.sui-AtomCard-info > a > ul.mt-CardAd-attr",
    (allPrices) => allPrices.map((price) => price.children[1].textContent)
  );

  let carYears = await page.$$eval(
    "div.sui-AtomCard-info > a > ul.mt-CardAd-attr",
    (allPrices) => allPrices.map((price) => price.children[2].textContent)
  );

  for (const link of carLinks) {
    await page.goto(`https://www.coches.net${link}`);
  }

  await page.goto(baseURL);

  let nextButton = await page.$$eval(
    "li.sui-MoleculePagination-item",
    (allButtons) =>
      allButtons.map((button) =>
        button.children[button.children.length - 1].classList.contains(
          "sui-AtomButton--disabled"
        )
      )
  );

  return {
    carTitles,
    carLinks,
    carPrices,
    carLocations,
    carMotors,
    carYears,
    nextButton,
  };
};

module.exports = selectors;
