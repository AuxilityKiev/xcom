#!/usr/bin/env bash
set -e

#
# schedules ecom sync
#

if [[ $# -eq 0 ]] ; then
    echo 'should specify mode [dev/prod]'
    exit 1
fi

mode=$1

env_file=$([[ "$mode" == "dev" ]] && echo ".env" || echo ".env.prod")

function crontab_add(){
    if ! crontab -l | fgrep -q "$1"; then
        #write out current crontab
        temp_file=$(mktemp)
        crontab -l > temp_file || true
        #echo new cron into cron file
        echo "$1" >> temp_file
        #install new cron file
        crontab temp_file
        rm "$temp_file"
    fi
}

export -p > cron_env_${mode}.sh

crontab_add "SHELL=/bin/bash"

# every 20 minutes except 3.00-3.59
crontab_add "*/20 0-2,4-23 * * * cd $PWD && source cron_env_$mode.sh && source $env_file && pm2 restart xcomStockUpdater || pm2 start npm --name 'xcomStockUpdater' --no-autorestart --log-date-format 'DD-MM-YYYY HH:mm:ss.SSS' -- run script:${mode} -- stocksPipe"

# every day at 3 am
crontab_add "0 3 * * * cd $PWD && source cron_env_$mode.sh && source $env_file && pm2 restart xcomDailyUpdater || pm2 start npm --name 'xcomDailyUpdater' --no-autorestart --log-date-format 'DD-MM-YYYY HH:mm:ss.SSS' -- run script:$mode -- dailyPipe"

echo "cron updates scheduled."

exit 0
