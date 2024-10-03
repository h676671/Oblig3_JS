"use strict";
class DeltagerManager {
  // Deklarer felt-variabler her
  startnrInput = document.getElementById("startnummer");
  deltagernavnInput = document.getElementById("deltagernavn");
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

    if (startnr !== "" || deltagernavn !== "" || sluttid !== "") {
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

        // Gjør <p> elementet hidden igjen etter 5 sekunder
        setTimeout(() => {
          paragraph.classList.add("hidden");
        }, 5000);
      } else {
        //WTF
        deltagernavn.setCustomValidity("Navn må starte med en stor bokstav");
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

    //Hvis nedregrense eller ovregrense er tomme, så viser vi alle deltagere
    if (nedregrense.value === "" || ovregrense.value === "") {
      this.deltagere.map((deltager, index) => {
        const tr = document.createElement("tr");

        //Lager celler for hver attributt
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
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);
