# tracker-api

Data api for tracker app.

## Install mongo

```bash
sudo mkdir /data/db #create dir for databases
sudo chmod 775 /data/db #set permissions for your user
brew install mongodb #install with brew
mongod #start database server
```

## Running locally

Start mongodb in one tab

```bash
mongod
```

in a new tab install deps and start app

```bash
npm i
npm start
```
