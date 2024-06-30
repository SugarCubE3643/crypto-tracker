// --------- API OPTIONS --------- 
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "coin-gecko-demo-api-key": "CG-cze6HHUfoggiVAmzv8VhbNjJ",
    },
};


// --------- Temp Data Variables --------- 
let coins = [];

// --------- DOM Elements  --------- 
const shimmerContainer = document.getElementById('shimmer-container');


// --------- Fetch Coins  --------- 
const fetchFavouriteCoins = async (coinIDs) => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIDs.join(",")}`, options);
        const coinsData = await response.json();
        return coinsData;
    } catch (error) {
        console.error("Error while fetching coins", error);
    }
};


// --------- Shimmer screen functions --------- 
const showShimmer = () => {
    shimmerContainer.style.display = "flex";
};
const hideShimmer = () => {
    shimmerContainer.style.display = "none";
};

// ---------- Favourites functionality ----------
const saveFavouriteCoins = (favourites) => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
}
const getFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem('favourites')) || [];
}

// ---------- Display coins on page ----------
const displayFavouriteCoins = function (favCoins) {

    if (favCoins.length === 0) {
        const noFavMsg = document.getElementById('no-favourites');
        noFavMsg.style.display = "block";
    } else {
        const tableBody = document.getElementById('favourite-table-body');
        tableBody.innerHTML = '';

        favCoins.forEach((coin, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
                <td>${coin.name}</td>
                <td>$${coin.current_price.toLocaleString()}</td>
                <td>$${coin.total_volume.toLocaleString()}</td>
                <td>$${coin.market_cap.toLocaleString()}</td>
            `;

            row.addEventListener("click", () => {
                window.open(`../coin/coin.html?id=${coin.id}`, "_blank")
            });
            tableBody.appendChild(row);
        });
    }
};


document.addEventListener("DOMContentLoaded", async () => {

    showShimmer();
    const favourites = getFavouriteCoins();

    if (favourites.length > 0) {
        coins = await fetchFavouriteCoins(favourites);
        displayFavouriteCoins(coins);
    } else {
        displayFavouriteCoins([]);
    }
    hideShimmer();
});