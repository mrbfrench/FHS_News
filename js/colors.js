// Function to handle form submission
function handleFormSubmit(event) {
	event.preventDefault(); // Prevent form submission

	// Get the color input values from the form
	const colorValue1 = document.getElementById('color-input-1').value;
	const colorValue2 = document.getElementById('color-input-2').value;
	const colorValue3 = document.getElementById('color-input-3').value;

	// Save the color values to localStorage
	localStorage.setItem('selectedColor1', colorValue1);
	localStorage.setItem('selectedColor2', colorValue2);
	localStorage.setItem('selectedColor3', colorValue3);

	// Apply the colors as CSS values to an element
	const coloredElement = document.getElementById('colored-element');
	coloredElement.style.backgroundColor = colorValue1;
	coloredElement.style.color = colorValue2;
	coloredElement.style.borderColor = colorValue3;

	const dynamicStyles = `
    color-1: ${savedColor1};
    color-2: ${savedColor2};
   	color-3: ${savedColor3};
  `;
}

// Add event listener to the form submission
const form = document.getElementById('color-form');
form.addEventListener('submit', handleFormSubmit);
