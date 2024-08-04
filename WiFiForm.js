import SimpleKeyboard from "simple-keyboard";

document.addEventListener("DOMContentLoaded", () => {
    var myKeyboard = new SimpleKeyboard({
        onChange: input => onChange(input),
        onKeyPress: button => onKeyPress(button)
    });

    function onChange(input) {
        document.querySelector(".input").value = input;
    }

    function onKeyPress(button) {
        if (button === "{shift}" || button === "{lock}") handleShift();
    }

    function handleShift() {
        let currentLayout = myKeyboard.options.layoutName;
        let shiftToggle = currentLayout === "default" ? "shift" : "default";

        myKeyboard.setOptions({
            layoutName: shiftToggle
        });
    }

    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("focus", event => {
            myKeyboard.setInput(event.target.value);
            myKeyboard.setOptions({
                onChange: input => event.target.value = input
            });
        });
    });

    document.getElementById('wifi-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        var ssid = document.getElementById('ssid').value;
        var password = document.getElementById('password').value;
        
        fetch('/wifi-setup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ssid: ssid, password: password })
        }).then(response => response.json())
          .then(data => alert(data.message))
          .catch(error => console.error('Error:', error));
    });

    window.addEventListener("message", (event) => {
        if (event.data.type === "wifiNetworks") {
            const networks = event.data.data;
            console.dir(networks);
            const ssidSelect = document.getElementById('ssid');
            networks.forEach(network => {
                if (network.hasOwnProperty('ssid')) {
                    const option = document.createElement('option');
                    option.value = network.ssid;
                    option.textContent = network.ssid;
                    ssidSelect.appendChild(option);
                }
            })
        }
    });

    document.getElementById('show-password').addEventListener('change', function() {
        var passwordField = document.getElementById('password');
        if (this.checked) {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    });

    document.getElementById('close-button').addEventListener('click', function() {
        window.parent.postMessage('closeForm', '*');
    });
});
