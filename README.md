# Drugi seminarski rad: Senzor svjetlosti

Za potrebe drugog seminarskog rada iz kolegija _Mrežni i mobilni komunikacijski sustavi_. Razvijena je aplikacija koja vrijednosti androidovog senzora svjetlosti prikazuje na zaslon, odnosno početnu stranicu. Vrijednost koja se prikazuje je izražena mjernom jedinicom "lux", odnosno jedinocom osvjetljenja. Aplikacija je testirana na android emulatoru i na fizičkom android uređaju.

    
## Senzor svjetlosti
Senzor koji dohvaća vrijednost svjetlosti koja dopire do android uređaja naziva se `TYPE_LIGHT`. Implementacija, odnosno način na koji koristimo senzor vidljiv je u datoteci `main-view-model.js`, dok će se u nastavku prikazati neki najbitniji dijelovi koda.

Najprije importamo aplikaciju kako bi mogli dohvatiti njezin kontekst (trenutno stanje i određeni resursi) kojeg zatim spremamo u pripadajuću varijablu:
```js
import * as application from '@nativescript/core/application';

const context = application.android.context;
```

Nakon toga, potrebno je definirati tri elemenata:
```js
const SensorManager = context.getSystemService(android.content.Context.SENSOR_SERVICE);
const startSensor = SensorManager.getDefaultSensor(android.hardware.Sensor.TYPE_LIGHT);
const nativeDelay = android.hardware.SensorManager.SENSOR_DELAY_NORMAL;
```
`SensorManager` omogućuje pristup senzorima uređaja.

U `startSensor` pohranjujemo zadanu vrijednost (senzor) koji želimo koristiti, a u našem je slučaju to senzor svjetlosti `TYPE_LIGHT`.

`nativeDelay` označava brzinu dohvaćanja podataka senzora. Za potrebe naše aplikacije zadana brzina je dovoljna.

Prije definicije slušatelja koji će čekati promjene, potrebno je definirati i samu funkciju koju će pozivati kada bude obavješten o novim podacima. Jednostavno joj se kao argument prosljeđuje nova vrijednost koja zamijeni trenutnu.
```js
let value = 0;
const updateLightValue = newValue =>  value = newValue;
```

Sljedeći korak je definiranje slušatelja, odnosno `sensorEventListenera`. Njegova uloga je primanje obavijesti od strane `SensorManagera` o novim podacima senzora. Sastoji se od dvije metode, a to su `onAccuracyChanged(Sensor sensor, int accuracy)` i `onSensorChanged(SensorEvent event)`. Prva se poziva kada se mijenja preciznost registriranog senzora, dok se druga poziva kada se dogodi novi event na senzoru. Za potrebe naše aplikacije dovoljna je druga metoda koja poziva funkciju definiranu u prošlom koraku, no svejedno je potrebno inicijalizirati i prvu metodu koju možemo ostaviti praznom:
```js
let sensorListener = new android.hardware.SensorEventListener({
    onAccuracyChanged: (sensor, accuracy) => {},
    onSensorChanged: event => {
      updateLightValue(event.values[0])
      viewModel.set('light', event.values[0])
    }
  });
```

Za kraj je potrebno `sensorListener` definiranog u prošlom koraku i registrirati, a to radimo na sljedeći način:
```js
SensorManager.registerListener(
    sensorListener,
    startSensor,
    nativeDelay
  );
```

Nije potrebno implementirati funkcije za onemogućavanje senzora ili deregistraciju njegova slušatelja iz razloga što je zamišljeno da se implementirani senzor koristi za cijelo vrijeme izvođenja aplikacije.

Tijekom izrade aplikacije nije bilo nikakvih problema, no cijeli je proces trajao nešto sporije zbog nedostatka relevantnih izvora.

Cjelokupni kod aplikacije dostupan je na [Githubu](https://github.com/tbaskijera/MMOS_drugi_seminar).

## Profiliranje aplikacije
Izrađenu aplikaciju potrebno provesti ćemo kroz proces profiliranja uz pomoć ```Andorid Studia```. Parametri ili komponente nad kojima ćemo snimati promet i/ili opterećenje te vidjeti kako se ponašaju su CPU, memorija i energija. Kako bismo navedeno omogućili bilo je potrebno aplikaciju otvoriti kao projekt te njeni .apk izabrati za profiliranje. Aplikaciju ćemo pokrenuti na fizičkom android uređaju, a ne na emulatoru.
![](https://imgur.com/gg13RrV.jpg)

### CPU
Tijekom izvođenja aplikacije, a konkretno prilikom približavanja uređaja različitim razinama svjetlosti, graf optrećenosti CPU-a se mijenja. Međutim, ti su pomaci vrlo minimalni te možemo zaključiti kako aplikacija nije zahtjevna te ne zahtijeva veliku procesorsku moć. Iz snimljenih podataka možemo vidjeti da CPU najviše opterećuju procesi `mali-utility-wo()`, `V8 DefaultWorke()` i `script.mysensor()`.
![](https://imgur.com/uynJ7J1.jpg)

### Memorija
Iz snimljenog prometa memorije vidimo da postoji ukupno 1036 klasa od kojih najviše alokacija ima `byte[]`, a najveći retained size `Bitmap(android.graphics)`.
![](https://imgur.com/BbyDlsX.jpg)

### Energija
Energija je gotovo cijelo vrijeme konstantna te je količina trošenja zanemariva, osim kod pojedinih odskakanja kada od mraka odjedanput na uređaj fokusiramo jako svjetlo.
![](https://imgur.com/oI7bTTi.jpg)

Na kraju, iz očitanih podataka možemo zaključiti da aplikacija nije zahtjevna ni u kojem smislu te nije potrebno poduzimati nikakve mjere u svrhu optimizacije.


## Literatura
https://developer.android.com/reference/android/hardware/SensorManager

https://developer.android.com/reference/android/hardware/SensorEventListener

https://stackoverflow.com/questions/53136683/accessability-of-native-sensors-in-nativescript