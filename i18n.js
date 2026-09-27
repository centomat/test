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
   - data-i18n-type/-name/-fn/-detail="key" -> dataset-Felder der Rondell-Karten
     (main.js liest cards[i].dataset.type/name/fn/detail fuers Infofeld - nach
     jedem Sprachwechsel wird das Event "ls:i18n" gefeuert, auf das main.js
     hoert, um die Anzeige aufzufrischen).

   <body data-page="index|karten|regeln"> waehlt den Browser-Tab-Titel. */

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
    'footer.newsletterTitle': 'Newsletter',
    'footer.newsletterText': 'Find out when the physical game and the online version are available.',
    'footer.emailPlaceholder': 'Your email',
    'footer.emailAriaLabel': 'Email address',
    'footer.signupButton': 'Sign up',
    'footer.placeholderNote': 'Placeholder – not active yet',
    'footer.imprint': 'Imprint (placeholder)',
    'footer.privacy': 'Privacy policy (placeholder)',

    /* ---- Rondell-Steuerung (index + karten) ---- */
    'carousel.stageLabel': 'Card carousel, drag to browse',
    'carousel.prevLabel': 'Previous card',
    'carousel.nextLabel': 'Next card',
    'carousel.more': 'Learn more',

    /* ---- Alt-Texte fuer Kartenbilder (mehrfach verwendet) ---- */
    'alt.zahl21': 'Number card 21',
    'alt.15': 'Card 15, Colour Lock',
    'alt.17': 'Card 17, Magic Lock',
    'alt.19': 'Card 19, Skip',
    'alt.res': 'Magic card Clear Pile',
    'alt.pss': 'Magic card Pass',
    'alt.wld': 'Magic card Wild',
    'alt.udc': 'Magic card Underbid',
    'alt.back': 'Card back',
    'alt.boxFront': 'Packaging front',
    'alt.boxBack': 'Packaging back',

    /* ================= Kartenfunktionen (nur noch karten.html - die
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

    'cardfn.15.title': 'The 15 – Colour Lock',
    'cardfn.typeNumberWithEffect': 'Number card with effect',
    'cardfn.15.fn': 'Sets a <strong>required colour</strong> – orange or blue, depending on the colour of the 15.',
    'cardfn.15.after': 'The next player may <strong>only play cards of the required colour</strong> (or dual-colour cards). The value does not matter here – <strong>lower</strong> cards are allowed too. If someone plays another 15, its colour applies to the next player from then on.',
    'cardfn.15.special': 'The colour lock applies <strong>without exception to every card</strong> – including every magic card. Only cards with the required colour, or dual-colour cards, may be played. If you play several matching cards together, <strong>only one of them</strong> needs the required colour – the rest may be a different colour, as long as they share the same value. Example: on an orange 15 you may play an orange 19 together with two blue 19s.',

    'cardfn.17.title': 'The 17 – Magic Lock',
    'cardfn.17.fn': 'Locks out <strong>all</strong> magic cards while the 17 is on top.',
    'cardfn.17.after': 'The next player may <strong>not play any magic card</strong>.',
    'cardfn.17.special': 'The lock is absolute. Magic cards are only allowed again once a different card is on top.',

    'cardfn.19.title': 'The 19 – Skip',
    'cardfn.19.fn': 'The next player <strong>skips a turn</strong>.',
    'cardfn.19.after': 'The next player is skipped. <strong>Several 19s played together</strong> skip that many players.',
    'cardfn.19.special': 'If you would have to skip but can also play a 19, you <strong>may play it</strong>. The skip then moves on – and the next player skips instead.',

    'cardfn.res.title': 'Clear Pile',
    'cardfn.typeMagic': 'Magic card',
    'cardfn.res.fn': 'Removes the <strong>entire discard pile</strong> from play.',
    'cardfn.res.playable': 'Almost always – <strong>except</strong> when a 17 is on top (magic lock). Under a colour lock, the card must match the required colour or be dual-colour.',
    'cardfn.res.after': 'The discard pile is gone and you <strong>start a new turn</strong> with any card.',

    'cardfn.pss.title': 'Pass',
    'cardfn.pss.fn': 'Passes the current requirement on to the <strong>next player</strong>, without you having to meet it yourself.',
    'cardfn.pss.playable': 'Almost always – <strong>except</strong> when a 17 is on top. Under a colour lock, the card must match the colour or be dual-colour.',
    'cardfn.pss.after': 'The card <strong>underneath</strong> the Pass stays in effect. The next player must still beat that exact card – or skip, if it is a 19 underneath.',

    'cardfn.wld.title': 'Wild',
    'cardfn.wld.fn': 'Lifts <strong>all restrictions</strong> for the next player.',
    'cardfn.wld.playable': 'Almost always – <strong>except</strong> when a 17 is on top. Under a colour lock, the Wild card <strong>itself</strong> must match the required colour or be dual-colour.',
    'cardfn.wld.after': 'The next player may play <strong>any</strong> card – any value, any colour.',

    'cardfn.udc.title': 'Underbid (values 16, 17, 18)',
    'cardfn.udc.fn': 'Forces the next player to play <strong>lower</strong> instead of higher.',
    'cardfn.udc.playable': 'Almost always – <strong>except</strong> when a 17 is on top. Each Underbid card has a <strong>fixed colour</strong> (16&nbsp;blue, 17&nbsp;dual-colour, 18&nbsp;orange); under a colour lock, whether it matches matters.',
    'cardfn.udc.after': 'The next player must play a number <strong>lower than the printed value</strong> (for Underbid&nbsp;16 that is 13, 14 or 15) – or a magic card.',

    /* ================= index.html ================= */
    'idx.hero.tagline': 'The fast-paced discard card game for 2–5 players: play smart, force colours, unleash magic cards at the perfect moment – and be the first to get rid of all your cards.',
    'idx.hero.box3dLabel': '3D view of the packaging, drag to rotate',
    'idx.hero.dragHint': 'Drag to rotate',
    'idx.hero.cta.howto': 'How a round works',
    'idx.hero.cta.rules': 'Rules',
    'idx.hero.cta.cards': 'View all cards',

    'idx.ablauf.eyebrow': 'In 30 seconds',
    'idx.ablauf.title': 'How a round works',
    'idx.ablauf.lede': 'The basic idea is explained in half a minute. The finer points are in the rules.',
    'idx.step1.h': 'Get rid of your cards',
    'idx.step1.p': 'Everyone starts with 3 face-down, 3 face-up and 3 hand cards. Whoever plays everything first wins.',
    'idx.step2.h': 'Equal or higher',
    'idx.step2.p': 'In turn, you play onto the discard pile – at least as high as the top card, or a magic card.',
    'idx.step3.h': 'Anything can turn around',
    'idx.step3.p': 'Force a colour, lock out magic, skip a player, clear the pile: the special cards can flip any situation.',
    'idx.step4.h': 'Cannot play? Pick up',
    'idx.step4.p': 'If you cannot play anything, you pick up the whole discard pile. Whoever is left holding cards loses the round.',
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

    'idx.ktTeaser.eyebrow': 'Card overview',
    'idx.ktTeaser.title': 'Get to know the cards',
    'idx.ktTeaser.lede': 'Number cards, three special numbers and the magic cards. Browse the carousel and jump from any card straight to its rule.',
    'idx.ktTeaser.cta': 'View all cards',

    'idx.buy.title': 'Buy Lucky Shutdown',
    'idx.buy.p': 'The physical edition is coming soon. Sign up for the newsletter to be among the first to know when it launches.',
    'idx.buy.cta': 'Get notified',
    'idx.buy.note': 'Shop coming soon – this area is reserved for the future checkout',

    'idx.card.zahl.type': 'Number card',
    'idx.card.zahl.name': 'Number cards 13–21',
    'idx.card.zahl.fn': 'The basic building block. Counts only by its value.',
    'idx.card.typeNumberFn': 'Number card · effect',
    'idx.card.15.name': 'The 15 – Colour Lock',
    'idx.card.15.fn': 'Sets a required colour. The next player may only play that colour – value does not matter.',
    'idx.card.17.name': 'The 17 – Magic Lock',
    'idx.card.17.fn': 'Locks out all magic cards while it is on top of the discard pile.',
    'idx.card.19.name': 'The 19 – Skip',
    'idx.card.19.fn': 'The next player skips a turn. Several 19s = several skips.',
    'idx.card.typeMagic': 'Magic card',
    'idx.card.res.name': 'Clear Pile',
    'idx.card.res.fn': 'Removes the entire discard pile. You immediately start a new turn.',
    'idx.card.pss.name': 'Pass',
    'idx.card.pss.fn': 'Passes the card underneath on to the next player.',
    'idx.card.wld.name': 'Wild',
    'idx.card.wld.fn': 'The next player may play any card.',
    'idx.card.udc.type': 'Magic card · values 16/17/18',
    'idx.card.udc.name': 'Underbid',
    'idx.card.udc.fn': 'Forces the next player to play a number lower than the printed value.',

    /* Wie oft jede Karte im Deck vorkommt - dieselben Keys werden auf
       index.html und karten.html fuer dieselbe Karte wiederverwendet,
       da der Text dort identisch ist. */
    'card.count.zahl': '4× per value in the deck',
    'card.count.four': '4× in the deck',
    'card.count.three': '3× in the deck',
    'card.count.udc': '1× per value in the deck',

    /* ================= karten.html ================= */
    'krt.pageTitle': 'All Cards',
    'krt.pageLede': 'Browse the carousel – every card is explained right below it. Use “Learn more” to jump to the full rule.',

    'krt.card.zahl.type': 'Number card · values 13–21',
    'krt.card.zahl.name': 'Number cards',
    'krt.card.zahl.detail': 'Playable if its value is equal to or higher than the top card of the discard pile. You may play 1–4 cards of the same value together, colour does not matter. The values 13, 14, 16, 18, 20 and 21 have no special function – only 15, 17 and 19 do.',
    'krt.card.typeNumberWithEffect': 'Number card with effect',
    'krt.card.15.fn': 'Sets a required colour – the next player may only play that colour.',
    'krt.card.15.detail': 'After a 15, only the colour counts, not the value – lower cards are allowed too. Dual-colour cards always fit. The colour lock applies without exception, even to every magic card. If you play several matching cards, only one of them needs to match the colour – e.g. an orange 19 together with two blue 19s. If several 15s are played, the colour of the topmost one applies.',
    'krt.card.17.detail': 'The next player may only play a number 17 or higher – and no magic card either. Magic cards are free again only once a different card is on top.',
    'krt.card.19.fn': 'The next player skips a turn.',
    'krt.card.19.detail': 'Several 19s played together skip that many players. If you would have to skip but can also play a 19, you may play it – the skip then moves on and the next player skips instead.',
    'krt.card.res.fn': 'Removes the entire discard pile – you immediately start a new turn.',
    'krt.card.res.detail': 'Playable almost anytime, except when a 17 is on top. Under a colour lock, the card must match the required colour or be dual-colour. If 3× Clear Pile are stacked together, that is a triple and the pile disappears too.',
    'krt.card.pss.detail': 'The card underneath the Pass stays in effect – the next player must still beat that exact card (or skip, if it is a 19 underneath).',
    'krt.card.wld.detail': 'The effect only kicks in once the Wild card has itself been legally played. Under a colour lock, it must therefore match the required colour itself, or be dual-colour. 3× Wild stacked together = a triple.',
    'krt.card.udc.type': 'Magic card · values 16 / 17 / 18',
    'krt.card.udc.detail': 'For Underbid 16, that is 13, 14 or 15 – or a magic card.',
    'krt.card.back.type': 'Deck',
    'krt.card.back.name': 'Card Back',
    'krt.card.back.fn': 'Identical on all 48 cards.',
    'krt.card.back.detail': 'Face-down table cards and the draw pile all look the same – a face-down card can never be identified in advance.',

    'krt.deckNote': 'The deck contains 48 cards in two colours – orange and blue; some cards are dual-colour and count for both.',
    'krt.cardfnHead.eyebrow': 'Card functions',
    'krt.cardfnHead.title': 'How each card works',
    'krt.cardfnHead.lede': 'The same explanation as in the rules – for quick reference right here.',
    'krt.fullRulesBtn': 'Go to the full rules',

    /* ================= regeln.html ================= */
    'rgl.pageTitle': 'Rules',
    'rgl.pageLede': 'Everything you need for a round with the physical card game – from setup to the very last card.',

    'rgl.quick.title': 'Quick summary',
    'rgl.quick.1': '<strong>Goal:</strong> Be the first to get rid of all your cards. Whoever is left holding cards last loses the round.',
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
    'rgl.a.p2': 'Each player gets rid of their cards in three waves: first the <strong>hand cards</strong>, then the <strong>three face-up table cards</strong>, and finally the <strong>three face-down table cards</strong>. As soon as someone has played everything, they are done. The others keep playing. <strong>The last player left holding cards loses the round</strong> and sets up the next one. There is no draw.',

    'rgl.b.title': 'Setting Up',
    'rgl.b.step1': '<strong>Shuffle.</strong> Shuffle all 48 cards thoroughly.',
    'rgl.b.step2': '<strong>Deal the face-down table cards.</strong> Give each player <strong>3 cards face down</strong>. They are placed in front of the player and <strong>not looked at</strong>.',
    'rgl.b.step3': '<strong>Deal the remaining hand cards.</strong> Then give each player <strong>6 more cards</strong>. Everyone may look at these.',
    'rgl.b.step4': '<strong>Choose the face-up table cards.</strong> Each player picks <strong>3</strong> of these 6 cards and places them <strong>face up on top of the 3 face-down cards</strong>. The remaining 3 cards stay as your <strong>starting hand</strong>.',
    'rgl.b.step5': '<strong>Form the draw pile.</strong> All undealt cards form the face-down <span class="term">draw pile</span>. Next to it there is room for the <span class="term">discard pile</span> – which starts empty.',
    'rgl.b.step6': '<strong>Determine the starting player.</strong> In the first round, whoever holds the <strong>lowest regular number card</strong> starts (magic cards do not count; in case of a tie, you decide who starts). From the second round on, the player <strong>to the right of the previous loser</strong> always starts.',
    'rgl.b.resultChip': 'Per player at the start: 3 face-down · 3 face-up · 3 in hand',

    'rgl.c.title': 'Taking a Turn',
    'rgl.c.lede': 'Play goes in turn, <strong>clockwise</strong>. When it is your turn, you do <strong>exactly one</strong> of the following.',
    'rgl.c.step1': '<strong>Check what is on top.</strong> The top card of the discard pile determines what you are allowed to play. If the pile is empty, you may play any card.',
    'rgl.c.step2': '<strong>Play one card, or several matching cards.</strong> Colour does not matter – what counts is the same value for number cards, or the same effect for magic cards. The three Underbid cards also count as “matching” and can be played together.',
    'rgl.c.step3': '<strong>Or pick up the discard pile.</strong> If you cannot (or do not want to) play, you take <strong>all</strong> the cards from the discard pile into your hand. The next player then opens a new discard pile. You cannot pick up an <strong>empty</strong> pile – in that case you must play.',
    'rgl.c.step4': '<strong>Refill your hand.</strong> If you have fewer than 3 cards in hand after your turn, draw from the draw pile until you have 3 again – as long as the draw pile still has cards.',
    'rgl.c.step5': '<strong>The next player goes</strong> – clockwise.',

    'rgl.c.matrix.k1': 'On top … nothing',
    'rgl.c.matrix.anyCard': 'Play <strong>any</strong> card.',
    'rgl.c.matrix.k2': '… a number (e.g. 16)',
    'rgl.c.matrix.v2': 'Play a number <strong>16 or higher</strong> – or a magic card.',
    'rgl.c.matrix.k3': '… a 15 (colour lock)',
    'rgl.c.matrix.v3': 'Play a card of the <strong>shown colour</strong> (value does not matter, even lower) – or a magic card of that colour.',
    'rgl.c.matrix.k4': '… a 17 (magic lock)',
    'rgl.c.matrix.v4': 'Only a number <strong>17 or higher</strong>. <strong>No</strong> magic card.',
    'rgl.c.matrix.k5': '… a 19 (skip)',
    'rgl.c.matrix.v5': 'You are <strong>skipped</strong> – unless you play a 19 yourself.',
    'rgl.c.matrix.k6': '… a “Wild”',
    'rgl.c.matrix.k7': '… an “Underbid” (e.g. 16)',
    'rgl.c.matrix.v7': 'Play a number <strong>lower than 16</strong> – or a magic card.',

    'rgl.e.title': 'Special Cases &amp; Important Rules',
    'rgl.e.lede': 'Situations that come up during a round but do not belong in the normal flow. Expand when you need them.',

    'rgl.e.d1.summary': 'Four-of-a-kind &amp; Triple – the pile disappears',
    'rgl.e.d1.p1': 'If <strong>four identical number cards</strong> end up directly on top of each other on the discard pile (a <span class="term">four-of-a-kind</span>), the entire discard pile is removed.',
    'rgl.e.d1.p2': 'The same applies to a <span class="term">triple</span> of magic cards: <strong>3× Clear Pile</strong>, <strong>3× Pass</strong>, <strong>3× Wild</strong>, or the three different <strong>Underbid</strong> cards (16 + 17 + 18).',
    'rgl.e.d1.subhead': 'After that',
    'rgl.e.d1.p3': 'The player who played the completing card refills their hand to 3 cards and <strong>immediately starts a new turn</strong> with any card.',
    'rgl.e.d1.p4': 'A four-of-a-kind/triple can happen in <strong>one turn</strong> (you play all the cards yourself) or across several turns – including as a quick reaction (see below).',

    'rgl.e.d2.summary': 'Quick Reaction – Grab the four-of-a-kind or triple!',
    'rgl.e.d2.p1': 'If <strong>three matching cards</strong> are already on the pile and you are only missing the fourth for a four-of-a-kind, <strong>any player</strong> may immediately add the matching card – <strong>even if it is not their turn</strong>. The same applies if one card is on the pile and a player holds the three matching cards, or if two cards are on the pile and a player holds the two missing ones.',
    'rgl.e.d2.p2': 'The four-of-a-kind (for number cards) or triple (for magic cards) is then complete, the entire pile is removed, and you immediately get the next turn. Refill your hand to 3 cards first.',
    'rgl.e.d2.p3': 'Be quick and pay attention: once the regular next player has played a different card, the chance is gone.',

    'rgl.e.d3.summary': 'Colour Lock',
    'rgl.e.d3.p1': 'As long as a <strong>15</strong> is on top, only the colour counts – not the value. So you may also play <strong>lower</strong> cards, as long as the colour matches.',
    'rgl.e.d3.li1': '<strong>Dual-colour cards</strong> satisfy any required colour.',
    'rgl.e.d3.li2': 'If you play several matching cards, only <strong>one of them</strong> needs the required colour. The rest may be a different colour, as long as they share the same value. Example: on an orange 15 you may play an orange 19 together with two blue 19s. A single card of the wrong colour on its own is still forbidden.',
    'rgl.e.d3.li3': 'The colour lock applies <strong>without exception</strong> – including <strong>every magic card</strong>.',
    'rgl.e.d3.li4': 'If several 15s are on the pile, the colour of the <strong>topmost</strong> one (played last) applies.',

    'rgl.e.d4.summary': 'Skip – the Chain',
    'rgl.e.d4.p1': 'A <strong>19</strong> makes the next player skip a turn. Play two 19s and two players skip – and so on.',
    'rgl.e.d4.p2': 'If <strong>you yourself</strong> would have to skip, but hold a 19 in hand or face up, you may still play it during your “skip moment”. As a result:',
    'rgl.e.d4.li1': 'you pass the skip on to the next player,',
    'rgl.e.d4.li2': 'and <strong>one additional</strong> player after you skips too.',

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
    'rgl.e.d7.p3': 'If you are in the face-up table-card phase, already have 1–2 face-down cards exposed, still have face-up cards in front of you, and cannot play any of them: then <strong>once per game</strong> you may reveal and play one of the already-exposed face-down cards early. If it fits → play continues. If it does not → into your hand, and you pick up the discard pile.',

    'rgl.f.title': 'End of the Round &amp; Winners',
    'rgl.f.lede': 'A round ends as soon as only one player still has cards.',
    'rgl.f.step1': '<strong>Finishing.</strong> Whoever plays their very last card – from hand, face-up or face-down table cards – is done and leaves the current round.',
    'rgl.f.step2': '<strong>The loser.</strong> As soon as only <strong>one</strong> player still has cards, that player loses the round.',
    'rgl.f.step3': '<strong>Next round.</strong> The loser shuffles and deals the next round. The player <strong>to their right</strong> starts.',
    'rgl.f.final': 'There is no draw.'
  };

  var PAGE_TITLES_EN = {
    index: 'Lucky Shutdown – Card Game',
    karten: 'Lucky Shutdown – All Cards',
    regeln: 'Lucky Shutdown – Rules'
  };

  var ATTRS = ['alt', 'aria-label', 'placeholder'];
  var CARD_FIELDS = ['type', 'name', 'fn', 'detail', 'count'];

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
    CARD_FIELDS.forEach(function (field) {
      document.querySelectorAll('[data-i18n-' + field + ']').forEach(function (el) {
        saveOrig(el, field, el.dataset[field]);
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

    CARD_FIELDS.forEach(function (field) {
      document.querySelectorAll('[data-i18n-' + field + ']').forEach(function (el) {
        var key = el.getAttribute('data-i18n-' + field);
        var orig = originals.get(el);
        if (isEn && EN[key] !== undefined) {
          el.dataset[field] = EN[key];
        } else if (orig && orig[field] !== undefined) {
          el.dataset[field] = orig[field];
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
