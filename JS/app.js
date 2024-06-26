const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
    },
};

let coins = [];

const fetchCoins = async () => {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1%22", options);
        const coinsData = await response.json();
        return coinsData;
    } catch {
        console.error("Error while fetching coins");
    }
}

// Display data on page

const displayCoins = function () {
    const tableBody = document.getElementById('crypto-table-body');
    coins.forEach((coin, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index+1}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price}</td>
            <td>$${coin.total_volume}</td>
            <td>$${coin.market_cap}</td>
            <td><i class="fa-solid fa-star favourite-icon"></i></td>
        `;

        row.querySelector('.favourite-icon').addEventListener("click", (event)=>{
            // Stop the event propagation
            event.stopPropagation();

            // Handle the event
            handleFavCLick(coin.id);
        });
        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    coins = await fetchCoins();
    displayCoins(coins);
})