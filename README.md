# A Little Reminder ⭐

Eine kleine, statische Website: ein ruhiger Nachthimmel, eine Sternschnuppe, ein Stern zum Antippen und eine persönliche Nachricht direkt im Sternenhimmel.

Kein Backend, keine Datenbank, kein Tracking, keine externen Anfragen. Alles läuft im Browser und kann kostenlos über **GitHub Pages** gehostet werden.

---

## Projektstruktur

```
a-little-reminder/
├── index.html          Aufbau, Texte, Link-Vorschau (Open Graph)
├── style.css           Gestaltung, Animationen, Mobil-Optimierung
├── script.js           Sternenhimmel, Sternschnuppen, Ablauf der Szenen
├── favicon.svg         Icon im Browser-Tab
├── .nojekyll           sorgt dafür, dass GitHub Pages die Dateien unverändert ausliefert
├── README.md           diese Anleitung
└── assets/
    ├── og-image.jpg    Vorschaubild für WhatsApp (1200 × 630)
    └── fonts/          Cormorant Garamond + Inter (lokal, inkl. Lizenzen)
```

Alle Pfade sind relativ, die Seite funktioniert also auch unter `https://USERNAME.github.io/a-little-reminder/`.

## Ablauf (ca. 8 Sekunden bis zum Stern, danach ca. 6 Sekunden Nachricht)

| Zeit | Szene |
|---|---|
| 0–1 s | Der Sternenhimmel blendet ein (Sterne in drei Tiefenebenen, leichtes Funkeln, violetter Nebel) |
| ~1 s | „Hey, du.“ |
| ~3,3 s | Sternschnuppe von rechts oben |
| ~5 s | „Ich wollte dir etwas schicken …“ |
| ~7 s | Ein Stern in der Mitte leuchtet auf und pulsiert, danach „Tippe auf den Stern.“ |
| Antippen | Der Stern blitzt auf, die Nachricht erscheint Absatz für Absatz |
| Ende | „Take care. ❤️“, Button „Nochmal ansehen“, ab und zu eine ganz leise Sternschnuppe |

Ist auf dem Gerät **„Bewegung reduzieren“** aktiv, ist der Himmel ruhig, es gibt keine Sternschnuppen und alles erscheint schneller.

---

## Auf GitHub Pages veröffentlichen (Schritt für Schritt)

> **Wichtig:** Für das kostenlose GitHub Pages muss das Repository **öffentlich** sein. Jeder mit dem Link zum Repository kann also den Quellcode und damit auch den Text der Nachricht lesen. Schreib keine Passwörter, Adressen, Telefonnummern oder andere private Daten hinein. Der Vorname des Empfängers ist okay, wenn du damit leben kannst, dass er öffentlich ist.

1. **GitHub-Konto anlegen** (falls noch nicht vorhanden): <https://github.com/signup>. Dein Benutzername steht später in der Adresse der Website.
2. **Neues Repository erstellen:** oben rechts auf **+** → **New repository**.
   - Repository name: `a-little-reminder`
   - Sichtbarkeit: **Public**
   - Den Rest so lassen und auf **Create repository** tippen.
3. **Dateien hochladen:** Auf der leeren Repository-Seite auf **uploading an existing file** klicken (oder **Add file → Upload files**).
   - Entpacke vorher das ZIP auf deinem Computer.
   - Ziehe den **Inhalt** des Ordners `a-little-reminder` hinein (also `index.html`, `style.css`, `script.js`, `favicon.svg`, `README.md` und den Ordner `assets`), **nicht** den Ordner selbst. `index.html` muss ganz oben im Repository liegen.
   - Tipp: Im Browser am Computer kannst du Ordner per Drag & Drop hochladen. Wenn `assets` nicht mitkommt, lade die Dateien in einem zweiten Durchgang hoch.
   - Die Datei `.nojekyll` ist versteckt. Fehlt sie, ist das nicht schlimm, die Seite funktioniert trotzdem.
   - Unten auf **Commit changes** tippen.
4. **Settings öffnen:** In der Leiste des Repositorys auf **Settings** (Zahnrad).
5. Links im Menü auf **Pages**.
6. Unter **Build and deployment → Source** die Option **Deploy from a branch** wählen.
7. Unter **Branch** den Branch **main** auswählen.
8. Daneben den Ordner **/ (root)** auswählen.
9. Auf **Save** tippen.
10. **Warten:** Die erste Veröffentlichung dauert meist 1–3 Minuten. Den Fortschritt siehst du unter dem Reiter **Actions** (grüner Haken = fertig).
11. **Adresse finden:** Lade **Settings → Pages** neu. Oben steht dann „Your site is live at …“. Die Adresse hat diese Form:

    ```
    https://USERNAME.github.io/a-little-reminder/
    ```

    `USERNAME` ist dein GitHub-Benutzername (in Kleinbuchstaben).
12. **Auf dem iPhone testen**, siehe Checkliste unten.
13. **Per WhatsApp verschicken**, siehe unten.

### Link-Vorschau einrichten (einmalig, ca. 1 Minute)

Damit WhatsApp das Vorschaubild anzeigt, braucht es die **vollständige** Adresse. Öffne im Repository `index.html` → Stift-Symbol (**Edit**) und ersetze in diesen zwei Zeilen `USERNAME` durch deinen GitHub-Benutzernamen:

```html
<meta property="og:url" content="https://USERNAME.github.io/a-little-reminder/">
<meta property="og:image" content="https://USERNAME.github.io/a-little-reminder/assets/og-image.jpg">
```

Dann **Commit changes**. Die Seite selbst funktioniert auch ohne diesen Schritt, nur die Vorschau zeigt dann kein Bild.

