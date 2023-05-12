// Get the color input elements from the HTML page
const colorInput1 = document.getElementById('main-color');
const colorInput2 = document.getElementById('secondary-color');
const colorInput3 = document.getElementById('accent-color');

// Add an event listener to each color input element
colorInput1.addEventListener('input', updateColors);
colorInput2.addEventListener('input', updateColors);
colorInput3.addEventListener('input', updateColors);

// Function to update the CSS with the selected colors
function updateColors() {
	const colorValue1 = colorInput1.value;
	const colorValue2 = colorInput2.value;
	const colorValue3 = colorInput3.value;

	// Save the color values to localStorage
	localStorage.setItem('selectedColor1', colorValue1);
	localStorage.setItem('selectedColor2', colorValue2);
	localStorage.setItem('selectedColor3', colorValue3);

	// Apply the colors as CSS values to an element
	const coloredElement = document.getElementById('colored-element');
}

// Check if color values are already saved in localStorage
const savedColor1 = localStorage.getItem('selectedColor1');
const savedColor2 = localStorage.getItem('selectedColor2');
const savedColor3 = localStorage.getItem('selectedColor3');

if (savedColor1 && savedColor2 && savedColor3) {
	// Apply the saved colors as CSS values to the element
	const coloredElement = document.getElementById('colored-element');

	// Set the color input values to the saved colors
	colorInput1.value = savedColor1;
	colorInput2.value = savedColor2;
	colorInput3.value = savedColor3;
}

const dynamicStyles = `
  :root {
    --color-1: ${savedColor1};
    --color-2: ${savedColor2};
    --color-3: ${savedColor3};
  }
`;

// Create a <style> element and set its content to the dynamic CSS rules
const styleElement = document.createElement('style');
styleElement.textContent = dynamicStyles;

// Append the <style> element to the <head> of the document
document.head.appendChild(styleElement);
