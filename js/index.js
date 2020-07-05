function cardContainer(link, pokeData) {
  let HTMLString = `<a href="" class="poke-card">
					<figure class="poke-image">
						<img src="${link}" alt="${pokeData.name}" />
					</figure>
					<span class="card-overlay">
						<p>
							<span class="card-attribute">${pokeData.name}</span>
            </p>
            <p>
							<span class="card-attribute">#${pokeData.id}</span>
            </p>
					</span>
        </a>
        `;
  return HTMLString;
}

function createPokeContainer(pokeData) {
  const $pokeContainer = document.getElementById("poke-container");
  const HTMLString = cardContainer(
    `https://pokeres.bastionbot.org/images/pokemon/${pokeData.id}.png`,
    pokeData
  );
  const html = document.implementation.createHTMLDocument();
  html.body.innerHTML = HTMLString;
  $pokeContainer.append(html.body.children[0]);
}

async function loadData() {
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  function getCache(objectName) {
    let tmp = window.localStorage.getItem(objectName);
    return tmp;
  }

  async function getPokeNumbers() {
    const name = "pokeList";
    let tmp = getCache(name);
    if (tmp != null) {
      let cache = JSON.parse(tmp);
      return cache;
    }
    tmp = await getData("https://pokeapi.co/api/v2/pokemon?limit=151");
    window.localStorage.setItem(name, JSON.stringify(tmp));
    return tmp;
  }

  async function getPokeData(pokeNumbers) {
    // const name = "pokeData";
    // let tmp = getCache(name);
    // if (tmp != null) return JSON.parse(tmp);
    let pokeData = pokeNumbers.results.map(async function (poke) {
      let request = await getData(poke.url);
      createPokeContainer(request);
      return request;
    });
    // window.localStorage.setItem(name, JSON.stringify(pokeData));
    return pokeData;
  }
  let pokeNumbers = await getPokeNumbers();
  let pokeData = await getPokeData(pokeNumbers);
  return pokeData;
}

(function start() {
  let pokeList = loadData();
  console.log(pokeList);
  const $actionButton = document.getElementById("main-button");
  $actionButton.addEventListener("click", () => {
    const $mainContainer = document.getElementById("main");
    const $text = document.getElementById("text");
    const cStyle = getComputedStyle($mainContainer);
    let display = cStyle.getPropertyValue("display");
    let allCards = document.querySelectorAll(".poke-card");
    if (display === "none") {
      $mainContainer.style.display = "block";
      $text.innerHTML = "hide";
    } else {
      $mainContainer.style.display = "none";
      $text.innerHTML = "show";
    }
  });
})();
