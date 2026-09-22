const elPytanieNumer = document.getElementById('pytanie-numer');
const elPytanieTresc = document.getElementById('pytanie-tresc');
const elOdpowiedziKontener = document.getElementById('odpowiedzi-kontener');
const elKomunikat = document.getElementById('komunikat');
const elTabelaWynikowBody = document.getElementById('tabela-wynikow-body');

export function rysujPytanie(pytanie, numer, lacznie) {
    if (!pytanie) return;

    if (elPytanieNumer) {
        elPytanieNumer.textContent = `Pytanie ${numer}/${lacznie}`;
    }

    if (elPytanieTresc) {
        elPytanieTresc.textContent = pytanie.pytanie;
    }

    if (elOdpowiedziKontener) {
        elOdpowiedziKontener.innerHTML = '';
        const etykiety = ['A', 'B', 'C', 'D'];

        pytanie.odpowiedzi.forEach((odp, index) => {
            const przycisk = document.createElement('button');
            przycisk.className = 'przycisk-odpowiedz';
            przycisk.dataset.index = index;
            przycisk.textContent = `${etykiety[index]}: ${odp}`;
            elOdpowiedziKontener.appendChild(przycisk);
        });
    }

    pokazKomunikat('', true);
}

export function pokazKomunikat(tekst, czySukces = true) {
    if (!elKomunikat) return;

    elKomunikat.textContent = tekst;
    elKomunikat.className = 'komunikat-status';

    if (tekst) {
        elKomunikat.classList.add(czySukces ? 'sukces' : 'blad');
    }
}

export function rysujWyniki(tablicaWynikow) {
    if (!elTabelaWynikowBody) return;

    elTabelaWynikowBody.innerHTML = '';

    if (!Array.isArray(tablicaWynikow) || tablicaWynikow.length === 0) {
        const wiersz = document.createElement('tr');
        wiersz.innerHTML = `<td colspan="3">Brak zapisanych wyników</td>`;
        elTabelaWynikowBody.appendChild(wiersz);
        return;
    }

    tablicaWynikow.forEach((item, index) => {
        const wiersz = document.createElement('tr');
        wiersz.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(item.gracz)}</td>
      <td>${item.wynik} / ${item.lacznie || 10}</td>
    `;
        elTabelaWynikowBody.appendChild(wiersz);
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}