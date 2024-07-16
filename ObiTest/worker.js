self.onmessage = function(e) {
    if (e.data === 'start') {
        stress();
    }
};

function stress() {
    while (true) {
        let sum = 0;
        for (let i = 0; i < 1e7; i++) {
            sum += Math.sqrt(i);
        }
    }
}

stress();