module.exports = {
  apps: [
    {
      name: 'blog-backend',
      cwd: '/home/saas/app/backend',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 15,
      min_uptime: '5s',
      restart_delay: 3000,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      error_file: '/home/saas/logs/blog-backend-error.log',
      out_file: '/home/saas/logs/blog-backend-out.log',
    },
  ],
};