Prüfen: Öffne `https://USERNAME.github.io/a-little-reminder/assets/og-image.jpg` im Browser. Wenn das Bild erscheint, passt es.

---

## Checkliste: Test auf dem iPhone

Vor dem Verschicken einmal selbst durchklicken:

- [ ] Link in **Safari** öffnen: Der Himmel erscheint ohne weißes Aufblitzen.
- [ ] „Hey, du.“ ist mittig und gut lesbar.
- [ ] Die Sternschnuppe ist zu sehen (bei „Bewegung reduzieren“ absichtlich nicht).
- [ ] Der Stern in der Mitte pulsiert, „Tippe auf den Stern.“ erscheint.
- [ ] Ein Tipp auf den Stern (auch knapp daneben) öffnet die Nachricht.
- [ ] Alle Absätze erscheinen nacheinander, nichts ist abgeschnitten, kein seitliches Scrollen.
- [ ] Ganz unten: „Take care. ❤️“ und „Nochmal ansehen“; der Button startet alles neu, ohne dass die Seite neu lädt.
- [ ] Doppeltippen zoomt nicht ungewollt hinein.
- [ ] Gleiches einmal **aus WhatsApp heraus** testen: Link an dich selbst schicken (Chat „Du“ / eigene Nummer) und antippen.
- [ ] Optional: Hochformat ↔ Querformat drehen, die Seite bleibt benutzbar.
- [ ] Optional: Einstellungen → Bedienungshilfen → Bewegung → **Bewegung reduzieren** an: ruhige Version erscheint, Nachricht kommt schneller.
- [ ] Optional: Android/Chrome, falls vorhanden.

---

## Per WhatsApp teilen

1. Adresse kopieren: `https://USERNAME.github.io/a-little-reminder/` (mit echtem Benutzernamen).
2. In WhatsApp in den Chat einfügen. **Kurz warten**, bis die Vorschau mit Bild erscheint, dann senden.
3. Beim Antippen öffnet WhatsApp die Seite im eingebauten Browser (iPhone: Safari-Ansicht, Android: Chrome-Ansicht). Das ist so gewollt und funktioniert ohne Login oder Installation.

**Vorschau sieht alt aus oder fehlt?** WhatsApp speichert Vorschauen zwischen. Nach Änderungen kann es dauern, bis die neue Vorschau erscheint. Trick: Hänge beim Senden `?v=2` an die Adresse (`…/a-little-reminder/?v=2`). Die Seite ist dieselbe, WhatsApp lädt die Vorschau aber neu.

---

## Nachricht später ändern

Alle Texte stehen in **`index.html`**. Im Repository: Datei anklicken → Stift-Symbol → ändern → **Commit changes**. Nach 1–2 Minuten ist die neue Version online (im Browser ggf. neu laden).

- Begrüßung: `<h1 class="hello fade" …>Hey, du.</h1>`
- Zweite Zeile: `<p class="subline fade" …>Ich wollte dir etwas schicken …</p>`
- Hinweis: `<p class="hint fade" …>Tippe auf den Stern.</p>`
- Nachricht: jeder Absatz ist eine Zeile `<p class="line">…</p>` im Bereich `id="messageText"`.
  - Absatz hinzufügen: eine Zeile `<p class="line">Neuer Text.</p>` kopieren und einfügen. Er erscheint automatisch in der richtigen Reihenfolge.
  - Die besonderen Klassen `line--lead` (erste, große Zeile), `line--pause` (kleine Pause davor, etwas gedämpfter) und `line--smile` (kursiv) können bleiben oder entfernt werden.
- Schlusszeile: `<p class="line line--signoff">Take care.&nbsp;❤️</p>`
- `&nbsp;` ist ein geschütztes Leerzeichen, damit das Herz nicht allein in die nächste Zeile rutscht.
- Den Text im `<noscript>`-Bereich nur ändern, wenn du willst, dass er auch ohne JavaScript stimmt (betrifft praktisch niemanden).

**Tempo ändern:** Oben in `script.js` im Block `TIMING` (Werte in Millisekunden), z. B. `lineStep: 750` für den Abstand zwischen den Absätzen.

**Titel/Beschreibung der Vorschau:** in `index.html` bei `<title>`, `description`, `og:title`, `og:description`.

---

## Lokal ansehen (optional)

`index.html` per Doppelklick öffnen reicht meist aus. Falls Schriften fehlen, liegt das an Browser-Einschränkungen für lokale Dateien; online auf GitHub Pages tritt das nicht auf.

## Technik in Kürze

- HTML, CSS und Vanilla JavaScript, ohne Framework, ohne Build-Schritt.
- Sterne und Sternschnuppen: **ein** `<canvas>` mit vorgerenderten Leuchtpunkten, ein `requestAnimationFrame`-Loop, pausiert automatisch, wenn der Tab im Hintergrund ist. Bildschirmauflösung auf 2× begrenzt (schont den Akku).
- Nebel: zwei weichgezeichnete CSS-Verläufe, die sehr langsam wandern.
- Mobil: `100dvh`, `viewport-fit=cover`, `env(safe-area-inset-*)`, `clamp()`-Schriftgrößen, `touch-action: manipulation` gegen Doppeltipp-Zoom, Touch-Ziel des Sterns 88 × 88 px.
- Barrierefreiheit: Der Stern ist ein echter `<button>` (Tab + Enter/Leertaste), bei Tastaturbedienung springt der Fokus danach zur Nachricht, `prefers-reduced-motion` wird beachtet.
- Schriften: Cormorant Garamond und Inter, lokal eingebunden (SIL Open Font License, siehe `assets/fonts/`), mit System-Schriften als Fallback.
