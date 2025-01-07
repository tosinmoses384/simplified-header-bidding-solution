
# Simplified Header Bidding Solution

> Using prebid.js which is a free and open source library for publishers to quickly implement header bidding.

This README demonstrate how to implement heading bidding solution.
Additional documentation can be found at [the Prebid.js documentation homepage](https://docs.prebid.org/prebid/prebidjs.html).
Working examples can be found in [the developer docs](https://prebid.org/dev-docs/getting-started.html).

Prebid.js is open source software that is offered for free as a convenience. While it is designed to help companies address legal requirements associated with header bidding, we cannot and do not warrant that your use of Prebid.js will satisfy legal requirements. You are solely responsible for ensuring that your use of Prebid.js complies with all applicable laws.  We strongly encourage you to obtain legal advice when using Prebid.js to ensure your implementation complies with all laws where you operate.

**Table of Contents**

- [Usage](#Usage)
- [Install](#Install)


<a name="Usage"></a>

## Usage (using CDN)

*Note:* Requires Prebid.js v1.38.0+

Include  the following script in the index.html file in the public directory. Obtain your google  analytics Id. See links below


```javascript

 <!-- External Scripts -->
  <script async src="https://cdn.jsdelivr.net/npm/prebid.js@latest/dist/prebid.min.js"></script>
  <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
  <!-- GOOGLE Analytics Tracking ID -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_TRACKING_ID"></script>  
```


Useful Links:
```javascript
Google Analytics:  https://analytics.google.com/analytics/web/#/provision/create
Google Ad Manager:   https://admanager.google.com/home/contact-us/#continue
Website: Magnite (Rubicon Project): https://www.magnite.com/contact-us/?aliId=eyJpIjoidWQ0ejFyRUllUm1SYmk1QyIsInQiOiI2NFROcjVPdlFWdkJKcmJOZThka213PT0ifQ%253D%253D
Website (PubMatic):  https://pubmatic.com/contact-us/
ApNexus:    Microsoft Advertising block me:  https://ads.microsoft.com/Login/
Criteo:    https://developers.criteo.com/
OpenX:   https://www.openx.com/contact-us/
```

OR you can use Prebid.js as any other npm dependency e.g

```javascript
import pbjs from 'prebid.js';
import 'prebid.js/modules/rubiconBidAdapter'; // imported modules will register themselves automatically with prebid
import 'prebid.js/modules/appnexusBidAdapter';
pbjs.processQueue();  // required to process existing pbjs.queue blocks and setup any further pbjs.queue execution

pbjs.requestBids({
  ...
})

```



<a name="Install"></a>

## Install



    $ git clone https://github.com/tosinmoses384/simplified-header-bidding-solution.git
    $ cd simplified-header-bidding-solution
    $ npm i

*Note:* You need to have `NodeJS` 12.16.1 or greater installed.


### Add a Bidder Adapter

To add a bidder adapter module, see the instructions in [How to add a bidder adapter](https://docs.prebid.org/dev-docs/bidder-adaptor.html).




