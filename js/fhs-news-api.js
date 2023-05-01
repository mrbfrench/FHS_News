console.log("testy westy");

/*
async function get() {
	let obj = fetch('http://localhost:3000/api/home')

	return obj
}

get().then(obj =>
	console.log(obj.text().valueOf())
)
*/

//let mainContent = document.getElementById("main-content")
//console.log(mainContent)

//let element = document.createElement("section")
//mainContent.appendChild(element)

/**
 * Returns an array with each entry representing a card in the home feed
 * @returns {Promise<Array<Object>>}
 */
async function getHome(position = 0, quantity = 5) {
	// noinspection JSCheckFunctionSignatures
	const targetUrl = 'http://localhost:3000/api/home?' + new URLSearchParams({
		position: position, quantity: quantity
	})

	return fetch(targetUrl).then(response => response.json()).then(response => {
		return response
	})
}

// TODO: Load each module in the folder once and pull from there instead of dinging the module location for each and every card

window.addEventListener('load', function () {
	// Runs when the webpage finishes loading

	// This Is A Test
	let mainContent = document.getElementById("main-content")
	let testAlert = document.createElement("section")
	testAlert.className = "block"
	fetch('http://localhost:63342/FHSnewsWeb/modules/alert.html').then(response => response.text()).then(response => {
		let newResponse = response
		newResponse = newResponse.replace("%alerttext%", "Bruh")
		testAlert.innerHTML = newResponse
	})
	mainContent.appendChild(testAlert)
	// This Is A Test


	let testWeather = document.createElement("section")
	testWeather.className = "block"
	fetch('http://localhost:63342/FHSnewsWeb/modules/weather_data.html').then(response => response.text()).then(response => {
		let newResponse = response
		testWeather.innerHTML = newResponse
	})
	mainContent.appendChild(testWeather)

	let testLunch = document.createElement("section")
	testLunch.className = "block"
	fetch('http://localhost:63342/FHSnewsWeb/modules/lunch_data.html').then(response => response.text()).then(response => {
		let newResponse = response
		testLunch.innerHTML = newResponse
	})
	mainContent.appendChild(testLunch)

	let testArticle = document.createElement("section")
	testArticle.className = "block"
	fetch('http://localhost:63342/FHSnewsWeb/modules/article.html').then(response => response.text()).then(response => {
		let newResponse = response
		testArticle.innerHTML = newResponse
	})
	mainContent.appendChild(testArticle)

	let testClub = document.createElement("section")
	testClub.className = "block"
	fetch('http://localhost:63342/FHSnewsWeb/modules/club.html').then(response => response.text()).then(response => {
		let newResponse = response
		testClub.innerHTML = newResponse
	})
	mainContent.appendChild(testClub)

})


