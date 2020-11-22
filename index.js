const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", async (_, res) => {
  const promos = await axios
    .get("https://www.traveloka.com/id-id/promotion")
    .then(async (res) => {
      let result = [];
      const $ = await cheerio.load(res.data);
      $(".component-overflow.list-promo").each(() => {
        $(".promo-thumb").each((i, elem) => {
          const promoDetailLink = $(elem)
            .find("a.buttonLinkPromotion")
            .attr("href");
          const promoImg = $(elem).find(".promo-thumb-img-el").attr("src");
          const promoDesc = $(elem).find(".promo-thumb-desc").text();
          let promoPeriod = $(elem)
            .find(".promo-thumb-duration > p:nth-child(1)")
            .html();
          promoPeriod =
            typeof promoPeriod === "string"
              ? promoPeriod.replace("&#x2013;", "-")
              : "";
          const promoStayPeriod = $(elem)
            .find(".promo-thumb-duration > p:nth-child(2)")
            .text();
          result.push({
            promo_detail_link: promoDetailLink,
            promo_img: promoImg,
            promo_desc: promoDesc,
            promo_period: promoPeriod,
            promo_stay_period: promoStayPeriod,
          });
        });
      });
      return result;
    })
    .catch((err) => {
      return {
        status: "ERROR",
        data: err,
      };
    });
  res.send(promos);
});

app.listen(PORT, () => {
  console.log(`Your application is running on http://localhost:${PORT}`);
});
