const progressiveDownScroll = async (page) => {
  const scrollTimes = 100;
  const pageHeightPortion =
    (await page.evaluate("document.body.scrollHeight")) / scrollTimes;
  for (let index = 1; index <= scrollTimes; index++) {
    await page.evaluate(`window.scrollTo(0, ${pageHeightPortion * index})`);
    await page.waitForTimeout(10);
  }
};

module.exports = progressiveDownScroll;
