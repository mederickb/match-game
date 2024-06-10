document.addEventListener('DOMContentLoaded', () => {
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const closeModal = document.getElementsByClassName('close')[0];

    helpButton.onclick = function() {
        helpModal.style.display = 'block';
    }

    closeModal.onclick = function() {
        helpModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == helpModal) {
            helpModal.style.display = 'none';
        }
    }
});
