const path = require("path");
module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./wordfast",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        noMsi: false,
        setupIcon: path.resolve(__dirname, "./wordfast.ico"),
        iconUrl: path.resolve(__dirname, "./wordfast.ico"),
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
};
