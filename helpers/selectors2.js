const saveCarsOnDb = require("./saveCarsOnDb");
const progressiveDownScroll = require("./scrollDown");

const selectors2 = async (page, baseURL) => {
  try {
    await progressiveDownScroll(page);

    let carLinks = await page.$$eval("div.sui-AtomCard-info > a", (allLinks) =>
      allLinks.map((link) => link.getAttribute("href"))
    );

    let savedCarsCount = 0;

    for (const link of carLinks) {
      await page.goto(`https://www.coches.net${link}`);

      let imagesCount = await page.$$eval(
        "span.mt-GalleryBasic-sliderCounterText",
        (imagesCount) =>
          imagesCount.map((imageCount) => imageCount.textContent.split("/")[1])
      );

      for (let index = 1; index <= imagesCount; index++) {
        await page.click("span.react-Slidy-next");
      }

      let carImages = await page.$$eval(
        "img.mt-GalleryBasic-sliderImage",
        (allImages) => allImages.map((image) => image.getAttribute("src"))
      );

      await progressiveDownScroll(page);

      let carTitle = await page.$$eval(
        "div.mt-PanelAdInfo-title > div > h1",
        (allTitles) => allTitles.map((title) => title.textContent)
      );

      let carPriceCash = await page.$$eval(
        "div.mt-CardAdPrice-cash > div",
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

      let carTagsSelector = await page.$$eval(
        "ul.mt-PanelAdDetails-data > li",
        (allTitles) => allTitles.map((title) => title.textContent)
      );

      let marcaCoche = await carTitle[0].split(" ")[0].toUpperCase();

      carTagsSelector[0] = await parseInt(carTagsSelector[0]);

      carTagsSelector[1] = await parseInt(
        carTagsSelector[1]
          .replace(".", "")
          .substring(0, carTagsSelector[1].length - 2)
          .trim()
      );

      carTagsSelector[5] = await parseInt(carTagsSelector[5].split(" ")[0]);
      carTagsSelector[6] = await parseInt(carTagsSelector[6].split(" ")[0]);

      carTagsSelector[7] = await parseInt(
        carTagsSelector[7].substring(0, carTagsSelector[7].length - 2).trim()
      );
      carTagsSelector[8] = await parseInt(
        carTagsSelector[8].substring(0, carTagsSelector[8].length - 2).trim()
      );

      let carTags = {
        year: carTagsSelector[0],
        kilometers: carTagsSelector[1],
        location: carTagsSelector[2],
        type: carTagsSelector[3],
        gear: carTagsSelector[4],
        doors: carTagsSelector[5],
        seats: carTagsSelector[6],
        enginecc: carTagsSelector[7],
        horsePower: carTagsSelector[8],
        color: carTagsSelector[9],
        emisions: carTagsSelector[10],
        combustion: carTagsSelector[11],
        warranty:
          carTagsSelector[12] === undefined ? false : carTagsSelector[12],
      };

      let carDescription = await page.$$eval(
        "div.mt-PanelAdDetails-commentsContent",
        (allDescriptions) => allDescriptions.map((desc) => desc.textContent)
      );

      let carDataSelector = await page.$$eval(
        "div.mt-ListModelDetails-listIconTitleWrapper > p.mt-ListModelDetails-listItemValue--blackBold",
        (allCarData) => allCarData.map((data) => data.textContent)
      );

      let carData = {
        tank: carDataSelector[0],
        measures: carDataSelector[1],
        trunk: carDataSelector[2],
        weight: carDataSelector[3],
        accelerationTo60: carDataSelector[4],
        maxSpeed: carDataSelector[5],
        urbanConsumption: carDataSelector[6],
        extraUrbanConsumption: carDataSelector[7],
        averageConsumption: carDataSelector[8],
      };

      const car = await {
        title: carTitle[0],
        price: carPriceCash[0],
        marca: marcaCoche,
        images: carImages,
        link: `https://www.coches.net${link}`,
        carTags,
        description: carDescription[0],
        carData,
      };

      savedCarsCount += await saveCarsOnDb(car);
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

    console.log(`Se han guardado ${savedCarsCount} coches en la BD`.gray);

    return nextButton;
  } catch (error) {
    return null;
  }
};

module.exports = selectors2;
