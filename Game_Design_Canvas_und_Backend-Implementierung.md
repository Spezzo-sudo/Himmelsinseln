# Architektur und Implementierungsspezifikation: Projekt 'Aether-Horizon'

## 1. Executive Summary und Projektvision

### 1.1 Einführung in das Aether-Paradigma

Das Projekt 'Aether-Horizon' repräsentiert einen technologischen und gestalterischen Vorstoß in das Genre der browserbasierten Echtzeit-Strategiespiele (MMORTS). Angesiedelt in einem fragmentierten Universum, in dem Kontinentalplatten als schwebende Inseln durch einen endlosen Aether driften, fordert das Spiel die Teilnehmer auf, die Rolle von Flottenkommandanten zu übernehmen. Das Setting, tief verwurzelt in der Steampunk-Ästhetik, diktiert nicht nur die visuelle Präsentation, sondern auch die zugrunde liegenden Spielmechaniken: Dampfdruck, komplexe Mechanik und die Ressourcenknappheit einer zerbrochenen Welt bilden den Kern der Spielerfahrung.

Technologisch zielt dieses Projekt darauf ab, die Grenzen dessen zu verschieben, was in einer serverlosen Umgebung möglich ist. Durch die Kombination von React (Vite) für ein hochperformantes Frontend, Tailwind CSS für ein atomares und wartbares Design-System und Convex als reaktives, transaktionales Backend, wird eine Architektur geschaffen, die traditionelle Probleme des Genres – wie Latenz bei der Statussynchronisation oder Cheating durch Client-seitige Autorität – eliminiert. Die Entwicklung findet vollständig innerhalb von Project IDX statt, was eine konsistente, cloud-basierte Entwicklungsumgebung gewährleistet und die Integration von Backend- und Frontend-Services in einem unified Workspace ermöglicht.

### 1.2 Zielsetzung und technischer Anspruch

Der vorliegende Bericht dient als umfassende Dokumentation der Systemarchitektur. Er richtet sich an Softwarearchitekten und Senior Developer und analysiert die Implementierungsdetails von der mathematischen Modellierung des hexagonalen Rasters bis zur deterministischen Abwicklung asynchroner Kampfhandlungen. Besonderes Augenmerk liegt auf der Anwendung fortgeschrittener Entwurfsmuster wie der "Lazy Evaluation" für Ressourcenberechnungen , um die Datenbanklast bei tausenden parallelen Simulationen zu minimieren.

Die Analyse wird aufzeigen, wie die deterministischen Garantien von Convex genutzt werden können, um eine "Single Source of Truth" zu etablieren, die Manipulationen ausschließt, während React und HTML5 Canvas (via Konva) eine flüssige 60-FPS-Darstellung gewährleisten. Das Ergebnis ist ein System, das die Persistenz eines MMOs mit der taktischen Tiefe eines klassischen RTS verbindet.

## 2. Entwicklungsumgebung und Infrastruktur: Project IDX

### 2.1 Containerisierung und Workspace-Konfiguration

Die Wahl von Project IDX als primäre Entwicklungsumgebung ist nicht zufällig, sondern eine strategische Entscheidung zur Reduktion von "Environmental Drift". Da 'Aether-Horizon' auf einem komplexen Zusammenspiel zwischen einem Node.js-basierten Build-Prozess (Vite) und einer spezifischen Backend-Runtime (Convex) basiert, bietet IDX durch seine auf Nix basierende Konfiguration eine reproduzierbare Umgebung.

Im Kontext von 'Aether-Horizon' wird die idx.nix-Konfigurationsdatei so angepasst, dass sie automatisch die korrekten Versionen der Convex CLI und der Node.js-Runtime bereitstellt. Dies ist kritisch, da Inkompatibilitäten zwischen der lokalen CLI-Version und der Cloud-Instanz von Convex zu Deployment-Fehlern führen können. Der Workspace ermöglicht es, den lokalen Entwicklungsserver (npm run dev) und den Convex-Synchronisationsprozess (npx convex dev) in parallelen Terminals innerhalb derselben Browser-Instanz auszuführen. Dies reduziert die Latenz beim Context-Switching für den Entwickler erheblich und spiegelt die spätere Produktionsumgebung wider, in der Frontend und Backend zwar logisch getrennt, aber funktional eng gekoppelt sind.

### 2.2 Integration von Convex in den CI/CD-Prozess

