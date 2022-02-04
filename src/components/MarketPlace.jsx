import { Typography } from "@material-ui/core";
import React from "react";
import { useStyles as marketStyles } from "./styles/MarketPlace";
import { useStyles as homeStyles } from "./styles/Home";
import HorizontalScrolling from "./elements/HorizontalScroll";
import { content } from "./elements/dummyImages";
import ListHead from "./elements/ListHead";
// const auctionContent = [];

const auctionContent = content;

const MarketPlace = (props) => {
  const marketClasses = marketStyles();
  const homeClasses = homeStyles();

  return (
    <div className={homeClasses.mainContent}>
      <div className={marketClasses.heading} style={{ marginTop: "30px" }}>
        <Typography>All Contents</Typography>
      </div>
      <div className={homeClasses.itemsList}>
        <div className={homeClasses.auctions}>
          <ListHead title={""} leftButton={"Trending"} />
          <HorizontalScrolling getItems={auctionContent} isTrending={true} />
        </div>
        <div className={homeClasses.notableContents}>
          <ListHead title={""} leftButton={"Top Sold"} />
          <HorizontalScrolling getItems={auctionContent} isTrending={true} />
        </div>
        <div className={homeClasses.notableCreators}>
          <ListHead title={""} leftButton={"Live"} />
          <HorizontalScrolling getItems={auctionContent} onSale={true} />
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
