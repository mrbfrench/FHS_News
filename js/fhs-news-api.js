console.log("testy westy");

async function get() {
	let obj = fetch('http://localhost:3000/api/home')

	return obj
}

get().then(obj =>
	console.log(obj.text().valueOf())
)

let mainContent = document.getElementById("main-content")
console.log(mainContent)

let element = document.createElement("section")
mainContent.appendChild(element)

/**
 * Returns an array with each entry representing a card in the home feed
 * @returns {Promise<Array<Object>>}
 */
async function getHome(position = 0, quantity = 5) {
	// noinspection JSCheckFunctionSignatures
	const targetUrl = 'http://api.fhs-news.org/home?' + new URLSearchParams({
		position: position, quantity: quantity
	})

	return fetch(targetUrl).then(response => response.json()).then(response => {
		return response
	}).catch(function(e) {
		throw e
	})

}

// TODO: Load each module in the folder once and pull from there instead of dinging the module location for each and every card

window.addEventListener('load', function () {
	// Runs when the webpage finishes loading
	let mainContent = document.getElementById("main-content")

	getHome(0,8).then(response => {
		for (let item in response) {
			let thisItem = document.createElement("section")
			thisItem.className = "block"
			fetch('../modules/alert.html').then(module => module.text()).then(module => {
				let newModule = module
				newModule = newModule.replace("%alerttext%", JSON.stringify(response[item]))
				thisItem.innerHTML = newModule
			})
			mainContent.appendChild(thisItem)
		}
	}).catch(function() {
		let thisItem = document.createElement("section")
		thisItem.className = "block"
		fetch('../modules/alert.html').then(module => module.text()).then(module => {
			let newModule = module
			newModule = newModule.replace("%alerttext%", "Could not reach the API!")
			thisItem.innerHTML = newModule
		})
		mainContent.appendChild(thisItem)
	})
	// This Is A Test
	let testAlert = document.createElement("section")
	testAlert.className = "block"
	fetch('../modules/alert.html').then(response => response.text()).then(response => {
		let newResponse = response
		newResponse = newResponse.replace("%alerttext%", "Bruh")
		testAlert.innerHTML = newResponse
	})
	mainContent.appendChild(testAlert)
	// This Is A Test


	let testWeather = document.createElement("section")
	testWeather.className = "block"
	fetch('../modules/weather_data.html').then(response => response.text()).then(response => {
		let newResponse = response
		testWeather.innerHTML = newResponse
	})
	mainContent.appendChild(testWeather)

	let testLunch = document.createElement("section")
	testLunch.className = "block"
	fetch('../modules/lunch_data.html').then(response => response.text()).then(response => {
		let newResponse = response
		testLunch.innerHTML = newResponse
	})
	mainContent.appendChild(testLunch)

	let testArticle = document.createElement("section")
	testArticle.className = "block"
	fetch('../modules/article.html').then(response => response.text()).then(response => {
		let newResponse = response
		// TODO: Automate this via for loop
		newResponse = newResponse.replace("%toppertext%", "Topper text")
		newResponse = newResponse.replace("%topperurl%", "img/placeholder.png")
		newResponse = newResponse.replace("%articleimage%", "img/placeholder.png")
		newResponse = newResponse.replace("%postedtime%", "4 days ago")
		newResponse = newResponse.replace("%authorname%", "Joe Nuts")
		newResponse = newResponse.replace("%articlename%", "Bread roll")
		newResponse = newResponse.replace("%subtitle%", "This Is A Bread Roll")
		newResponse = newResponse.replace("%content%", "I LOVE BREAD ROLL!!")

		testArticle.innerHTML = newResponse
	})
	mainContent.appendChild(testArticle)

	let testClub = document.createElement("section")
	testClub.className = "block"
	fetch('../modules/club.html').then(response => response.text()).then(response => {
		let newResponse = response
		testClub.innerHTML = newResponse
	})
	mainContent.appendChild(testClub)

})


