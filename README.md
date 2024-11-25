# Pubtrail

[http](https://csisztaiarnold.github.io/pubtrail/)

I started developing this super essential app mostly because I wanted to brush up on my rusty React skills. But as I got into experimenting, I figured I might as well solve a serious issue I often face: when I'm in an unfamiliar place and need to quickly find the nearest pubs, including those hidden gems Google Maps seems to conveniently ignore. Untappd is cool, but it doesn’t show you those cozy, slightly musty little dives where the drinks are often the best. 🍺

And thus, **PubTrail** was born.

Without URL parameters, it uses your browser’s not-so-accurate geolocation to look around within a set radius. But you can also target exact coordinates. You can move the little person around the map, and every time you drop them, the app scans the area for the closest watering holes. Click on the beer mug, and you’ll get a link that (if it exists) takes you to a more detailed pub description.

The data comes from OpenStreetMaps, which means it might show places that no longer exist or have incorrect tags (like cafes or restaurants instead of pubs). You might be wondering, "Why not just include cafes and restaurants too?". Well, if I’m just looking to grab a beer or two, I really don’t want a list of Michelin-starred restaurants or coffee shops that only serve, well… coffee (This is also a personal gripe with Google Maps—it often suggests fancy restaurants when I’m just hunting for pubs, especially when I’m abroad, pubTrail keeps it real and focuses on spots actually defined as pub.) As OSM gets updated, those nonexistent places will gradually vanish.

It’s not perfect yet and could use some fine-tuning, but it’s totally functional. Cheers, and happy pub hunting! 🍻

Techincal details: made completely in React, used the OSM API, and basically that's it.
