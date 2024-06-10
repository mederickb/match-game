// could be merged with main js later, placed here to avoid conflicts

// Declare variables
var modal = document.getElementById("helpModal");
var btn = document.getElementById("helpButton");
var span = document.getElementsByClassName("close")[0];

// Open modal when button is pressed
btn.onclick = function() {
	modal.style.display = "block";
}

// Close modal when X is pressed
span.onclick = function() {
	modal.style.display = "none";
}

// Close modal if empty space is clicked
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
} 