# azimuth 
open-source, cozy web-based geoguessr esque game made for flavortown!

---
# how to play
1. go to https://luci.ditherdude.dev/ or http://localhost:5173/ if you're hosting locally (steps below!)
2. look around, check out signage, and make a guess on where you are.
3. once you wanna make a guess go to the map on the bottom right (hold and drag to expand), and click where you think you are, then press guess!
4. once you've guessed you'll get points (based on how close you were to the destination), and also where the destination was.
5. click next round and repeat!

---
# good to know
- you can view how many rounds you've played at the top left
- change your google maps api key at the top right! (or in your .env file)
---
# how to run
1. download the repo
2. ```cd <directory of the downloaded repo>```
3. Copy `.env.example` to a new file named `.env` and add your Google Maps API Key.
4. ```npm install```
5. ```npm run dev```

*Note: If no API key is provided in the .env file, you can still enter one manually via the in-game settings menu.
