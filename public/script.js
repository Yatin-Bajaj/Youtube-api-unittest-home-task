const env = {
  youtube_data_url: "https://www.googleapis.com/youtube/v3/search?key=AIzaSyD9-a8Pihxz8mPAK8TN-YQgSDcdh2uTlfI&type=video&part=snippet&maxResults=15&q=",
  youtube_stats_url: " https://www.googleapis.com/youtube/v3/videos?key=AIzaSyD9-a8Pihxz8mPAK8TN-YQgSDcdh2uTlfI&id="
}
let ITEM_PER_PAGE = Math.floor(window.innerWidth / 350);
let UPDATED_ITEM_PER_PAGE = undefined;
let videos = []; // array to store all the video results
let currentPage = 1;

const pageNumbersContainer = document.querySelector("#page_number");
const paginationContainer = document.querySelector('.pagination')
const container = document.querySelector(".card-container");
const prevButton = document.querySelector("#previous_btn");
const nextButton = document.querySelector("#next_btn");

// <--------------- Fetching Data from Server Functionality ---------------------------->

function prepareData(data) {
  const newItemsArray = data.items.map((item) => {
    const { title, channelTitle: author, publishedAt, description } = item?.snippet;
    const { high: image } = item?.snippet?.thumbnails;
    const { viewCount } = item?.statistics;
    const { id } = item;
    const videoUrl = `https://www.youtube.com/watch?v=${id}`
    return { title, author, publishedAt, description, image, videoUrl, viewCount };
  })
  return newItemsArray;
}

async function fetchYoutubeData(searchInput) {
  console.log("Inside fetchYoutubeData")

  try {
    const response = await fetch(`${env.youtube_data_url}${searchInput}`)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    const data = await response.json()
    const videoIds = data.items.map((item) => item.id.videoId).join(',');
    const newResponse = await fetch(`${env.youtube_stats_url}${videoIds}&part=snippet,statistics`);
    const dataWithStats = await newResponse.json();
    return prepareData(dataWithStats);
  } catch (error) {
    return console.log(error)
  }
}

// <--------------- Pagination Functionality ---------------------------->

function paginationButtonHandler(event) {
  const pageNumber = Number(event?.target.dataset.page);
  if (pageNumber) {
    currentPage = pageNumber;
    renderCards();
    buttonsDisplayHandler();
  }
};

function renderPaginationButtons() {
  const totalPages = Math.ceil(videos.length / ITEM_PER_PAGE);
  if (paginationContainer) {
    pageNumbersContainer.innerHTML = "";
  }
  for (let index = 1; index <= totalPages; index++) {
    paginationContainer?.classList.remove('hidden')
    const numberButton = document.createElement("button");
    numberButton.innerText = `${index}`;
    numberButton.setAttribute("data-page", `${index}`);
    numberButton.classList.add("pagination_button");
    if (index == currentPage) {
      numberButton.classList.add("active");
    }
    numberButton?.addEventListener("click", paginationButtonHandler);
    pageNumbersContainer?.appendChild(numberButton);
  }

}


function buttonsDisplayHandler() {
  if (currentPage === 1) {
    prevButton?.classList.add("disabled");
  } else {
    prevButton?.classList.remove("disabled");
  }

  if (currentPage === Math.ceil(videos.length / ITEM_PER_PAGE)) {
    nextButton?.classList.add("disabled");
  } else {
    nextButton?.classList.remove("disabled");
  }

  if (currentPage >= 1) {
    var selectItem = `[data-page= '${currentPage}' ]`
    document.querySelector('#page_number .active')?.classList.remove('active');
    document.querySelector(selectItem)?.classList.add('active');
  }

};


function nextClickHandler() {
  if (currentPage < Math.ceil(15 / ITEM_PER_PAGE)) {
    currentPage++;
    renderCards();
    buttonsDisplayHandler();
  }

};

function prevClickHandler() {
  if (currentPage > 1) {
    currentPage--;
    renderCards();
    buttonsDisplayHandler();
  }
};

function convertViewsCount(views) {
  if (views >= 1000000) {
    return views.slice(0, -6) + "." + views.slice(-6, -5) + "M";
  }
  if (views >= 1000) {
    return views.slice(0, -3) + "k";
  }
  return views;
}

function convertDateFormat(currentDate) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(currentDate).toLocaleDateString("en-US", options);
}

function mapDataToCard(data) {
  return data.map((item) => {
    const cardTemplate = `
        <div class="card">
            <div class="card-header">
                <figure class="card-figure">
                    <img src=${item.image.url
      } alt="movie" width="200" height="200">
                </figure>
            </div>
            <div class="card-body">
                <h3 class="movie-title"> ${item.title}</h3>
                <div class="movie-info">
                    <div class="description">Description : <span>${item.description || " Not Available"
      }</span></div>
                    <div class="author">Author : <span>${item.author
      }</span></div>
                    <div class="publish_date">Published At : <span>${convertDateFormat(item.publishedAt)
      }</span></div>
                    <div class="view_count">View Count : <span>${convertViewsCount(item.viewCount)
      }</span></div>
                </div>
            </div>
            <div class="link">
                <a href=${item.videoUrl
      } class="link_btn" target="_blank">Link</a>
            </div>
        </div>
    `;
    return cardTemplate;
  });
};

function renderCards() {
  const startIndex = (currentPage - 1) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const videosToShow = videos.slice(startIndex, endIndex);

  const cards = mapDataToCard(videosToShow);
  if (container) {
    container.innerHTML = "";
    cards.forEach((card) => {
      container.innerHTML += card;
    });
  }
};

function renderView(data) {
  videos = data;
  renderCards();
  renderPaginationButtons();
  buttonsDisplayHandler();
}

async function searchHandler(value) {
  console.log("Inside Search handler")
  value = value.length > 0 ? value : "EPAM SYSTEM US";
  const data = await fetchYoutubeData(value);
  renderView(data)
}

function debounce(func, delay) {
  let timer;
  return function (value) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func(value)
    }, delay);
  }
}

const optimizedSearchHandler = debounce(searchHandler, 1000);

const userInputElement = document.querySelector('#user-input')

userInputElement && userInputElement.addEventListener("input", function (event) {
  optimizedSearchHandler(event.target.value)
});

prevButton?.addEventListener("click", prevClickHandler);
nextButton?.addEventListener("click", nextClickHandler);

function windowResizeHandler() {
  UPDATED_ITEM_PER_PAGE = Math.floor(window.innerWidth / 330);

  if (UPDATED_ITEM_PER_PAGE != ITEM_PER_PAGE) {
    ITEM_PER_PAGE = UPDATED_ITEM_PER_PAGE;
    renderCards();
    renderPaginationButtons()
  }
}

window.addEventListener('resize', windowResizeHandler);

searchHandler("")