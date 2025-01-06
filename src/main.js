const PREBID_TIMEOUT = 700;
const adUnits = [
  {
    code: "/19968336/header-bid-tag-1", // Google Ad Manager Setup
    mediaTypes: {
      banner: {
        sizes: [
          [300, 250],
          [300, 600],
          [320, 50],
          [300, 100],
        ],
      },
    },
    bids: [
      // Setup Exchangers Parameters
      { bidder: "appnexus", params: { placementId: 13144370 } },
      {
        bidder: "rubicon",
        params: { accountId: 12345, siteId: 67890, zoneId: 111213 },
      },
      { bidder: "criteo", params: { networkId: 9999 } },
    ],
  },
];

// Function to get the device type
const getDeviceType = () =>
  /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";

// Function to set dynamic floor prices
const getFloorPrice = (size, device) => {
  const floorPrices = {
    mobile: { "320x50": 0.5, default: 0.8 },
    desktop: { "300x600": 1.5, default: 1.0 },
  };
  const key = `${size[0]}x${size[1]}`;
  return floorPrices[device][key] || floorPrices[device].default;
};

// Bid validation function
function validateBid(bid) {
  // Price validation
  if (!bid.cpm || bid.cpm <= 0 || isNaN(bid.cpm)) {
    console.warn("Invalid bid price:", bid);
    return false;
  }

  // Advertiser domain validation (example)
  if (bid.meta && bid.meta.advertiserDomains) {
    const allowedDomains = ["amazon.com", "nytimes.com"];
    const isValidDomain = bid.meta.advertiserDomains.some((domain) =>
      allowedDomains.includes(domain)
    );
    if (!isValidDomain) {
      console.warn("Invalid advertiser domain:", bid);
      return false;
    }
  }

  // Creative compatibility validation (example)
  if (bid.ad && bid.ad.indexOf("<script>") !== -1) {
    console.warn("Bid contains potentially harmful script:", bid);
    return false;
  }

  return true; // Bid is valid
}

// SETUP PREBID
const setupPrebid = () => {
  pbjs.addAdUnits(adUnits);
  // Enable Prebid.js analytics adapter
  pbjs.enableAnalytics({ provider: "ga", options: { sampling: 1 } });

  pbjs.requestBids({
    bidsBackHandler: initAdserver,
    getFloor: (bid) =>
      getFloorPrice(bid.mediaTypes.banner.sizes[0], getDeviceType()),
  });

  pbjs.onEvent("bidResponse", handleBidResponse);
  pbjs.onEvent("bidWon", handleBidWon);
  pbjs.onEvent("bidTimeout", handleBidTimeout);
  pbjs.onEvent("bidFailure", handleBidFailure);
};

const initAdserver = () => {
  if (pbjs.initAdserverSet) return;
  pbjs.initAdserverSet = true;

  googletag.cmd.push(() => {
    pbjs.setTargetingForGPTAsync && pbjs.setTargetingForGPTAsync();
    const bids = pbjs.getBidResponsesForAdUnitCode(
      "/19968336/header-bid-tag-1"
    ).bids;
    googletag.pubads().refresh(bids.length ? undefined : [fallbackSlot]); // Check if any bids were received
  });
};

// Setup Google Ad Manager
const setupGAM = () => {
  googletag.pubads().disableInitialLoad();

  googletag.cmd.push(() => {
    googletag
      .defineSlot(
        "/19968336/header-bid-tag-1",
        [
          [300, 250],
          [300, 600],
        ],
        "div-1"
      )
      .defineSizeMapping([
        [
          [0, 0],
          [
            [320, 50],
            [300, 100],
          ],
        ],
        [
          [768, 0],
          [
            [300, 250],
            [300, 600],
          ],
        ],
      ])
      .addService(googletag.pubads());
    // Define the fallback ad slot
    fallbackSlot = googletag
      .defineSlot(
        "/19968336/fallback-ad",
        [
          [300, 250],
          [300, 600],
        ],
        "div-fallback"
      )
      .defineSizeMapping([
        [
          [0, 0],
          [
            [320, 50],
            [300, 100],
          ],
        ],
        [
          [768, 0],
          [
            [300, 250],
            [300, 600],
          ],
        ],
      ])
      .addService(googletag.pubads());

    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
    //Display the fallback ad initially (it will be refreshed if no bids are received)
    googletag.display("div-fallback");
  });
};

// Lazy loading implementation
const lazyLoadThreshold = 300; // Pixels from viewport to trigger lazy loading

const lazyLoadAd = (adSlot) => {
  const rect = adSlot.getBoundingClientRect();
  if (rect.top < window.innerHeight + lazyLoadThreshold) {
    googletag.cmd.push(() => googletag.display(adSlot.id));
    // Remove listener after ad is loaded
    window.removeEventListener("scroll", lazyLoadHandler);
  }
};

const lazyLoadHandler = () => {
  lazyLoadAd(document.getElementById("div-1"));
  lazyLoadAd(document.getElementById("div-fallback"));
};

const sendAnalyticsEvent = (category, action, label, value) => {
  gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

const handleBidResponse = (bid) => {
  if (!validateBid(bid)) console.warn("Invalid bid:", bid);
};
const handleBidWon = (bid) =>
  sendAnalyticsEvent("Prebid.js", "Bid Won", bid.bidderCode, bid.cpm);
const handleBidTimeout = (data) =>
  sendAnalyticsEvent("Prebid.js", "Timeout", data.bidderCode, data.timeout);
const handleBidFailure = (data) =>
  sendAnalyticsEvent("Prebid.js", "Bid Failure", data.bidderCode, data.error);

pbjs.que.push(setupPrebid);
googletag.cmd.push(setupGAM);

// Listen for scroll events
window.addEventListener("scroll", lazyLoadHandler);
setTimeout(initAdserver, PREBID_TIMEOUT);
