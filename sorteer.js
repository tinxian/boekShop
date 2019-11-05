// JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
   if(this.readyState==4 && this.status == 200) {
      sorteerBoek.data = JSON.parse(this.responseText);
      sorteerBoek.voegJSDatumtoe();
      sorteerBoek.sorteren();
   }
}
xmlhttp.open("GET", "boeken.json", true);
xmlhttp.send();

// een tabelkop in markup uitvoeren uit een array
const TabelKop = (arr) => {
   let kop = "<table class='boekSelectie'><tr>";
   arr.forEach((item) => {
      kop += "<th>" + item + "</th>";
   })
   kop += "</tr>";
   return kop;
}


// functie maakt van een array een opsomming met ', ' en ' en '
const Opsomming = (array) => {
   let string = "";
   for(let i=0; i<array.length; i++) {
      switch (i) {
         case array.length-1 : string += array[i]; break;
         case array.length-2 : string += array[i] + " en "; break;
         default: string += array[i] + ", ";
      }
   }
   return string;
}

// functie die van een maand-string een nummer maakt
// waarbij januari een 0 geeft
// en december een 11
const geefMaandNummer = (maand) => {
   let nummer;
   switch (maand) {
      case "januari": nummer = 0; break;
      case "februari": nummer = 1; break;
      case "maart": nummer = 2; break;
      case "april": nummer = 3; break;
      case "mei": nummer = 4; break;
      case "juni": nummer = 5; break;
      case "juli": nummer = 6; break;
      case "augustus": nummer = 7; break;
      case "september": nummer = 8; break;
      case "oktober": nummer = 9; break;
      case "november": nummer = 10; break;
      case "december": nummer = 11; break;

      default: nummer = 0
         break;
   }
   return nummer;
}

// functie die een string van maand jaar omzet in een date-object
const VoegJSDatum = (maandJaar) => {
   let mjArray = maandJaar.split(" ");
   let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
   return datum;
}

// object dat de boeken uitvoert en sorteert en data bevat
// eigenschappen: data sorteerkenmerk
// methods: sorteren() en uitvoeren()
let sorteerBoek = {
   data: "", // komt van xmlhttp.onreadystatechange

   kenmerk: "titel",

   // sorteervolgorde en factor
   lopend: 1,

   // een datumObject toevoegen aan this.data uit de string uitgave
   voegJSDatumtoe: function() {
      this.data.forEach((item)=> {
         item.Datums = VoegJSDatum(item.uitgave);
      });
   },

   // data sorteren
   sorteren: function() {
      this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.lopend: -1*this.lopend );
      this.uitvoeren(this.data);
   },

   // de data in een tabel uitvoeren
   uitvoeren: function(data) {
      data.forEach( boek =>{
         let sectie = document.createElement('section');
         sectie.className = 'boek';

         // Cover maken
         let afbeelding = document.createElement('img');
         afbeelding.className = 'boek__cover';
         afbeelding.setAttribute('src', boek.cover);
         afbeelding.setAttribute('alt', boek.titel);

         // titel
         let titel = document.createElement('h3');
         titel.className = 'boek__titel';
         titel.textContent = boek.titel;

         // element toevoegen
         sectie.appendChild(afbeelding);
         sectie.appendChild(titel);
         document.getElementById('uitvoer').appendChild(sectie);
      });
      }
}

// keuze voorsorteer opties
let kenmerk = document.getElementById('kenmerk').addEventListener('change', (e) => {
   sorteerBoek.kenmerk = e.target.value;
   sorteerBoek.sorteren();
});

document.getElementsByName('lopend').forEach((item) => {
   item.addEventListener('click', (e)=>{
      sorteerBoek.lopend = parseInt(e.target.value);
      sorteerBoek.sorteren();
   })
})
