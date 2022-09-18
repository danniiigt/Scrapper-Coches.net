const {
  acceptCookies,
  initPlayWright,
  goNextPage,
  selectors2,
} = require("./helpers");
const { mongoConnection } = require("./db/connection");
const { header } = require("./helpers/header");
require("colors");

(async () => {
  header();
  await mongoConnection();
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await readline.question(
    "> Introduce el numero de página desde el que empezar: ".blue,
    async (search) => {
      search = parseInt(search);
      readline.close();
      let maxPages = search;

      try {
        const { browser, page } = await initPlayWright(true); // SHOW OR NOT SHOW BROWSER
        console.log("\n🔎 Recopilando información ...\n");

        for (
          let currentPage = search;
          currentPage <= maxPages;
          currentPage += 2
        ) {
          // let searchQuery = search.trim().toLowerCase().replaceAll(" ", "%20");
          const baseURL = `https://www.coches.net/segunda-mano/?pg=${currentPage}`;
          // const baseURL = `https://www.coches.net/segunda-mano/?KeyWords=${searchQuery}&pg=${currentPage}`;

          await page.goto(baseURL);

          await acceptCookies(page, currentPage, search);
          await page.screenshot({ path: "mainPage.png" });

          const nextButton = await selectors2(page, baseURL);

          if (nextButton) {
            console.log(`${`${`>`}`.green} ${currentPage} Pagina scrapeada`);
            maxPages += goNextPage(nextButton);
          } else {
            console.log(`${`${`>`}`.green} ${currentPage} Pagina scrapeada`);
            maxPages += 2;
          }
        }
        await browser.close();
        process.exit();
      } catch (error) {
        console.log(`${error}`.bgRed);
      }
    }
  );
})();
