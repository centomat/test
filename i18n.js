/* Lucky Shutdown - Sprachumschalter (Standard Deutsch, umschaltbar auf Englisch)
   ---------------------------------------------------------------------------
   Framework-frei, wie der Rest der Website. Deutsch steht als Original bereits
   im HTML - nur die englischen Texte liegen hier im Woerterbuch. Beim ersten
   Laden wird das deutsche Original aus dem DOM gesichert (innerHTML bzw.
   Attributwert) und beim Zurueckschalten unveraendert wiederhergestellt, damit
   keine zweite Quelle fuer den deutschen Text gepflegt werden muss.

   Markup-Konvention:
   - data-i18n="key"            -> Inhalt (innerHTML) des Elements
   - data-i18n-alt="key"        -> alt-Attribut
   - data-i18n-aria-label="key" -> aria-label-Attribut
   - data-i18n-placeholder="key"-> placeholder-Attribut
   - data-i18n-title="key"      -> title-Attribut (Browser-Tab, via <body data-page>)

   <body data-page="index"> waehlt den Browser-Tab-Titel. */

(function () {
  'use strict';
  var LANG_KEY = 'ls-lang';

  var EN = {
    /* ---- Navigation (alle Seiten) ---- */
    'nav.rules': 'Rules',
    'nav.cards': 'All Cards',
    'nav.online': 'Play Online',
    'nav.buy': 'Coming Soon',
    'nav.menuLabel': 'Menu',
    'lang.ariaLabel': 'Choose language',

    /* ---- Footer (alle Seiten) ---- */
    'footer.buyLink': 'Buy',
    'footer.imprint': 'Imprint',


    /* ---- Datenschutz (datenschutz.html) ---- */
    'dsg.title': 'Privacy policy',
    'dsg.lede': 'Here you can read which personal data is processed when you visit this website and how we handle it.',
    'dsg.h1': '1. Controller',
    'dsg.controller': 'The controller for data processing on this website is Vincent Kamin, Vantoro Games, Rochusweg 41, 33102 Paderborn, Germany, email: <a href="mailto:info@lucky-shutdown.com">info@lucky-shutdown.com</a>.',
    'dsg.h2': '2. In brief',
    'dsg.brief': 'This website is deliberately simple: there are <strong>no cookies</strong>, <strong>no user accounts</strong>, <strong>no forms</strong>, <strong>no advertising</strong> and <strong>no analytics or tracking services</strong>. No fonts, scripts or images are loaded from third-party servers.',
    'dsg.h3': '3. Hosting (GitHub Pages)',
    'dsg.hosting1': 'The website is delivered via <strong>GitHub Pages</strong> (provider: GitHub Inc., USA). When you visit the page, the hosting provider processes technically necessary connection data, in particular your <strong>IP address</strong>, the date and time of the request, the requested page, the amount of data transferred, and browser and operating-system information, in order to deliver the page and keep it secure. We ourselves have no access to this data and do not evaluate it.',
    'dsg.hosting2': 'The legal basis is our legitimate interest in providing the website securely and reliably (Art. 6(1)(f) GDPR). As GitHub is based in the USA, data may be transferred to the USA; the provider relies on safeguards such as the EU-US Data Privacy Framework or standard contractual clauses. More in <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub’s privacy statement</a>.',
    'dsg.h4': '4. Domain name service (Cloudflare)',
    'dsg.dns': 'The domain <em>lucky-shutdown.com</em> is managed through the DNS service of <strong>Cloudflare</strong> (Cloudflare, Inc., USA). Cloudflare answers the request which server belongs to the domain. The page content itself does not pass through Cloudflare. The legal basis is Art. 6(1)(f) GDPR (reliable operation of the domain). More information: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare’s privacy policy</a>.',
    'dsg.h5': '5. Contact by email',
    'dsg.mail': 'If you email us, we process your sender address, the content of your message and the time of the message in order to handle your request (Art. 6(1)(b) or (f) GDPR). Emails are stored with <strong>Zoho Mail</strong> in data centres in the EU (<a href="https://www.zoho.com/privacy.html" target="_blank" rel="noopener">Zoho’s privacy policy</a>). We delete your message once your request has been dealt with and no statutory retention obligations apply.',
    'dsg.h6': '6. Language setting in your browser',
    'dsg.lang': 'When you switch the language (German/English) at the top, the website saves your choice in your browser’s local storage so that it is kept on your next visit. It is not a cookie, the value is not sent to us and it contains no personal data. You can delete it at any time in your browser settings.',
    'dsg.h7': '7. Your rights',
    'dsg.rights': 'Under the GDPR you have the right of <strong>access</strong> (Art. 15), <strong>rectification</strong> (Art. 16), <strong>erasure</strong> (Art. 17), <strong>restriction of processing</strong> (Art. 18), <strong>data portability</strong> (Art. 20) and <strong>objection</strong> to processing based on legitimate interests (Art. 21). Simply contact us by email.',
    'dsg.h8': '8. Right to lodge a complaint',
    'dsg.complaint': 'You can lodge a complaint with a data protection supervisory authority. The authority responsible for us is the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia (<a href="https://www.ldi.nrw.de" target="_blank" rel="noopener">www.ldi.nrw.de</a>).',
    'dsg.h9': '9. Updates',
    'dsg.updated': 'As of: October 2026. If we add new features to the website (e.g. a shop or the online version), we will update this policy.',

    /* ---- Impressum (impressum.html) ---- */
    'imp.title': 'Imprint',
    'imp.lede': 'Information pursuant to § 5 German Digital Services Act (DDG)',
    'imp.provider': 'Provider',
    'imp.owner': 'Owner: Vincent Kamin',
    'imp.country': 'Germany',
    'imp.contact': 'Contact',
    'imp.email': 'Email:',
    'imp.back': 'Back to the home page',
    'footer.privacy': 'Privacy policy',

    /* ---- Alt-Texte fuer Kartenbilder (mehrfach verwendet) ---- */
    'alt.zahl21': 'Number card 21',
    'alt.15': 'Card 15, Magic Lock',
    'alt.17': 'Card 17, Colour Lock',
    'alt.19': 'Card 19, Skip',
    'alt.res': 'Magic card RESET',
    'alt.pss': 'Magic card PASS',
    'alt.wld': 'Magic card WILD',
    'alt.udc': 'Magic card UNDER',
    'alt.boxFront': 'Packaging front',
    'alt.boxBack': 'Packaging back',

    /* ================= Kartenfunktionen (nur noch im Abschnitt "Alle Karten" - die
       Spielregeln verweisen jetzt dorthin statt sie zu duplizieren)
       ================= */
    'cardfn.label.count': 'Copies in the deck',
    'cardfn.label.fn': 'Function',
    'cardfn.label.playable': 'When playable',
    'cardfn.label.after': 'What happens next',
    'cardfn.label.special': 'Important special rule',

    'cardfn.count.zahl': '4× per value (2× orange + 2× blue)',
    'cardfn.count.four': '4× (2× orange + 2× blue)',
    'cardfn.count.three': '3× (orange, blue, dual-colour)',
    'cardfn.count.udc': '1× per value (16/17/18)',

    'cardfn.zahl.title': 'Number cards 13, 14, 16, 18, 20, 21',
    'cardfn.zahl.type': 'Number card',
    'cardfn.zahl.fn': 'The basic building block. A number card only counts by its value and has no extra effect.',
    'cardfn.playableStandard': 'If its value is <strong>equal to or higher</strong> than the top card.',
    'cardfn.zahl.after': 'The next player must match or beat this value – or play a magic card.',
    'cardfn.zahl.special': 'You may play <strong>several cards of the same value</strong> in one turn (2–4 cards). Colour does not matter here.',

    'cardfn.15.title': 'The 15 – Magic Lock',
    'cardfn.typeNumberWithEffect': 'Number card with effect',
    'cardfn.15.fn': 'Locks out <strong>all</strong> magic cards while the 15 is on top.',
    'cardfn.15.after': 'The next player may <strong>not play any magic card</strong>.',
    'cardfn.15.special': 'The lock is absolute. Magic cards are only allowed again once a different card is on top.',

    'cardfn.17.title': 'The 17 – Colour Lock',
    'cardfn.17.fn': 'Sets a <strong>required colour</strong> for as long as the 17 is on top – orange or blue, depending on the colour of the 17.',
    'cardfn.17.after': 'The next player may <strong>only play cards of the required colour</strong> (or dual-colour cards). The value does not matter here – <strong>lower</strong> cards are allowed too. If someone plays another 17, its colour applies to the next player from then on.',
    'cardfn.17.special': 'The colour lock applies <strong>without exception to every card</strong> – including every magic card. Only cards with the required colour, or dual-colour cards, may be played. If you play several matching cards together, <strong>only one of them</strong> needs the required colour – the rest may be a different colour, as long as they share the same value. Example: on an orange 17 you may play an orange 19 together with two blue 19s.',

    'cardfn.19.title': 'The 19 – Skip',
    'cardfn.19.fn': 'The next player <strong>skips a turn</strong>.',
    'cardfn.19.after': 'The next player is skipped. <strong>Several 19s played together</strong> skip that many players. The player after that must play at least a 19 (or magic).',
    'cardfn.19.special': 'If you would have to skip but can also play a 19 (from your hand; face-up ones only with an empty hand), you <strong>may play it</strong>. The skip then moves on – and the next player skips instead.',

    'cardfn.res.title': 'RESET',
    'cardfn.typeMagic': 'Magic card',
    'cardfn.res.fn': 'Removes the <strong>entire discard pile</strong> from play.',
    'cardfn.res.playable': 'Almost always – <strong>except</strong> when a 15 is on top (magic lock). Under a colour lock, the card must match the required colour or be dual-colour.',
    'cardfn.res.after': 'The discard pile is gone and you <strong>start a new turn</strong> with any card – without drawing first (only with an empty hand do you draw up to 3 cards).',

    'cardfn.pss.title': 'PASS',
    'cardfn.pss.fn': 'Passes the current requirement on to the <strong>next player</strong>, without you having to meet it yourself.',
    'cardfn.pss.playable': 'Almost always – <strong>except</strong> when a 15 is on top. Under a colour lock, the card must match the colour or be dual-colour.',
    'cardfn.pss.after': 'The card <strong>underneath</strong> the PASS stays in effect. The next player must still beat that exact card – or skip, if it is a 19 underneath.',

    'cardfn.wld.title': 'WILD',
    'cardfn.wld.fn': 'Lifts <strong>all restrictions</strong> for the next player.',
    'cardfn.wld.playable': 'Almost always – <strong>except</strong> when a 15 is on top. Under a colour lock, the WILD card <strong>itself</strong> must match the required colour or be dual-colour.',
    'cardfn.wld.after': 'The next player may play <strong>any</strong> card – any value, any colour.',

    'cardfn.udc.title': 'UNDER (values 16, 17, 18)',
    'cardfn.udc.fn': 'Forces the next player to play <strong>lower</strong> instead of higher.',
    'cardfn.udc.playable': 'Almost always – <strong>except</strong> when a 15 is on top. Each UNDER card has a <strong>fixed colour</strong> (16&nbsp;blue, 17&nbsp;dual-colour, 18&nbsp;orange); under a colour lock, whether it matches matters.',
    'cardfn.udc.after': 'The next player must play a number <strong>lower than the printed value</strong> (for UNDER&nbsp;16 that is 13, 14 or 15) – or a magic card. <strong>Several UNDER cards together:</strong> the one on top (played last) counts.',

    /* ================= index.html ================= */
    'idx.hero.tagline': 'The fast-paced discard card game for 2–5 players: play smart, force colours, unleash magic cards at the perfect moment – and be the first to get rid of all your cards.',
    'idx.hero.box3dLabel': '3D view of the packaging, drag to rotate',
    'idx.hero.dragHint': 'Drag to rotate',
    'idx.hero.cta.howto': 'How a game works',
    'idx.hero.cta.rules': 'Rules',
    'idx.hero.cta.cards': 'View all cards',

    'idx.ablauf.eyebrow': 'In 30 seconds',
    'idx.ablauf.title': 'How a game works',
    'idx.ablauf.lede': 'The basic idea is explained in half a minute. The finer points are in the rules.',
    'idx.step1.h': 'Get rid of your cards',
    'idx.step1.p': 'Everyone starts with 3 face-down, 3 face-up and 3 hand cards. Whoever plays everything first wins.',
    'idx.step2.h': 'Equal or higher',
    'idx.step2.p': 'In turn, you play onto the discard pile – at least as high as the top card, or a magic card.',
    'idx.step3.h': 'Anything can turn around',
    'idx.step3.p': 'Force a colour, lock out magic, skip a player, RESET: the special cards can flip any situation.',
    'idx.step4.h': 'Cannot play? Pick up',
    'idx.step4.p': 'If you cannot play anything, you pick up the whole discard pile. Whoever is left holding cards loses the game.',
    'idx.ablauf.linkAll': 'Read the full rules',

    'idx.physisch.eyebrow': 'Physical &amp; digital',
    'idx.physisch.title': 'One deck, 48 cards, real tabletop feel – or would you rather play on screen?',
    'idx.physisch.lede': 'Lucky Shutdown comes in two forms: to hold at the table – shuffle, deal, play – or digitally, whichever you prefer.',
    'idx.path1.kicker': 'Physical version',
    'idx.path1.h': 'Play at the table',
    'idx.path1.p': 'The complete rules for the physical version – setup, turns and special cases. Structured for quick lookup.',
    'idx.path1.li1': 'Step-by-step setup',
    'idx.path1.li2': 'Every card explained the same way',
    'idx.path1.li3': '“Quick summary” plus expandable details',
    'idx.path1.btn': 'Go to the rules',
    'idx.path2.kicker': 'Web app',
    'idx.path2.h': 'Play online',
    'idx.path2.badge': 'coming soon',
    'idx.path2.p': 'The digital version of Lucky Shutdown – its own experience with guided turns. Perfect for learning the rules or playing without a physical deck.',
    'idx.path2.li1': 'Guides you through each turn step by step',
    'idx.path2.li2': 'Against the computer or with others',
    'idx.path2.li3': 'No installation – runs in the browser',
    'idx.path2.btn': 'Coming soon',


    'idx.buy.title': 'Buy Lucky Shutdown',
    'idx.buy.p': 'The physical edition is coming soon. Questions? Send us an email.',
    'idx.buy.cta': 'Ask by email',
    'idx.buy.note': 'Shop coming soon – this area is reserved for the future checkout',


    /* Wie oft jede Karte im Deck vorkommt - dieselben Keys werden auf
       Startseite und Kartenabschnitt fuer dieselbe Karte wiederverwendet,
       da der Text dort identisch ist. */

    /* ================= Abschnitt "Alle Karten" ================= */


    'krt.deckNote': 'The deck contains 48 cards in two colours – orange and blue; some cards are dual-colour and count for both.',
    'krt.cardfnHead.eyebrow': 'Card functions',
    'krt.cardfnHead.title': 'How each card works',
    'krt.cardfnHead.lede': 'The same explanation as in the rules – for quick reference right here.',
    'krt.fullRulesBtn': 'Go to the full rules',

    /* ================= Abschnitt "Spielregeln" ================= */
    'rgl.pageTitle': 'Rules',
    'rgl.pageLede': 'Everything you need for a game with the physical card game – from setup to the very last card.',

    'rgl.quick.title': 'Quick summary',
    'rgl.quick.1': '<strong>Goal:</strong> Be the first to get rid of all your cards. Whoever is left holding cards last loses the game.',
    'rgl.quick.2': '<strong>Setup:</strong> Everyone has 3 face-down, 3 face-up and 3 hand cards. The rest is the draw pile.',
    'rgl.quick.3': '<strong>Your turn:</strong> Play a card (or several matching ones) onto the discard pile – <strong>equal to or higher</strong> than the top card, or a <strong>magic card</strong>.',
    'rgl.quick.4': '<strong>Then:</strong> Refill your hand back up to 3 cards. Play passes clockwise to the next player.',
    'rgl.quick.5': '<strong>Cannot play anything?</strong> Pick up the entire discard pile.',
    'rgl.quick.6': '<strong>Winning:</strong> First empty your hand, then the face-up, then the face-down cards. Whoever gets rid of everything first has won.',

    'rgl.jump.a': 'Goal',
    'rgl.jump.b': 'Setup',
    'rgl.jump.c': 'Turns',
    'rgl.jump.e': 'Special Cases',
    'rgl.jump.f': 'End of the Game',
    'rgl.ariaLabel.sections': 'Rule sections',

    'rgl.a.title': 'The Goal of the Game',
    'rgl.a.lede': 'Lucky Shutdown is a discard game for <strong>2 to 5 players</strong>. Whoever runs out of cards first is among the winners.',
    'rgl.a.p1': 'In turn, you play cards onto a shared <span class="term">discard pile</span>. Each card must be <strong>at least as high</strong> as the last one played – or a <span class="term">magic card</span>, which briefly changes the rules. Anyone who cannot play must pick up the whole discard pile and carries those cards forward.',
    'rgl.a.p2': 'Each player gets rid of their cards in three waves: first the <strong>hand cards</strong>, then the <strong>three face-up table cards</strong>, and finally the <strong>three face-down table cards</strong>. As soon as someone has played everything, they are done. The others keep playing. <strong>The last player left holding cards loses the game</strong> and sets up the next one. There is no draw.',

    'rgl.b.title': 'Setting Up',
    'rgl.b.step1': '<strong>Shuffle.</strong> Shuffle all 48 cards thoroughly.',
    'rgl.b.step2': '<strong>Deal the face-down table cards.</strong> Give each player <strong>3 cards face down</strong>. They are placed in front of the player and <strong>not looked at</strong>.',
    'rgl.b.step3': '<strong>Deal the remaining hand cards.</strong> Then give each player <strong>6 more cards</strong>. You may look at your own.',
    'rgl.b.step4': '<strong>Choose the face-up table cards.</strong> Each player picks <strong>3</strong> of these 6 cards and places them <strong>face up on top of the 3 face-down cards</strong>. The remaining 3 cards stay as your <strong>starting hand</strong>.',
    'rgl.b.step5': '<strong>Form the draw pile.</strong> All undealt cards form the face-down <span class="term">draw pile</span>. Next to it there is room for the <span class="term">discard pile</span> – which starts empty.',
    'rgl.b.step6': '<strong>Determine the starting player.</strong> In the first game, whoever holds the <strong>lowest regular number card</strong> starts (magic cards do not count; in case of a tie, you decide who starts); he does not have to play that card. From the second game on, the player <strong>to the right of the previous loser</strong> always starts – so the loser plays last.',
    'rgl.b.resultChip': 'Per player at the start: 3 face-down · 3 face-up · 3 in hand',

    'rgl.c.title': 'Taking a Turn',
    'rgl.c.lede': 'Play goes in turn, <strong>clockwise</strong>. When it is your turn, you go through the steps in order – <strong>play or pick up</strong> (step 2 or 3), then refill.',
    'rgl.c.step1': '<strong>Check what is on top.</strong> The top card of the discard pile determines what you are allowed to play. If the pile is empty, you may play any card.',
    'rgl.c.step2': '<strong>Play one card, or several matching cards.</strong> Colour does not matter – what counts is the same value for number cards, or the same effect for magic cards. The three UNDER cards also count as “matching” and can be played together.',
    'rgl.c.step3': '<strong>Or pick up the discard pile.</strong> If you cannot (or do not want to) play, you take <strong>all</strong> the cards from the discard pile into your hand. The next player then opens a new discard pile. You cannot pick up an <strong>empty</strong> pile – in that case you must play.',
    'rgl.c.step4': '<strong>Refill your hand.</strong> If you have fewer than 3 cards in hand after your turn, draw from the draw pile until you have 3 again – as long as the draw pile still has cards.',
    'rgl.c.step5': '<strong>The next player goes</strong> – clockwise.',

    'rgl.c.matrix.k1': 'On top … nothing (also after a RESET)',
    'rgl.c.matrix.anyCard': 'Play <strong>any</strong> card.',
    'rgl.c.matrix.k2': '… a number (e.g. 16)',
    'rgl.c.matrix.v2': 'Play a number <strong>16 or higher</strong> – or a magic card.',
    'rgl.c.matrix.k3': '… a 15 (magic lock)',
    'rgl.c.matrix.v3': 'Only a number <strong>15 or higher</strong>. <strong>No</strong> magic card.',
    'rgl.c.matrix.k4': '… a 17 (colour lock)',
    'rgl.c.matrix.v4': 'Play a card of the <strong>shown colour</strong> (value does not matter, even lower) – or a magic card of that colour.',
    'rgl.c.matrix.k5': '… a 19 (skip)',
    'rgl.c.matrix.v5': 'Whoever would be <strong>directly next</strong> skips – unless they play a 19 themselves. After that: at least a 19 or magic.',
    'rgl.c.matrix.kPass': '… a PASS',
    'rgl.c.matrix.vPass': 'The <strong>card underneath</strong> counts.',
    'rgl.c.matrix.k6': '… a WILD',
    'rgl.c.matrix.k7': '… an UNDER (e.g. 16)',
    'rgl.c.matrix.v7': 'Play a number <strong>lower than 16</strong> – or a magic card.',

    'rgl.e.title': 'Special Cases &amp; Important Rules',
    'rgl.e.lede': 'Situations that come up during a game but do not belong in the normal flow. Expand when you need them.',

    'rgl.e.d1.summary': 'Four-of-a-kind &amp; Triple – the pile disappears',
    'rgl.e.d1.p1': 'If <strong>four identical number cards</strong> (colour does not matter) end up directly on top of each other on the discard pile (a <span class="term">four-of-a-kind</span>), the entire discard pile is removed – this includes four 19s (nobody skips).',
    'rgl.e.d1.p2': 'The same applies to a <span class="term">triple</span> of magic cards: <strong>3× RESET</strong>, <strong>3× PASS</strong>, <strong>3× WILD</strong>, or the three different <strong>UNDER</strong> cards (16 + 17 + 18).',
    'rgl.e.d1.subhead': 'After that',
    'rgl.e.d1.p3': 'The player who played the completing card <strong>immediately starts a new turn</strong> with any card – without drawing first (only with an empty hand do you draw up to 3 cards).',
    'rgl.e.d1.p4': 'A four-of-a-kind/triple can happen in <strong>one turn</strong> (you play all the cards yourself) or across several turns – including as a quick reaction (see below).',

    'rgl.e.d2.summary': 'Quick Reaction – Grab the four-of-a-kind or triple!',
    'rgl.e.d2.p1': 'If <strong>three matching cards</strong> are already on the pile and you are only missing the fourth for a four-of-a-kind, <strong>any player</strong> may immediately add the matching card – <strong>even if it is not their turn</strong>. The same applies if only one or two cards are on the pile and a player holds <strong>all</strong> the missing matching cards – they then play them all at once (same for a triple). You may react with <strong>hand cards</strong>; face-up table cards only if you have no hand cards left; face-down cards never.',
    'rgl.e.d2.p2': 'That completes the four-of-a-kind or triple: the entire pile is removed, you immediately get the next turn (drawing only with an empty hand), and play then continues to your left.',
    'rgl.e.d2.p3': 'Be quick and pay attention: once the regular next player has played a different card, the chance is gone.',

    'rgl.e.d3.summary': 'Colour Lock',
    'rgl.e.d3.p1': 'As long as a <strong>17</strong> is on top, only the colour counts – not the value. So you may also play <strong>lower</strong> cards, as long as the colour matches.',
    'rgl.e.d3.li1': '<strong>Dual-colour cards</strong> satisfy any required colour.',
    'rgl.e.d3.li2': 'If you play several matching cards, only <strong>one of them</strong> needs the required colour. The rest may be a different colour, as long as they share the same value. Example: on an orange 17 you may play an orange 19 together with two blue 19s. A single card of the wrong colour on its own is still forbidden.',
    'rgl.e.d3.li3': 'The colour lock applies <strong>without exception</strong> – including <strong>every magic card</strong>.',
    'rgl.e.d3.li4': 'If several 17s are on the pile, the colour of the <strong>topmost</strong> one (played last) applies.',

    'rgl.e.d4.summary': 'Skip – the Chain',
    'rgl.e.d4.p1': 'A <strong>19</strong> makes the next player skip a turn. Play two 19s and two players skip – and so on.',
    'rgl.e.d4.p2': 'If <strong>you yourself</strong> would have to skip, you may play a 19 instead – from your hand; face-up 19s only once your hand is empty. Your own skip is cancelled, and the next player skips instead. <strong>Example</strong> (A, B, C, D): A plays a 19, B plays a 19 as well instead of skipping → only C skips, D is up (at least 19 or magic).',

    'rgl.e.d5.summary': 'From Hand to Table Cards',
    'rgl.e.d5.p1': 'You play your cards in this order:',
    'rgl.e.d5.o1': '<strong>Hand cards.</strong> As long as you have hand cards, you only play from your hand.',
    'rgl.e.d5.o2': '<strong>Face-up table cards.</strong> Only once your hand <em>and</em> the draw pile are empty do you play your 3 face-up table cards.',
    'rgl.e.d5.o3': '<strong>Face-down table cards.</strong> Once the face-up ones are gone too, you turn over <strong>one face-down card blind</strong> per turn and must play it immediately.',
    'rgl.e.d5.o3sub1': 'If it fits → it is played, the turn continues normally.',
    'rgl.e.d5.o3sub2': 'If it does not fit → it goes into your hand and you <strong>pick up the discard pile</strong>. You must then empty your hand again before returning to your table cards.',
    'rgl.e.d5.combo': '<strong>Combo turn:</strong> Your last hand card(s) may be played together with matching face-up table cards in <strong>one</strong> turn. This is only allowed if it empties your hand completely.',
    'rgl.e.d5.example': 'Example: your last hand card is a 19, you also have a face-up 19 on the table, and the draw pile is empty – then you may play both 19s together in one turn.',

    'rgl.e.d6.summary': 'When You Cannot Play',
    'rgl.e.d6.p1': 'If you cannot play a matching card, <strong>you pick up the entire discard pile</strong> into your hand. The next player then opens a new discard pile.',
    'rgl.e.d6.li1': 'Picking up voluntarily is allowed, even if you could play.',
    'rgl.e.d6.li2': 'You cannot “pick up” an <strong>empty</strong> discard pile – in that case you must play.',

    'rgl.e.d7.summary': 'Optional Rules',
    'rgl.e.d7.p1': 'These two rules are <strong>optional</strong>. Agree together before the game whether you will use them.',
    'rgl.e.d7.sub1': 'Challenge Your Luck',
    'rgl.e.d7.p2': 'Once per game, if you cannot play, you may announce it and <strong>draw the top card of the draw pile and play it blind</strong> straight away, without looking at it first. If it fits → play continues. If it does not → it goes into your hand and you pick up the discard pile.',
    'rgl.e.d7.sub2': 'Early Reveal',
    'rgl.e.d7.p3': 'If you have no hand cards left but still have face-up cards in front of you and cannot play any of them, you may <strong>once per game</strong> reveal and play a face-down card early – but only one that is already exposed (the face-up card on top of it has been played; that is 1–2 cards). If it fits → play continues. If it does not → into your hand, and you pick up the discard pile.',

    'rgl.f.title': 'End of the Game &amp; Winners',
    'rgl.f.lede': 'A game ends as soon as only one player still has cards.',
    'rgl.f.step1': '<strong>Finishing.</strong> Whoever plays their very last card – from hand, face-up or face-down table cards – is done and leaves the current game.',
    'rgl.f.step2': '<strong>The loser.</strong> As soon as only <strong>one</strong> player still has cards, that player loses the game.',
    'rgl.f.step3': '<strong>Next game.</strong> The loser shuffles and deals the next game. The player <strong>to their right</strong> starts.',
    'rgl.f.final': 'There is no draw.'
  };

  var PAGE_TITLES_EN = {
    index: 'Lucky Shutdown – Card Game',
    impressum: 'Imprint – Lucky Shutdown',
    datenschutz: 'Privacy policy – Lucky Shutdown'
  };

  var ATTRS = ['alt', 'aria-label', 'placeholder'];

  var originals = new WeakMap();
  var originalTitle = document.title;

  function saveOrig(el, field, value) {
    var o = originals.get(el);
    if (!o) { o = {}; originals.set(el, o); }
    o[field] = value;
  }

  function captureOriginals() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      saveOrig(el, 'html', el.innerHTML);
    });
    ATTRS.forEach(function (attr) {
      document.querySelectorAll('[data-i18n-' + attr + ']').forEach(function (el) {
        saveOrig(el, attr, el.getAttribute(attr));
      });
    });
  }

  function applyLanguage(lang) {
    var isEn = lang === 'en';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var orig = originals.get(el);
      if (isEn && EN[key] !== undefined) {
        el.innerHTML = EN[key];
      } else if (orig && orig.html !== undefined) {
        el.innerHTML = orig.html;
      }
    });

    ATTRS.forEach(function (attr) {
      document.querySelectorAll('[data-i18n-' + attr + ']').forEach(function (el) {
        var key = el.getAttribute('data-i18n-' + attr);
        var orig = originals.get(el);
        if (isEn && EN[key] !== undefined) {
          el.setAttribute(attr, EN[key]);
        } else if (orig && orig[attr] !== undefined) {
          el.setAttribute(attr, orig[attr]);
        }
      });
    });

    var page = document.body.getAttribute('data-page');
    if (page) {
      document.title = isEn ? (PAGE_TITLES_EN[page] || originalTitle) : originalTitle;
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    window.dispatchEvent(new CustomEvent('ls:i18n', { detail: { lang: lang } }));
  }

  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* Storage kann blockiert sein - egal */ }
    applyLanguage(lang);
  }

  function getStoredLang() {
    try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
  }

  captureOriginals();
  applyLanguage(getStoredLang() === 'en' ? 'en' : 'de');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.lang-btn');
    if (!btn) return;
    setLang(btn.getAttribute('data-lang'));
  });
})();
