// --------- API OPTIONS --------- 
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "coin-gecko-demo-api-key": "CG-cze6HHUfoggiVAmzv8VhbNjJ",
        "Access-Control-Allow-Origin": "*"
    },
};


// --------- Temp Data Variables --------- 
const urlParam = new URLSearchParams(window.location.search);
const coinID = urlParam.get("id");


// --------- DOM Elements  --------- 
const coinContainer = document.getElementById('coin-container');
const shimmerContainer = document.querySelector('.shimmer-container');
const coinImage = document.getElementById('coin-image');
const coinName = document.getElementById('coin-name');
const coinDescription = document.getElementById('coin-description');
const coinRank = document.getElementById('coin-rank');
const coinPrice = document.getElementById('coin-price');
const coinMarketCap = document.getElementById('coin-market-cap');
const ctx = document.getElementById('coinChart');
const buttonContainer = document.querySelector('.button-container');


// --------- Shimmer screen functions --------- 
const showShimmer = () => {
    shimmerContainer.style.display = "flex";
};
const hideShimmer = () => {
    shimmerContainer.style.display = "none";
};


// --------- Fetch Coin Data  --------- 
const fetchCoinData = async () => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinID}`, options);
        const coinData = await response.json();
        return coinData;
    } catch (error) {
        console.error("Error while fetching coin data", error);
    }
};


// --------- Display Coin Data  --------- 
const displayCoinData = (coinData) => {
    coinImage.src = coinData.image.large;
    coinImage.alt = coinData.name;
    coinDescription.textContent = coinData.description.en.split('.')[0] + '.';
    coinRank.textContent = coinData.market_cap_rank;
    coinName.textContent = coinData.name;
    coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocaleString()}`;
    coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`;
}

// --------- Coin Chart  --------- 
const coinChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Price (USD)',
            data: [],
            borderWidth: 1,
            borderColor: '#eebc1d',
            fill: false
        }]
    },
});

const fetchChartData = async (days) => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinID}/market_chart?vs_currency=usd&days=${days}`, options);
        const chartData = await response.json();
        updateChart(chartData.prices);
    } catch (error) {
        console.error("Error while fetching chart data", error);
    }
}

const updateChart = (prices) => {
    const data = prices.map((price) => price[1]);
    const labels = prices.map((price) => {
        let date = new Date(price[0]);
        return date.toLocaleDateString();
    });

    coinChart.data.labels = labels;
    coinChart.data.datasets[0].data = data;
    coinChart.update();
};


Array.from(buttonContainer.children).forEach((button) => {
    button.addEventListener("click", (event) => {
        const days = event.target.id === '24h' ? 1 : event.target.id === '30d' ? 30 : 90;

        Array.from(buttonContainer.children).forEach((button) => {
            if(button.id === event.target.id){
                event.target.classList.add('active');
            } else {
                event.target.classList.remove('active');
            }
        });

        fetchChartData(days);
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    const coinData = await fetchCoinData();
    displayCoinData(coinData);
    document.getElementById('24h').click();
});