# MMM-WifiSetup
Set up a new wifi connection from touchscreen MagicMirror

## Step 1 – Install the module

In your MagicMirror directory:

```bash 
cd modules
cd ~/MagicMirror/modules
git clone https://github.com/jwjacobs88/MMM-WifiSetup.git
cd MMM-WifiSetup
npm install
```

## Step 2 – Add files to the Config.js

Here is an example for an entry in `config.js`

```javascript
{
  module: 'MMM-WifiSetup', 
  position: 'bottom_left', 
  config:{ 
    // None configuration options defined 
  }
}
```

## Configuration options

None configuration options