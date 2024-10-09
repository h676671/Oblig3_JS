"use strict";
class DeltagerManager {
  // Deklarer felt-variabler her
  startnrInput = document.getElementById("startnummer");
  //deltagernavnInput = document.getElementById("deltagernavn");

  deltagernavnInput = document.getElementsByTagName("input")[1];
  sluttidInput = document.getElementById("sluttid");
  button = document.getElementsByTagName("button")[0];
  showDeltagereBtn = document.getElementsByTagName("button")[1];

  deltagere = [];

  constructor(root) {
    /* rootelement = root; */

    // Deklarer metoder her
    this.button.addEventListener("click", () => this.leggTilDeltager());

    this.showDeltagereBtn.addEventListener("click", () => this.visDeltagere());
  }

  // Deklarer klassen sine public og private metoder her

  leggTilDeltager() {
    const startnr = this.startnrInput.value;
    const deltagernavn = this.deltagernavnInput.value;
    const sluttid = this.sluttidInput.value;

    const regex =
      /^([A-Z][a-z]+(-[A-Z][a-z]+)*)+( [A-Z][a-z]+(-[A-Z][a-z]+)*)*$/;

    //Må fikse at startnr ikke er det samme
    if (startnr !== "" || deltagernavn !== "" || sluttid !== "") {
      
      const startnrExist = this.deltagere.some(
        (deltager) => deltager.startnummer === startnr
      );

      if (startnrExist) {
        this.startnrInput.reportValidity("Startnummer eksisterer allerede");
        return;
      }

      //Tester om deltagernavn er gyldig
      if (regex.test(deltagernavn)) {
        // Oppretter et deltager-objekt hvis alle feltene er fylt
        const deltager = {
          startnummer: startnr,
          navn: deltagernavn,
          sluttid: sluttid,
        };

        // Fjerner hidden klassen på <p> elementet slik at det vises
        const paragraph = rootelement.getElementsByTagName("p")[0];
        paragraph.classList.remove("hidden");

        const innhold = paragraph.getElementsByTagName("span");

        innhold[0].textContent = deltager.navn;
        innhold[1].textContent = deltager.startnummer;
        innhold[2].textContent = deltager.sluttid;

        this.deltagere.push(deltager);
        console.log("Registrert deltager:", deltager);

        this.startnrInput.value = "";
        this.deltagernavnInput.value = "";
        this.sluttidInput.value = "";

        // Gjør <p> elementet hidden igjen etter 5 sekunder
        setTimeout(() => {
          paragraph.classList.add("hidden");
        }, 5000);
      } else {
        this.deltagernavnInput.reportValidity(
          this.deltagernavnInput.getAttribute("title")
        );
      }
    }
  }

  visDeltagere() {
    //Table row

    const liste = document.getElementsByTagName("tbody")[0];
    const nedregrense = document.getElementById("nedregrense");
    const ovregrense = document.getElementById("ovregrense");

    //Gjør at vi ikke får duplikater (hvis vi adder først en og så trykker vis, så får vi duplikater når vi trykker vis igjen)
    liste.innerHTML = "";

    //Ser komplisert ut men er egentlig veldig simpelt

    //Gjør det lettere å filtrere på tid
    const timeToSec = (sluttid) => {
      const [timer, minutter, sec] = sluttid.split(":").map(Number);

      //3600 sekunder i en time, 60 sekunder i et minutt, 1 sekund i et sekund
      return timer * 3600 + minutter * 60 + sec;
    };

    const rangering = this.deltagere.sort((first, second) => {
      return timeToSec(first.sluttid) - timeToSec(second.sluttid);
    });

    const tidFilter =
      nedregrense.value && ovregrense.value
        ? rangering.filter((deltager) => {
            const slutTidSec = timeToSec(deltager.sluttid);
            return (
              slutTidSec >= timeToSec(nedregrense.value) &&
              slutTidSec <= timeToSec(ovregrense.value)
            );
          })
        : rangering; //Hvis nedregrense eller ovregrense er tomme, så viser vi alle deltagere

    //Itterer over tidFilter istedenfor deltager, da skal jeg få ut alle deltagerne om jeg ikke har noen grenser
    tidFilter.map((deltager, index) => {
      const tr = document.createElement("tr");

      //Finere måte å lage flere konstanter som gjør det samme
      /* const [tdPlassering, tdNr, tdNavn, tdSluttid] =
          document.createElement("td"); */

      const tdPlassering = document.createElement("td");
      const tdNr = document.createElement("td");
      const tdNavn = document.createElement("td");
      const tdSluttid = document.createElement("td");

      liste.appendChild(tr);

      tr.appendChild(tdPlassering);
      tr.appendChild(tdNr);
      tr.appendChild(tdNavn);
      tr.appendChild(tdSluttid);

      tdPlassering.textContent = index + 1; //Plus 1 eller så får vi plassering 0, som ikke gir mening i denne konteksten
      tdNr.textContent = deltager.startnummer;
      tdNavn.textContent = deltager.navn;
      tdSluttid.textContent = deltager.sluttid;
    });

    console.log(this.deltagere.map((deltagere) => deltagere.navn));
  }
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);
