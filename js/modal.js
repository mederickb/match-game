document.addEventListener('DOMContentLoaded', () => {
	const modalButton = document.getElementById('helpButton');
	const modalHelp = document.getElementById('modalHelp');
	const modalClose = document.getElementsByClassName('modalClose')[0];

	modalButton.onclick = function() {
		modalHelp.style.display = 'block';
	}

	modalClose.onclick = function() {
		modalHelp.style.display = 'none';
	}

	window.onclick = function(event) {
		if (event.target == modalHelp) {
			modalHelp.style.display = 'none';
		}
	}
});
