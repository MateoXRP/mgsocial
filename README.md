# mg.social

MG.Social version 2 website.

## Prerequisites

1. Clone this repository.

2. Download and install [Node.js](https://nodejs.org/). Preferably the LTS version.

## Environment variables

1. Open your terminal and run `cp .env.example .env`

2. Check the empty variables and add your credentials in `.env` and save.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start
```

## Heroku Deployment

1. Login to heroku.com

2. Click New > `Create New App`

3. Add app-name > `Create App`

4. In the Deploy tab, click `Connect to GitHub` and search the repo name. Click `Connect`.

5. Go to Settings tab, click `Reveal Config Vars`, then add all contents of your `.env` there instead.

6. Finally, click `Deploy Branch`

After this, no need to clone the repo to deploy updates. Every time there's an update in the repo, just click `Deploy Branch` again.

## Tech stack used

- https://www.opensource-socialnetwork.org/webservices/all
- https://github.com/XRPLF/xrpl.js
- https://xumm.app
- https://nuxtjs.org
- https://vuejs.org
- https://vuetifyjs.com
- https://vue-query.vercel.app