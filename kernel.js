/* kernel.js - Der Kern deines Web-OS */
const OS = {
    // Öffnet ein neues Fenster auf dem Desktop
    openWindow: function(title, content) {
        const win = document.createElement('div');
        win.className = 'window';
        win.style.top = '100px';
        win.style.left = '100px';
        win.innerHTML = `
            <div class="title-bar">
                <span>${title}</span>
                <button onclick="this.parentElement.parentElement.remove()">X</button>
            </div>
            <div class="content">${content}</div>
        `;
        // Fokus-Logik
        win.onmousedown = () => {
            document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
            win.style.zIndex = 10;
        };
        document.getElementById('desktop').appendChild(win);
        // Drag-Funktion
        this.makeDraggable(win);
    },

    makeDraggable: function(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = el.querySelector('.title-bar');
        header.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmousemove = (e) => {
                pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
                pos3 = e.clientX; pos4 = e.clientY;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
            };
            document.onmouseup = () => { document.onmousemove = null; };
        };
    }
};

// Beispielaufruf
OS.openWindow('Terminal', 'System bereit... Warte auf Eingabe.');


// Funktion zum Ziehen der Fenster
document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('title-bar')) {
        let windowElement = e.target.parentElement;
        let shiftX = e.clientX - windowElement.getBoundingClientRect().left;
        let shiftY = e.clientY - windowElement.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            windowElement.style.left = pageX - shiftX + 'px';
            windowElement.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    }
});
