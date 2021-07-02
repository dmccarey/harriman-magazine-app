[[ $1 = '' ]] && BRANCH="master" || BRANCH=$1

SSH_KEY_PATH="./scripts/harriman-aws.pem"
SERVER="ubuntu@magazine.harriman.columbia.edu"
DEST_FOLDER="/srv/www/app"
PARAMS="BRANCH=\"$BRANCH\" DEST_FOLDER=\"$DEST_FOLDER\""

echo ===================================================
echo Autodeploy server
echo selected barcn $BRANCH
chmod 400 $SSH_KEY_PATH
echo ===================================================
echo Connecting to remote server...
ssh -i $SSH_KEY_PATH $SERVER $PARAMS 'bash -i'  <<-'ENDSSH'
    #Connected

    cd $DEST_FOLDER

    git stash
    # to stash package-lock.json file changes

    git pull
    git checkout $BRANCH
    git pull origin $BRANCH

    # rm -rf node_modules/

    pm2 stop all

    # npm install
    pm2 start npm -- run start
    pm2 save
    pm2 list

    exit
ENDSSH
