let pytania = [];
let aktualnyIndex = 0;

export function ustawPytania(tablica) {
    pytania = Array.isArray(tablica) ? tablica : [];
    aktualnyIndex = 0;
}


export function pobierzAktualnePytanie() {
    if (aktualnyIndex < pytania.length) {
        return pytania[aktualnyIndex];
    }
    return null;
}


export function zapiszWynik(imie, wynik) {
    const wyniki = pobierzWyniki();
    const nowyWpis = {
        id: Date.now(),
        gracz: imie || "Anonim",
        wynik: wynik,
        lacznie: pytania.length
    };

    wyniki.push(nowyWpis);

    wyniki.sort((a, b) => b.wynik - a.wynik);

    localStorage.setItem('quiz_wyniki', JSON.stringify(wyniki.slice(0, 10)));
}


export function pobierzWyniki() {
    const dane = localStorage.getItem('quiz_wyniki');
    return dane ? JSON.parse(dane) : [];
}

export function przejdzDoNastepnegoPytania() {
    aktualnyIndex++;
}

export function pobierzIndeksPytania() {
    return aktualnyIndex;
}

export function pobierzLiczbePytan() {
    return pytania.length;
}