module.exports = {
  apps: [
    {
      name:"primary",
      script:"main.js",
      instances:1,
      exec_mode:"cluster",
    },
    {
      name:"replica",
      script:"main.js",
      instances:-1,
      exec_mode:"cluster",
    },
  ]
};