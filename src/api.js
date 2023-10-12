
const API_KEY = '0c306692dcb0454412241eb93b1398b038e292c74c66c2ded01cfba0d11859eb';

const tickersHandlers = new Map();

function loadTickerPrice(tickersTitleList) {
    if(tickersTitleList.size === 0){
        return
    }
    
    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickersTitleList}&tsyms=USD&api_key=${API_KEY}`)
    .then(response => response.json())
    .then(rawData => {
        
        const udatedPrices = Object.fromEntries(Object.entries(rawData).map(([key,value]) => [key, value.USD]));
        
        Object.entries(udatedPrices).forEach(([currency, newPrice]) => {
            const handlers = tickersHandlers.get(currency) ?? [];
            handlers.forEach(fn => fn(newPrice));
        })
    })
}

export function subscribeToUpdateTickers(ticker, cb){
    const subscribers = tickersHandlers.get(ticker)  || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
}

export function unSubscribeFromUpdateTickers(ticker){
    tickersHandlers.delete(ticker)
    // const subscribers = tickersHandlers.get(ticker)  || [];
    // tickersHandlers.set(ticker, subscribers.filter(fn => fn !== cb)) ;
}



export function getCoinsSymbolsList (){
    return fetch(`https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=${API_KEY}`)
    .then(response => response.json())
    .then(rawData => Object.values(rawData.Data).map(item => item.Symbol));
}

setInterval(() => {
    loadTickerPrice(Array.from(tickersHandlers.keys()).join(','))
}, 3000);


window.ticker = tickersHandlers