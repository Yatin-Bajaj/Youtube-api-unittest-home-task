describe("Youtube", () => {

  var rawdata = {
    kind: "youtube#searchListResponse",
    etag: "GhC-w6xoiSiokbmcHxvqGWj2UfM",
    nextPageToken: "CBQQAA",
    regionCode: "IN",
    pageInfo: {
      totalResults: 1000000,
      resultsPerPage: 20,
    },
    items: [
      {
        kind: "youtube#searchResult",
        etag: "zAOsWrd8n8L-xwYcJBjhWu4OWjk",
        id: "lf2qmJEZj6o",
        snippet: {
          publishedAt: "2023-01-19T19:30:45Z",
          channelId: "UCm71Z36uSgQtoNmnYjelvNA",
          title:
            "Human trafficking is real. It&#39;s happening. #nickvujicic #limblesspreacher #hope #christian  #shorts",
          description: "",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/lf2qmJEZj6o/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/lf2qmJEZj6o/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/lf2qmJEZj6o/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Life Without Limbs: Nick Vujicic Ministries",
          liveBroadcastContent: "none",
          publishTime: "2023-01-19T19:30:45Z",
        },
        statistics: { viewCount: "1000" },
      },
    ],
  };

  var preparedData = [
    {
      title:
        "Human trafficking is real. It&#39;s happening. #nickvujicic #limblesspreacher #hope #christian  #shorts",
      author: "Life Without Limbs: Nick Vujicic Ministries",
      publishedAt: "2023-01-19T19:30:45Z",
      description: "",
      image: {
        url: "https://i.ytimg.com/vi/lf2qmJEZj6o/hqdefault.jpg",
        width: 480,
        height: 360,
      },
      videoUrl: "https://www.youtube.com/watch?v=lf2qmJEZj6o",
      viewCount: "1000",
    },
  ];

  var response = {
    kind: "youtube#searchListResponse",
    etag: "GhC-w6xoiSiokbmcHxvqGWj2UfM",
    nextPageToken: "CBQQAA",
    regionCode: "IN",
    pageInfo: {
      totalResults: 1000000,
      resultsPerPage: 20,
    },
    items: [
      {
        kind: "youtube#searchResult",
        etag: "zAOsWrd8n8L-xwYcJBjhWu4OWjk",
        id: {
          kind: "youtube#video",
          videoId: "lf2qmJEZj6o",
        },
        snippet: {
          publishedAt: "2023-01-19T19:30:45Z",
          channelId: "UCm71Z36uSgQtoNmnYjelvNA",
          title:
            "Human trafficking is real. It&#39;s happening. #nickvujicic #limblesspreacher #hope #christian  #shorts",
          description: "",
          thumbnails: {
            default: {
              url: "https://i.ytimg.com/vi/lf2qmJEZj6o/default.jpg",
              width: 120,
              height: 90,
            },
            medium: {
              url: "https://i.ytimg.com/vi/lf2qmJEZj6o/mqdefault.jpg",
              width: 320,
              height: 180,
            },
            high: {
              url: "https://i.ytimg.com/vi/lf2qmJEZj6o/hqdefault.jpg",
              width: 480,
              height: 360,
            },
          },
          channelTitle: "Life Without Limbs: Nick Vujicic Ministries",
          liveBroadcastContent: "none",
          publishTime: "2023-01-19T19:30:45Z",
        },
        statistics: { viewCount: "1000" },
      },
    ],
  };

  describe("searchHandler", () => {
    let fetchYoutubeDataSpy;
    let renderViewSpy;

    beforeEach(() => {
      fetchYoutubeDataSpy = spyOn(window, "fetchYoutubeData");
      renderViewSpy = spyOn(window, "renderView");
    });

    afterEach(() => {
      document.body.innerHTML = "";
    })

    it("should call event listener on input ", () => {
      // setup dom for testing evet listener
      document.body.innerHTML = `
      <input type="text" id="user-input">
     `;

      // Get the search input and button elements
      let searchInput = document.querySelector("#user-input");

      // Spy of listener
      const listenerSpy = spyOn(window, "searchHandler");

      searchInput.addEventListener("input", () => {
        searchHandler(searchInput.value);
      });

      // setting value
      const inputValue = "test value";
      searchInput.value = inputValue;

      // Trigger the input event on the search input
      searchInput.dispatchEvent(new Event("input"));

      expect(listenerSpy).toHaveBeenCalled();
      expect(listenerSpy).toHaveBeenCalledTimes(1);
    });

    it("search Handler should call fetchYoutubeData function", async () => {
      await searchHandler("js");
      expect(fetchYoutubeDataSpy).toHaveBeenCalled();
    });

    it("search Handler should call renderView function", async () => {
      await searchHandler("js");
      expect(renderViewSpy).toHaveBeenCalled();
    });

  });

  describe("should fetch data and prepare data for view", () => {
    let originalFetch;

    beforeEach(() => {
      originalFetch = window.fetch; // Save the original fetch method so we can restore it later
    });

    afterEach(() => {
      // Replace the fetch method with a fake one that always returns our fake response
      window.fetch = originalFetch;
    });

    it("should call fetch method with correct URL", async () => {
      window.fetch = jasmine
        .createSpy()
        .and.returnValue(
          Promise.resolve(new Response(JSON.stringify(response)))
        );

      await fetchYoutubeData();

      expect(window.fetch).toHaveBeenCalled();
      expect(window.fetch).toHaveBeenCalledTimes(2);

      expect(window.fetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/youtube/v3/search?key=AIzaSyD9-a8Pihxz8mPAK8TN-YQgSDcdh2uTlfI&type=video&part=snippet&maxResults=15&q=undefined"
      );
    });

    it("should handle request rejected", async () => {
      window.fetch = jasmine
        .createSpy()
        .and.returnValue(
          Promise.reject(new Error('Request failed'))
        );

      try {
        const response = await fetchYoutubeData()
      } catch (error) {
        expect(error).toEqual(new Error('Request failed'));
      }

    });

    it('should handle non-OK status codes', async () => {
      const mockResponse = {
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ error: 'Resource not found' })
      };

      window.fetch = jasmine
        .createSpy()
        .and.returnValue(
          Promise.resolve(mockResponse)
        );

      try {
        const response = await fetchYoutubeData();
      } catch (error) {
        expect(error).toContain('Not Found');
        expect(error).toContain('Resource not found');
      }
    });

    it("prepare Data ", () => {
      expect(prepareData(rawdata)).toEqual(preparedData);
    });

  })

  describe("view and date convertor", () => {

    it("Date converter", () => {
      expect(convertDateFormat("2023-01-19T14:32:07Z")).toBe("January 19, 2023");
      expect(convertDateFormat("2022-12-21T05:30:04Z")).toEqual("December 21, 2022");
    });

    it("View converter", () => {
      expect(convertViewsCount("5000000")).toBe("5.0M");
      expect(convertViewsCount("50000")).toBe("50k");
      expect(convertViewsCount("650000")).toBe("650k");
      expect(convertViewsCount("400")).toBe("400");
    });


  })

  describe("Next Button, Previous Button and Pagination Button Checks", () => {
    let windowResizeHandlerSpy;

    beforeEach(() => {
      windowResizeHandlerSpy = spyOn(window, "windowResizeHandler")

    })
    afterEach(() => {
      document.body.innerHTML = "";
    })
    it("should increase the count onclick of next button", () => {
      let currentPageCount = currentPage;  // 1
      nextClickHandler();   // 2
      expect(currentPage).toBeGreaterThan(currentPageCount);
    });

    it("should decrease the count onclick of previous button", () => {
      let currentPageCount = currentPage;  // 1
      prevClickHandler();
      expect(currentPage).toBeLessThanOrEqual(currentPageCount);
    });

    it("should call event paginationButtonHandler on pagination button click", () => {
      // setup dom for testing evet listener

      let paginationButton = document.createElement("button");

      paginationButton.classList.add("pagination_button")
      paginationButton.setAttribute("data-page", "1")
      paginationButton.addEventListener("click", () => {
        paginationButtonHandler();
      });

      document.body.appendChild(paginationButton);

      // Spy of paginationButtonHandler
      const paginationButtonHandlerSpy = spyOn(window, "paginationButtonHandler");

      // Trigger the input event on the search input
      paginationButton.dispatchEvent(new Event("click"));

      expect(paginationButtonHandlerSpy).toHaveBeenCalled();
      expect(paginationButtonHandlerSpy).toHaveBeenCalledTimes(1);

    });

    it("should trigger onResize method when window is resized", () => {
      window.addEventListener('resize', window.windowResizeHandler);
      window.dispatchEvent(new Event('resize'));

      expect(windowResizeHandlerSpy).toHaveBeenCalled()
    })

  })

  describe("View ", () => {
    let renderCardsSpy;
    let renderPaginationButtonsSpy;
    let buttonsDisplayHandlerSpy;

    beforeEach(() => {

      renderCardsSpy = spyOn(window, "renderCards")
      renderPaginationButtonsSpy = spyOn(window, "renderPaginationButtons")
      buttonsDisplayHandlerSpy = spyOn(window, "buttonsDisplayHandler");
      window.renderView(preparedData);

    })

    it("Render view should call renderCards", () => {
      expect(renderCards).toHaveBeenCalled()
    })
    it("Render view should call renderPaginationButtons", () => {
      expect(renderPaginationButtonsSpy).toHaveBeenCalled()

    })
    it("Render view should call buttonsDisplayHandler", () => {
      expect(buttonsDisplayHandlerSpy).toHaveBeenCalled()
    })


  })

  describe("Dynamic HTML ", () => {
    it("Should add card to HTML", () => {
      const result = mapDataToCard(preparedData);
      document.body.innerHTML = result[0]
      const numberofCardsAdded = document.querySelectorAll('.card').length;

      expect(numberofCardsAdded).toEqual(1);
      expect(result.length).toEqual(1)
    })
  })

  describe("debounce", () => {

    it("debounce", () => {
      function dummyFunctions() { }
      const result = debounce(dummyFunctions)
      expect(typeof result).toEqual("function");
    })
  })

});




