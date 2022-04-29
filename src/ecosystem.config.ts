export = {
  apps: [
    {
      name: 'primary',
      script: 'main.js',
      instances: 1,
      exec_mode: 'cluster',
    },
    {
      name: 'replica',
      script: 'main.js',
      instances: -2,
      exec_mode: 'cluster',
    },
  ]
};