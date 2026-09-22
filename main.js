import { pobierzPytania } from './api.js';
import {
    ustawPytania,
    pobierzAktualnePytanie,
    zapiszWynik,
    pobierzWyniki,
    przejdzDoNastepnegoPytania,
    pobierzIndeksPytania,
    pobierzLiczbePytan
} from './stan.js';
import { rysujPytanie, pokazKomunikat, rysujWyniki } from './widok.js';

// Elementy DOM
const ekranStartowy = document.getElementById('ekran-startowy');
const ekranQuizu = document.getElementById('ekran-quizu');
const ekranKoncowy = document.getElementById('ekran-koncowy');

const graczImieInput = document.getElementById('gracz-imie');
const startBtn = document.getElementById('start-btn');
const nastepneBtn = document.getElementById('nastepne-btn');
const restartBtn = document.getElementById('restart-btn');
const czasLicznikEl = document.getElementById('czas-licznik');
const wynikKoncowyEl = document.getElementById('wynik-koncowy');
const odpowiedziKontener = document.getElementById('odpowiedzi-kontener');

let punkty = 0;
let nazwaGracza = '';
let timer = null;
let pozostalyCzas = 15;


function losujTablice(array) {
    return [...array].sort(() => Math.random() - 0.5);
}


async function inicjalizujAplikacje() {
    rysujWyniki(pobierzWyniki());

    startBtn.addEventListener('click', obsluzStart);
    nastepneBtn.addEventListener('click', obsluzNastepnePytanie);
    restartBtn.addEventListener('click', obsluzRestart);
    odpowiedziKontener.addEventListener('click', obsluzWyborOdpowiedzi);
}


async function obsluzStart() {
    nazwaGracza = graczImieInput.value.trim();

    if (!nazwaGracza) {
        alert('Proszę wpisać swoje imię!');
        return;
    }

    try {
        const pobranePytania = await pobierzPytania();
        const wymieszanePytania = losujTablice(pobranePytania);

        ustawPytania(wymieszanePytania);
        punkty = 0;

        ekranStartowy.classList.add('ukryty');
        ekranKoncowy.classList.add('ukryty');
        ekranQuizu.classList.remove('ukryty');

        zaladujPytanie();
    } catch (err) {
        alert('Nie udało się załadować pytań z pliku JSON.');
    }
}


function zaladujPytanie() {
    resetujTimer();
    const pytanie = pobierzAktualnePytanie();
    const numer = pobierzIndeksPytania() + 1;
    const lacznie = pobierzLiczbePytan();

    nastepneBtn.classList.add('ukryty');
    rysujPytanie(pytanie, numer, lacznie);
    uruchomTimer();
}


function obsluzWyborOdpowiedzi(e) {
    const przycisk = e.target.closest('.przycisk-odpowiedz');
    if (!przycisk || przycisk.disabled) return;

    zatrzymajTimer();
    const wybranyIndex = parseInt(przycisk.dataset.index, 10);
    const pytanie = pobierzAktualnePytanie();

    const wszystkiePrzyciski = odpowiedziKontener.querySelectorAll('.przycisk-odpowiedz');
    wszystkiePrzyciski.forEach(btn => btn.disabled = true);

    if (wybranyIndex === pytanie.poprawna) {
        punkty++;
        przycisk.classList.add('poprawna');
        pokazKomunikat('Poprawna odpowiedź!', true);
    } else {
        przycisk.classList.add('bledna');
        if (wszystkiePrzyciski[pytanie.poprawna]) {
            wszystkiePrzyciski[pytanie.poprawna].classList.add('poprawna');
        }
        pokazKomunikat('Błędna odpowiedź!', false);
    }

    nastepneBtn.classList.remove('ukryty');
}


function obsluzNastepnePytanie() {
    przejdzDoNastepnegoPytania();

    if (pobierzIndeksPytania() < pobierzLiczbePytan()) {
        zaladujPytanie();
    } else {
        zakonczQuiz();
    }
}


function zakonczQuiz() {
    zatrzymajTimer();
    ekranQuizu.classList.add('ukryty');
    ekranKoncowy.classList.remove('ukryty');

    const lacznie = pobierzLiczbePytan();
    wynikKoncowyEl.textContent = `Twój wynik: ${punkty} / ${lacznie}`;

    zapiszWynik(nazwaGracza, punkty);
    rysujWyniki(pobierzWyniki());
}


function obsluzRestart() {
    graczImieInput.value = '';
    ekranKoncowy.classList.add('ukryty');
    ekranStartowy.classList.remove('ukryty');
}


function uruchomTimer() {
    pozostalyCzas = 15;
    czasLicznikEl.textContent = `Czas: ${pozostalyCzas}s`;

    timer = setInterval(() => {
        pozostalyCzas--;
        czasLicznikEl.textContent = `Czas: ${pozostalyCzas}s`;

        if (pozostalyCzas <= 0) {
            zatrzymajTimer();
            pokazKomunikat('Czas minął!', false);

            const pytanie = pobierzAktualnePytanie();
            const wszystkiePrzyciski = odpowiedziKontener.querySelectorAll('.przycisk-odpowiedz');

            wszystkiePrzyciski.forEach(btn => btn.disabled = true);
            if (wszystkiePrzyciski[pytanie.poprawna]) {
                wszystkiePrzyciski[pytanie.poprawna].classList.add('poprawna');
            }

            nastepneBtn.classList.remove('ukryty');
        }
    }, 1000);
}

function zatrzymajTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function resetujTimer() {
    zatrzymajTimer();
    czasLicznikEl.textContent = 'Czas: 15s';
}

document.addEventListener('DOMContentLoaded', inicjalizujAplikacje);
