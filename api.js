export async function pobierzPytania() {
    try {
        const response = await fetch('pytania.json');

        if (!response.ok) {
            throw new Error(`Nie udało się pobrać pytań (Kod błędu: ${response.status})`);
        }

        const pytania = await response.json();
        return pytania;
    } catch (error) {
        console.error('Błąd w module API:', error);
        throw error;
    }
}