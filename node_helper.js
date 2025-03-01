const NodeHelper = require("node_helper");
const bodyParser = require("body-parser");
const fs = require('fs');
const wpa_cli = require('wireless-tools/wpa_cli');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node_helper for module: " + this.name);
        this.expressApp.use(bodyParser.json());
        this.setupRoutes();
    },

    setupRoutes: function() {
        const self = this;

        this.expressApp.post("/wifi-setup", (req, res) => {
            const ssid = req.body.ssid;
            const password = req.body.password;

            console.log("Received Wi-Fi setup request:", ssid, password);

            self.configureWifi(ssid, password, (err) => {
                if (err) {
                    console.error("Error setting up Wi-Fi:", err);
                    res.status(500).json({ message: "Error setting up Wi-Fi." });
                } else {
                    res.json({ message: `Connected to ${ssid} Wi-Fi network.` });
                }
            });
        });
    },

    configureWifi: function(ssid, password, callback) {
        const wpaSupplicantConf = `
            country=US
            ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
            update_config=1

            network={
                ssid="${ssid}"
                psk="${password}"
            }
        `;

        fs.writeFile('/tmp/wpa_supplicant.conf', wpaSupplicantConf, (err) => {
            if (err) return callback(err);
            callback(null);
        });
	    console.log("Moving the file in place...");
        require('child_process').exec('sudo mv /tmp/wpa_supplicant.conf /etc/wpa_supplicant/wpa_supplicant.conf', console.log);
        // wireless-tools doesn't have a command for reconfigure
        require('child_process').exec('sudo wpa_cli -i wlan0 reconfigure', console.log); 

        console.log('Updated wifi');
    },

    scanWifiNetworks: function() {
        wpa_cli.scan('wlan0', (err, data) => {
            wpa_cli.scan_results('wlan0', (err, data) => {
               // returns the results of the BSS scan once it completes
               this.sendSocketNotification("WIFI_SCAN_RESULT", data);
            });
        });
    },

    socketNotificationReceived: function(notification, payload) {
        switch(notification) {
            case "SCAN_WIFI":
                this.scanWifiNetworks();
                break;
        }
    }
});
