echo "------> Kill all the running PM2 actions"
pm2 kill

echo "------> Jump to app folder"
cd /home/ubuntu/projects/radiolife/current/

echo "------> Update app from Git"
git pull

echo "------> Run new PM2 action"
pm2 deploy ecosystem.config.json production-local --only RL-RabbitMQ-Producer