Ein wesentlicher Vorteil der Nutzung von IDX ist die nahtlose Integration in Google Cloud-Dienste und GitHub. Für das Deployment von 'Aether-Horizon' wird eine Pipeline etabliert, die bei jedem Push in den main-Branch automatisch Type-Checks durchführt. Da Convex das Datenbankschema direkt in TypeScript definiert (schema.ts) und daraus Typen für das Frontend generiert, führt jede Schema-Änderung, die nicht im Frontend reflektiert wird, sofort zu einem Build-Fehler. Diese strikte Typisierung über die Netzwerkgrenze hinweg – oft als "End-to-End Type Safety" bezeichnet – ist ein Hauptgrund für die Wahl dieses Tech-Stacks. Sie verhindert eine ganze Klasse von Laufzeitfehlern, die in traditionellen REST- oder GraphQL-basierten Architekturen häufig auftreten, wenn API-Definition und Implementierung divergieren.

## 3. Visuelles Design-System: Steampunk-Ästhetik mit Tailwind CSS

### 3.1 Farbtheorie und Atmosphäre

Das visuelle Design von 'Aether-Horizon' muss die Dualität des Steampunk-Genres einfangen: Die Eleganz viktorianischer Materialien (Messing, Samt, Holz) und die Härte industrieller Umgebungen (Ruß, Dampf, oxidiertes Kupfer). Tailwind CSS bietet hierfür durch seine Konfigurationsdatei (tailwind.config.js) das ideale Werkzeug, um ein konsistentes Design-System zu erzwingen, das über einfache Farbcodes hinausgeht und semantische Bedeutung trägt.

