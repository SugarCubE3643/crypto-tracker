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
const itemsPerPage = 15;
let currentPage = 1;


// --------- DOM Elements  --------- 
const shimmerContainer = document.getElementById('shimmer-container');
const paginationContainer = document.getElementById('pagination-container');
const sortPriceAsc = document.getElementById('sort-price-asc');
const sortPriceDesc = document.getElementById('sort-price-desc');
const sortVolumeAsc = document.getElementById('sort-volume-asc');
const sortVolumeDesc = document.getElementById('sort-volume-desc');
const searchBox = document.getElementById('search-box');


// --------- Fetch Coins  --------- 
const fetchCoins = async () => {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1%22", options);
        const coinsData = await response.json();
        return coinsData;
    } catch {
        console.error("Error while fetching coins");
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
    
    console.log(JSON.parse(localStorage.getItem('favourites')) || []);
    return JSON.parse(localStorage.getItem('favourites')) || [];
}
const handleFavCLick = (coinElement) => {
    let favourites = getFavouriteCoins();

    // console.log(favourites, typeof favourites, JSON.parse(localStorage.getItem('favourites')));
    if(favourites.includes(coinElement.dataset.id)){
        favourites = favourites.filter((id) => id !== coinElement.dataset.id);
    }else {
        favourites.push(coinElement.dataset.id);
    }

    saveFavouriteCoins(favourites);
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
};

// ---------- Sort functionality ----------
sortPriceAsc.addEventListener("click", () => {
    sortCoinsByPrice('price-asc');
});

sortPriceDesc.addEventListener("click", () => {
    sortCoinsByPrice('price-desc');
});

sortVolumeAsc.addEventListener("click", () => {
    sortCoinsByPrice('volume-asc');
});

sortVolumeDesc.addEventListener("click", () => {
    sortCoinsByPrice('volume-desc');
});

const sortCoinsByPrice = (order) => {
    if(order === 'price-asc'){
        coins.sort((a, b) => a.current_price - b.current_price);
    } else if( order === 'price-desc'){
        coins.sort((a, b) => b.current_price - a.current_price);
    } else if(order === 'volume-asc'){
        coins.sort((a, b) => a.total_volume - b.total_volume);
    } else if( order === 'volume-desc'){
        coins.sort((a, b) => b.total_volume - a.total_volume);
    }

    currentPage = 1;
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
    renderPagination(coins);
};


// ---------- Search functionality ----------
searchBox.addEventListener('input', (event) => {
    handleSearch();
});

const handleSearch = () => {
    const searchQuery = searchBox.value.trim();
    const filteredCoins = coins.filter((coin) => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    currentPage = 1;
    displayCoins(getCoinsToDisplay(filteredCoins, currentPage), currentPage);
    renderPagination(filteredCoins);
}



// --------- Get list of coins to feed displayCoins ----------
const getCoinsToDisplay = (coins, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return coins.slice(start, end);
};

// ---------- Display coins on page ----------
const displayCoins = function (coins, currentPage) {

    const start = (currentPage - 1) * itemsPerPage + 1;
    const favourites = getFavouriteCoins();

    const tableBody = document.getElementById('crypto-table-body');
    tableBody.innerHTML = '';
    coins.forEach((coin, index) => {
        const row = document.createElement("tr");
        const isFav = favourites.includes(coin.id) ? 'favourite' : '';

        row.innerHTML = `
            <td>${start + index}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24"></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td><div class="favourite-icon ${isFav}" data-id="${coin.id}"><i class="fa-solid fa-star"></i></div></td>
        `;

        row.addEventListener("click", () => {
            window.open(`coin/coin.html?id=${coin.id}`, "_blank")
        });

        row.querySelector('.favourite-icon').addEventListener("click", (event) => {
            // Stop the event propagation
            event.stopPropagation();

            // Handle the event
            console.log(event);
            handleFavCLick(event.currentTarget);
        });
        tableBody.appendChild(row);
    });
};


// ---------- Update Pagination button ---------- 
const updatePaginationButtons = () => {

    const pageBtns = document.querySelectorAll('.page-button');
    pageBtns.forEach((button, index) => {
        if(index + 1 === currentPage){
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
};

// ---------- Render pagination ----------
const renderPagination = (coins) => {
    const totalPages = Math.ceil(coins.length / itemsPerPage);

    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;        
        pageBtn.classList.add('page-button');

        if(i === currentPage) {
            pageBtn.classList.add('active');
        }

        pageBtn.addEventListener("click", () => {
            currentPage = i;

            displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);

            updatePaginationButtons();
        });

        paginationContainer.appendChild(pageBtn);
    }
};



document.addEventListener("DOMContentLoaded", async () => {

    try {
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
        renderPagination(coins);
        hideShimmer()
    } catch (error) {
        console.log(error); // Replacement for toast
        hideShimmer();
    }

});