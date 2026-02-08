# Twitter Clone (tanuló projekt)

Egyszerű, oktatási célú **Node.js / Express** alapú “Twitter-klón” projekt. A cél a backend alapok (routing, middleware,
session, view engine), valamint a fájlfeltöltés és az adatkezelés gyakorlása.

## Fő technológiák

- **Node.js + Express**
- **EJS** (szerveroldali templating)
- **express-session** (munkamenet / bejelentkezés-állapot)
- **express-flash-message** (flash üzenetek)
- **LokiJS** (fájl-alapú, egyszerű adatbázis jellegű tárolás)
- **multer** (fájlfeltöltés)
- **uuid** (azonosítók)
- **slugify** (URL-barát azonosítók)
- Fejlesztéshez: **nodemon**

> Megjegyzés: Ez a projekt tanulási célból készült, nem production-használatra.

## Követelmények

- **Node.js** (ajánlott: LTS)
- **npm**

## Telepítés

```
bash
npm install
```

## Futtatás

### Fejlesztői mód (ajánlott)

```
bash
npm run dev
```

### Normál indítás

```
bash
npm start
```

## Használat (általános)

- A szerver indítása után nyisd meg a böngészőben a projektet, jellemzően:
    - `http://localhost:<PORT>`
- A `PORT` értéke a kódban vagy környezeti változóban lehet megadva.

## Projektstruktúra (röviden)

- `index.js` – belépési pont, Express app indítása
- `router/` – útvonalak (route-ok)
- `middleware/` – egyedi middleware-ek
- `services/` – üzleti logika / segédszolgáltatások
- `views/` – EJS nézetek (templating)
- `upload/` – feltöltött fájlok célkönyvtára
- `database.db` – LokiJS adatfájl (helyi tárolás)

## Adatkezelés

A projekt lokális fájl-alapú tárolást használ (`database.db`). Ez kényelmes tanuláshoz, de:

- nem skálázódik jól,
- éles környezetben adatbázis-szerver (pl. PostgreSQL) javasolt.

## Licenc

Tanuló projekt – ha szeretnéd, szabadon felhasználható

---
