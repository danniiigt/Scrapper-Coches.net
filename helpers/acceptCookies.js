const acceptCookies = async (page, currentPage, search) => {
  await page.waitForTimeout(1750);

  if (currentPage == search) {
    await page.click(
      '[class="sui-AtomButton sui-AtomButton--primary sui-AtomButton--solid sui-AtomButton--center"]'
    );
  }
};

module.exports = acceptCookies;
