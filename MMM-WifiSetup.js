Module.register("MMM-WifiSetup", {
    defaults: {
        // Default module configurations
    },

    getScripts: () {
        return [this.file("dist/WiFiForm.bundle.js")];
    },

    getStyles: () {
        return [this.file("MMM-WifiSetup.css"), "font-awesome.css"];
    },

    start: () {
        Log.info("Starting module: " + this.name);
        this.addEventListeners();
        this.sendSocketNotification("SCAN_WIFI");
    },

    getDom: () {
        var wrapper = document.createElement("div");
        wrapper.id = "wifi-setup-wrapper";

        // Create a button to show the form
        var showFormButton = document.createElement("button");
        showFormButton.innerHTML = '<i class="fas fa-wifi"></i>';
        showFormButton.id = "show-form-button";
        showFormButton.addEventListener("click", () =>{
            document.getElementById("wifi-form-container").style.display = "flex";
            this.sendSocketNotification("SCAN_WIFI");
        });
        wrapper.appendChild(showFormButton);

        // Create a container for the form
        var formContainer = document.createElement("div");
        formContainer.id = "wifi-form-container";
        formContainer.style.display = "none"; // Initially hide the form
        formContainer.style.position = "fixed";
        formContainer.style.top = "0";
        formContainer.style.left = "0";
        formContainer.style.width = "100%";
        formContainer.style.height = "100%";
        formContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; // Semi-transparent background
        formContainer.style.justifyContent = "center";
        formContainer.style.alignItems = "center";

        // Create an iframe to load the form
        var iframe = document.createElement("iframe");
        iframe.src = "modules/MMM-WifiSetup/WiFiForm.html";
        iframe.style.width = "90%";
        iframe.style.height = "90%"; // Increase height to accommodate the keyboard and form
        iframe.style.border = "none";
        formContainer.appendChild(iframe);

        document.body.appendChild(formContainer);

        return wrapper;
    },

    addEventListeners: () {
        window.addEventListener("message", (event) => {
            if (event.data === "closeForm") {
                document.getElementById("wifi-form-container").style.display = "none";
                document.getElementById("show-form-button").style.display = "block";
            }
        });
    },

    socketNotificationRecieved: (notification, payload) {
        alert("Got notification");
        Log.log("Got notification");
        switch(notification) {
            case "WIFI_SCAN_RESULT":
                var iframe = document.querySelector("iframe");
                if (iframe) {
                    iframe.contentWindow.postMessage({ type: "wifiNetworks", data: payload }, "*");
                }
                break;
            }
        }
    }
});
