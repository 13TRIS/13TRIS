# Webengineering
60 min.
### RICH CLIENT:
- Single Page application:
  - wozu, vorteile, wie es funktioniert / loadbalancer
  - routing / verweise / links
  - component architecture:
  - MVC x
  - Vorteile Nachteile / Modulith
  - Atomic design x
  - Micro frontends (warum + -, aufbau)
  
### RICH CLIENT STATE MANAGEMENT:
 - weglassen ?

### RICH CLIENT TESTING:
- guidelines zum testing
- unit integration UI tests
- wieso und wann testen
- isoliertes testen
- mock
- component test
- sauberes testen (zB description, aufbau, usw)
- codeduplizierung (beforeeach, beforeall)
- reproduzierbar (nicht abhangig von dynamischen variablen)

### RICH CLIENT SERVER
- Architekturen
  - monolith
  - modulith 
  - service
  - microservice
- Zusammenfassung

### JSF
- Ziele , worum es geht
- abgrenzung / unterschied zwischen JSF / JSP
- Lifecycle:
  - Restore
  - Apply Request
  - Process Validation
  - Update Model
  - Invoke Application
  - Render Response
- Beans:
  - Was fur bens es gibt
  - wie und wozu die benutz wird
  - baked _BEANS_
  - scopes viewscope, sessionscope, applicationscope, requestscope
- Navigation ?
- listeners + events
- system event
- validatoren (wofur + beispiele)
- konventoren (wofur + beispiele)

### AUTHENTIFIZIERUNG
- wozu / motivation (rechteverwaltung)
- zugriffskontrolle Discretional / Mandatory - Access
- Typen:
  - wissen: password
  - besitzt: key ?
  - inharenz: biometrische
- Authentifizierungsarten
  - direkt
  - arbiter
- multifaktor (OTP, SMS, U2F)
  - probleme ???? NO WAY
- sessions (speichern)
- Loadbalancer
- protokolle
  - Authorisation
  - Authentication
- terminologie
  - SAML
  - OAUTH2
- genereller ablauf fur beide (zB resources Server > Client > Authorisation Server)
- Ablage des Token (NICHT im local- / Sessionstorage) damit nicht dritte darauf zugreifen
- Json Web Token
  - aufbau r43wr02.RT&Fu8ft78TF34.34wSDVFw3Cfw4

### SECURITY
- Angriffmethoden
  - Requestmanipulation
  - SQL injektion
  - Session Hijacking
  - Cross site section
  - Cross origin thing
  - Man in the middle
  - usw
- Wie gehe ich dagegen vor, spoiler gar nicht
- Abwehrmassnahmen