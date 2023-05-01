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
	fetch('http://localhost:63342/FHSnewsWeb/modules/alert.html').then(response => response.text()).then(response => testAlert.innerHTML = response)
	mainContent.appendChild(testAlert)
	// This Is A Test

})


