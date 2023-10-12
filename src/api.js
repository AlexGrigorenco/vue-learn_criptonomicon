
const API_KEY = '0c306692dcb0454412241eb93b1398b038e292c74c66c2ded01cfba0d11859eb'

export function loadTickerPrice(tickersTitleList) {
    return fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickersTitleList}&api_key=${API_KEY}`)
    .then(response => response.json())
    .then(rawData => {
        return Object.fromEntries(Object.entries(rawData).map(([key,value]) => [key, 1 / value]));
    })
}