Basierend auf Analysen gängiger Steampunk-Farbpaletten wurde ein spezifisches Schema entwickelt. Die Palette verzichtet auf reines Schwarz oder Weiß, da diese in einer "dreckigen" Dampf-Welt unnatürlich wirken. Stattdessen bildet ein tiefes, fast schwarzes Grünblau (#0d3433 - Deep Aether) den Hintergrund, der den unendlichen Himmel unter den Inseln repräsentiert.

Die Benutzeroberfläche selbst, die als Armaturenbrett eines Luftschiffes die Canvas-Karte überlagert, nutzt primär metallische Töne. Ein zentraler Ton ist "Burnished Brass" (#b26e41), der für Rahmen und primäre Interaktionselemente genutzt wird. Akzente werden durch "Oxidized Copper" (#34544F) gesetzt, um Alterung und Patina zu simulieren.

#### Semantische Farbzuweisung im Tailwind-Config

Die Implementierung erfolgt nicht durch harte Hex-Codes im HTML, sondern durch die Erweiterung des theme-Objekts in der Tailwind-Konfiguration.

Diese Abstraktion erlaubt es, im Code Klassen wie bg-void-slate oder text-brass-primary zu verwenden. Sollte sich die Art Direction später ändern (z.B. hin zu einem "Dieselpunk"-Setting), muss nur die Konfigurationsdatei angepasst werden, und das gesamte Spiel passt sich automatisch an.

### 3.2 UI-Komponenten und "Physicality"

Ein Kernaspekt von Steampunk-UI ist die "Physis" der Elemente. Buttons sind keine flachen Rechtecke, sondern mechanische Schalter. Panels schweben nicht im Nichts, sondern sind vernietete Platten. Tailwind CSS ermöglicht dies durch die Kombination von Utility-Klassen für Schatten (box-shadow), Ränder (border) und Verläufe (gradient).

Ein typisches Panel in 'Aether-Horizon' nutzt beispielsweise komplexe Schatten-Definitionen, um Tiefe zu simulieren. In der tailwind.config.js definieren wir unter boxShadow einen Eintrag inset-metallic: inset 2px 2px 5px rgba(255, 255, 255, 0.1), inset -2px -2px 5px rgba(0, 0, 0, 0.4). Dies erzeugt den Effekt einer eingeprägten oder erhabenen Metallplatte.

Für Schriftarten greifen wir auf Webfonts zurück, die den Charakter der Epoche unterstreichen. Rye für Überschriften vermittelt einen Western/Abenteuer-Charakter, während Courier Prime für Datenanzeigen und Logs genutzt wird, um an mechanische Schreibmaschinen oder Fernschreiber zu erinnern. Diese werden im fontFamily-Bereich der Konfiguration als font-display und font-mono registriert.

## 4. Backend-Architektur: Das reaktive Datenmodell in Convex

### 4.1 Schema-Design und relationale Integrität

Im Gegensatz zu klassischen SQL-Datenbanken oder reinen Dokumentenspeichern bietet Convex ein hybrides Modell, das strenge Schemata mit der Flexibilität von JSON-Dokumenten verbindet. Für 'Aether-Horizon' ist das Schema (convex/schema.ts) das Rückgrat der gesamten Anwendungslogik. Es definiert nicht nur die Speicherstruktur, sondern implizit auch die Spielregeln und Beziehungen.

Das Schema gliedert sich in vier Hauptbereiche:

Spieler-Entitäten (users): Speichert Authentifizierungsdaten, globale Statistiken und Technologie-Forschungsstände.

Welt-Topologie (islands): Repräsentiert die Knotenpunkte des Spiels. Jede Insel ist ein Dokument, das ihre Position im Hex-Raster (q, r), ihren Ressourcenstand und ihren Besitzer referenziert.

Mobile Aktoren (fleets): Beinhaltet alle sich bewegenden Einheiten. Kritisch sind hier Start- und Zielkoordinaten sowie Zeitstempel für Bewegungsinterpolationen.

Ereignis-Logs (battles, movements): Historische Daten für Replays und Benachrichtigungen.

#### Detaillierte Tabellenstruktur und Indizierung

Um die Performance bei Tausenden von gleichzeitigen Spielern zu gewährleisten, ist die Indizierung entscheidend. Besonders die islands-Tabelle wird intensiv abgefragt, oft basierend auf räumlicher Nähe (z.B. "Zeige alle Inseln im aktuellen Viewport").

Wir definieren die islands-Tabelle mit einem zusammengesetzten Index auf die axialen Koordinaten q und r. defineTable({ q: v.number(), r: v.number(), owner: v.optional(v.id("users")),... }).index("by_coordinates", ["q", "r"]) Dieser Index ermöglicht O(log n) Zugriffszeiten für Koordinatenabfragen. Ohne diesen Index müsste der Server bei jeder Kartenbewegung einen "Full Table Scan" durchführen, was bei einer wachsenden Welt unweigerlich zu Performance-Einbrüchen führen würde.

Zusätzlich nutzen wir Convex' Fähigkeit zur Referenzierung (v.id("tableName")). Dies stellt sicher, dass keine Flotte auf eine nicht existierende Insel verweisen kann (Referenzielle Integrität), ein Problem, das in NoSQL-Datenbanken oft manuell im Applikationscode behandelt werden muss.

### 4.2 Transaktionsmodell und Atomarität

In einem Echtzeit-Strategiespiel finden Hunderte von Aktionen pro Sekunde statt. Ressourcen werden ausgegeben, Einheiten bewegt, Kämpfe berechnet. Das Risiko von "Race Conditions" ist hoch. Beispiel: Zwei Spieler greifen dieselbe Insel im exakt gleichen Millisekunden-Fenster an, oder ein Spieler versucht, Ressourcen für zwei Gebäude gleichzeitig auszugeben, obwohl er nur genug für eines hat.

Convex garantiert durch sein Transaktionsmodell Serialisierbarkeit. Jede Mutation (Schreibfunktion) wird isoliert ausgeführt. Wenn die Mutation buildAirship prüft, ob 500 Metall vorhanden sind, und dann 500 Metall abzieht, garantiert die Datenbank, dass zwischen dem Lesen (Check) und dem Schreiben (Abzug) keine andere Mutation den Metallstand verändert hat. Schlägt eine Bedingung fehl (z.B. durch eine throw new Error("Nicht genug Ressourcen") Anweisung im TypeScript-Code), wird die gesamte Transaktion zurückgerollt. Es gibt keine "halben" Zustände, in denen Ressourcen abgezogen, aber kein Schiff gebaut wurde. Dies vereinfacht die Spiellogik drastisch, da Entwickler nicht defensiv gegen parallele Zugriffe programmieren müssen.

## 5. Das Mathematische Fundament: Hexagonale Geometrie

### 5.1 Koordinatensysteme: Axial vs. Kubisch

Das Spielfeld von 'Aether-Horizon' ist ein unendliches hexagonales Raster. Während quadratische Raster intuitiv sind (x, y), leiden sie unter dem Problem ungleicher Distanzen (Diagonale vs. Orthogonale). Hexagone lösen dieses Problem: Jeder Nachbar ist exakt gleich weit entfernt.

Für die interne Speicherung und Berechnung nutzen wir kubische Koordinaten (x, y, z), wobei die Bedingung x + y + z = 0 gilt. Dieses System bietet elegante Symmetrien für Algorithmen wie Sichtlinienberechnung oder Flächenwirkung. Da die dritte Koordinate jedoch redundant ist (z = -x - y), speichern wir in der Datenbank nur axiale Koordinaten (q, r), wobei q = x und r = z entspricht. Dies reduziert den Speicherbedarf um 33% pro Insel, ohne die mathematischen Vorteile zu opfern, da die dritte Koordinate zur Laufzeit trivial berechnet werden kann.

### 5.2 Transformation: Pixel zu Hex und zurück

Die Schnittstelle zwischen dem Spieler (Mausklick auf Pixel x,y) und der Logik (Insel auf q,r) erfordert präzise Matrix-Transformationen. Für "Pointy-topped" Hexagone (Spitze zeigt nach oben) definieren wir die Basisvektoren.

Die Umrechnung von Hex (q, r) zu Pixel (x, y) für das Rendering erfolgt nach der Formel:

Wobei size der Radius des Umkreises des Hexagons ist. Diese Berechnung wird im Frontend (React-Komponente) durchgeführt, um die <HexTile>-Elemente auf dem Canvas zu platzieren.

Die inverse Operation – die Ermittlung, welches Hexagon angeklickt wurde – ist komplexer, da eine einfache Inversion der Matrix gebrochene Zahlen (Floats) liefert, z.B. q=3.1, r=4.8. Einfaches Runden führt an den Kanten der Hexagone zu Fehlern. Wir implementieren daher einen Rundungsalgorithmus für kubische Koordinaten:

Konvertiere axiale Float-Koordinaten in kubische Float-Koordinaten (x, y, z).

Runde x, y, und z separat auf die nächste ganze Zahl (rx, ry, rz).

Berechne die Abweichungen: dx = |rx - x|, dy = |ry - y|, dz = |rz - z|.

Da rx + ry + rz möglicherweise nicht mehr 0 ergibt, korrigieren wir die Koordinate mit der größten Abweichung. Wenn dx am größten ist, setzen wir rx = -ry - rz. Dieser Algorithmus garantiert eine mathematisch korrekte Zuordnung jedes Pixels zum nächstgelegenen Hex-Zentrum und ermöglicht eine präzise Interaktion selbst bei komplexen Kartenlayouts.

## 6. Ressourcen-Ökonomie: Das "Lazy Evaluation" Pattern

### 6.1 Herausforderung der Echtzeit-Ressourcen

In einem klassischen RTS wie StarCraft läuft die Simulation auf dem Client oder einem dedizierten Server in Ticks (z.B. 10x pro Sekunde). In einem persistenten MMO wie 'Aether-Horizon' ist dies unmöglich. Wenn 10.000 Spieler je 10 Inseln besitzen, müsste der Server 100.000 Datenbank-Updates pro Sekunde durchführen, nur um "Metall +1" zu rechnen. Dies ist weder skalierbar noch kosteneffizient.

### 6.2 Lösung: Berechnung "On-Demand"

Wir implementieren das "Lazy Evaluation" Pattern (Verzögerte Berechnung). Das Grundprinzip lautet: Der Zustand in der Datenbank ist nicht der aktuelle Zustand, sondern ein Snapshot der Vergangenheit.

Das Datenbankschema für eine Insel enthält folgende Felder:

storedMetal: Menge zum Zeitpunkt des letzten Updates.

metalProductionRate: Produktion pro Stunde.

lastUpdated: Unix-Timestamp (ms) der letzten Transaktion.

Wenn eine Mutation (z.B. buildFactory) den aktuellen Ressourcenstand wissen muss, liest sie nicht einfach storedMetal. Stattdessen ruft sie eine interne Helper-Funktion calculateCurrentResources auf. Diese Funktion führt folgende Berechnung durch:

Erst wenn der Spieler eine Aktion durchführt, die den Ressourcenstand verändert (Verbrauch oder Änderung der Produktionsrate), wird der neu berechnete Wert in storedMetal festgeschrieben und lastUpdated auf Date.now() gesetzt.

### 6.3 Vorteile und Implikationen

Dieses Muster reduziert die Datenbank-Schreiblast für passive Ressourcenproduktion auf Null. Ein Spieler kann sich für ein Jahr ausloggen; bei seiner Rückkehr findet eine einzige Berechnung statt, die ihm die Ressourcen für das gesamte Jahr gutschreibt. Dies macht die Backend-Architektur extrem effizient und kostengünstig.

Für das Frontend bedeutet dies jedoch, dass wir eine Client-seitige Simulation benötigen. Da der Server keine sekündlichen Updates pusht, muss die React-Komponente, die den Ressourcenstand anzeigt, einen eigenen Timer nutzen, um den Wert visuell hochzuzählen. Convex liefert die Basisdaten (Startwert, Rate, Zeitstempel), und das Frontend interpoliert die Anzeige für den Nutzer. Dies erzeugt die Illusion einer Echtzeit-Synchronisation.

## 7. Deterministisches Kampfsystem und Scheduling

### 7.1 Der Convex Scheduler: Zeitsteuerung

Kämpfe in 'Aether-Horizon' finden statt, wenn eine Flotte ihr Ziel erreicht. Da die Reisezeit oft Minuten oder Stunden beträgt, nutzen wir den Convex Scheduler. Frühere Versionen der Convex API nutzten runAt mit Unix-Timestamps in Sekunden. Aktuelle Versionen und Best Practices verlangen Millisekunden.

Wenn eine Flotte ausgesendet wird, berechnet die Mutation sendFleet die Reisezeit T. Anschließend wird die Ankunft geplant: ctx.scheduler.runAt(Date.now() + T, internal.combat.resolveBattle, { fleetId, targetId });

Dies registriert einen Eintrag in der systeminternen Tabelle _scheduled_functions. Convex garantiert, dass diese Funktion frühestens zum Zeitpunkt Date.now() + T ausgeführt wird. Da dies eine Transaktion ist, wird der Kampf auch dann korrekt ausgeführt, wenn der Server zwischenzeitlich neu gestartet wird. Es ist ein "Durable Execution" Modell.

### 7.2 Kampflogik und Schadensberechnung

Die Funktion internal.combat.resolveBattle muss deterministisch sein. Zufallselemente (Glück) müssen aus einem Seed generiert werden, der in der Kampf-ID oder dem Zeitstempel verankert ist, um Reproduzierbarkeit (z.B. für Replays) zu gewährleisten.

Das Schadensmodell basiert auf relativer Stärke, inspiriert durch die Lanchester-Gesetze und die Formeln von "Die Stämme" (Tribal Wars). Es reicht nicht, einfach Angriff minus Verteidigung zu rechnen, da dies Massenschlachten trivialisieren würde. Die Formel für die Verluste lautet:

Dieser Exponent von 1.5 sorgt dafür, dass eine knapp unterlegene Armee massive Schäden anrichtet, während eine hoffnungslos unterlegene Armee ("Selbstmordkommando") fast keinen Schaden verursacht, bevor sie vernichtet wird. Dies fördert strategisches Zusammenziehen von Truppen.

Das Kampfsystem implementiert zudem ein "Stein-Schere-Papier"-Prinzip (Weapon Triangle) :

Dreadnoughts (Hohe Panzerung) schlagen Kreuzer.

Kreuzer (Schnell, viele Geschütze) schlagen Jäger-Staffeln.

Jäger-Staffeln (Klein, wendig, panzerbrechend) schlagen Dreadnoughts.

Diese Boni werden als Multiplikatoren (z.B. 1.5x Schaden) vor der Anwendung der Verlustformel in die Gesamtstärke eingerechnet.

## 8. Frontend-Architektur: React und Konva

### 8.1 Grenzen des DOM und die Lösung Canvas

Ein RTS-Spiel stellt extreme Anforderungen an das Rendering. Eine Karte mit 10.000 Inseln, Nebel-Partikeln und Hunderten von Schiffen kann nicht effizient mit Standard-DOM-Elementen (<div>) dargestellt werden. Der Overhead des Browsers für Layout-Berechnungen (Reflow/Repaint) würde die Framerate in den einstelligen Bereich drücken.

Die Lösung ist HTML5 Canvas. Um jedoch die deklarative Natur von React beizubehalten ("UI als Funktion des Zustands"), nutzen wir react-konva. Diese Bibliothek erlaubt es uns, Canvas-Elemente wie React-Komponenten zu schreiben: <Stage><Layer><HexTile x={...} y={...} /></Layer></Stage>

Konva übernimmt das effiziente Zeichnen auf den Canvas, während React sich um die Zustandsverwaltung kümmert. Wichtig ist hierbei die Optimierung durch "Culling": Wir berechnen im Frontend, welche Hex-Koordinaten im aktuellen Browser-Fenster sichtbar sind, und rendern nur diese Komponenten.

### 8.2 State Management und Subscription

Convex bietet React-Hooks (useQuery), die eine automatische Subscription auf Backend-Daten einrichten. Ändert sich ein Datum in der Datenbank, wird die React-Komponente automatisch neu gerendert. Für die Spielkarte (GameMap.tsx) abonnieren wir jedoch nicht alle Inseln der Welt (Datenmenge zu groß), sondern nutzen "Spatial Partitioning". Die Welt ist in Sektoren unterteilt. Der Client abonniert nur die Sektoren, die aktuell sichtbar sind. const visibleIslands = useQuery(api.map.getSector, { sectorId: currentSector }); Bewegt der Spieler die Kamera, ändert sich currentSector, und Convex liefert blitzschnell die neuen Daten nach.

## 9. Zusammenfassung und technischer Ausblick

Die Architektur von 'Aether-Horizon' demonstriert, wie moderne Serverless-Technologien komplexe Spielmechaniken ermöglichen, die früher dedizierte Serverfarmen erforderten. Durch die Verlagerung der "State Authority" in die transaktionale Convex-Datenbank eliminieren wir Synchronisationsprobleme. Das "Lazy Evaluation"-Muster löst das Problem der Ressourcen-Skalierung, während das mathematisch rigorose Hex-Grid-System eine präzise Spielwelt schafft.

Die Kombination aus Project IDX für die Entwicklungsumgebung und der Typensicherheit zwischen Backend und Frontend schafft eine robuste Codebasis, die wartbar und erweiterbar ist. Zukünftige Erweiterungen könnten "Optimistic Updates" für Einheitenbewegungen umfassen, um die gefühlte Latenz weiter zu reduzieren, sowie die Einführung von WebSockets (via Convex Actions) für einen Echtzeit-Chat zwischen Allianzen. Das Fundament für ein massives, persistentes Steampunk-Universum ist gelegt.

#### Quellenangaben

1. Aggregate - Convex, https://www.convex.dev/components/aggregate 2. Steampunk Color Scheme - Palettes - SchemeColor.com, https://www.schemecolor.com/steampunk.php 3. Steampunk Forever Color Scheme - Image Color Palettes - SchemeColor.com, https://www.schemecolor.com/steampunk-forever.php 4. Steampunk Metals Color Palette, https://www.color-hex.com/color-palette/88040 5. Scheduled functions & crons: Convex can do that, https://www.convex.dev/can-do/scheduled-functions-and-crons 6. Mutations | Convex Developer Hub, https://docs.convex.dev/functions/mutation-functions 7. Hexagonal Grids - Red Blob Games, https://www.redblobgames.com/grids/hexagons/ 8. Pixel-to-axial hexagon coordinates for nonstandard hex sizes - Stack Overflow, https://stackoverflow.com/questions/77937723/pixel-to-axial-hexagon-coordinates-for-nonstandard-hex-sizes 9. Implementation of Hex Grids - Red Blob Games, https://www.redblobgames.com/grids/hexagons/implementation.html 10. Announcing Convex 0.9.0, https://news.convex.dev/announcing-convex-0-9-0/ 11. Scheduled Functions | Convex Developer Hub, https://docs.convex.dev/scheduling/scheduled-functions 12. Interface: Scheduler | Convex Developer Hub, https://docs.convex.dev/api/interfaces/server.Scheduler 13. Battle System | Tribal Wars 2 - Forum EN, https://en.forum.tribalwars2.com/index.php?threads/battle-system.759/ 14. Battle Formula | Tribal Wars - EN, https://forum.tribalwars.net/index.php?threads/battle-formula.183466/ 15. RTS Game Design (Fundamentals, Mechanics, Template), https://gamedesignskills.com/game-design/real-time-strategy/ 16. React Konva Crash Course in 30 minutes - YouTube, https://www.youtube.com/watch?v=iUm2wHHel4s