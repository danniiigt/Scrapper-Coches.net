const { firefox } = require("playwright");

const initPlayWright = async (headless) => {
  const browser = await firefox.launch({
    headless,
  });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
  });

  return {
    browser,
    page,
  };
};

module.exports = initPlayWright;
