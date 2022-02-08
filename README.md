# Shut Up

![License](https://img.shields.io/github/license/zS1L3NT/ts-discord-shutup?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/ts-discord-shutup?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/ts-discord-shutup?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/ts-discord-shutup?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/ts-discord-shutup?style=for-the-badge)

Shut Up is a Discord Bot that was made for fun. It prevents a defined few users from being able to send any messages or join any voice channels. It was dedicated to @PuttTim who also made a Discord Bot against me.

Shut Up is built upon [Nova Bot](https://github.com/zS1L3NT/ts-npm-nova-bot), my Discord Bot framework. This bot was only active for a short period of time and since then was never added to any servers.

## Features

-   Messages
    -   Shut Up will delete any messages sent by restricted users and send a message to tell them to stop talking for 10 seconds before that message disappears.
-   Voice Channels
    -   Shut Up will disconnect restricted users every time they join a voice channel
-   Permitted users
    -   Shut Up keeps a list of users who can add restrictions to other users
-   Discord Commands (Interactions)
    -   Restrictions
        -   `/allow` - Removes restrictions on a user
        -   `/deny` - Adds restrictions to a user
    -   Permitted users
        -   `/permitted add` - Adds a user to the list of permitted users
        -   `/permitted remove` - Removed a user from the list of permitted users
        -   `/permitted show` - Shows the the list of all permitted users

## Usage

Copy the `config.example.json` file to `config.json` then fill in the json file with the correct project credentials.

With `yarn`

```
$ yarn
$ yarn run dev
```

With `npm`

```
$ npm i
$ npm run dev
```

## Built with

-   TypeScript
    -   [![@types/node](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-shutup/dev/@types/node?style=flat-square)](https://npmjs.com/package/@types/node)
    -   [![typescript](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-shutup/dev/typescript?style=flat-square)](https://npmjs.com/package/typescript)
-   DiscordJS
    -   [![discord.js](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-shutup/discord.js?style=flat-square)](https://npmjs.com/package/discord.js)
-   Miscellaneous
    -   [![colors](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-shutup/colors?style=flat-square)](https://npmjs.com/package/colors)
    -   [![firebase-admin](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-shutup/firebase-admin?style=flat-square)](https://npmjs.com/package/firebase-admin)
    -   [![nova-bot](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-shutup/nova-bot?style=flat-square)](https://npmjs.com/package/nova-bot)
    -   [![tracer](https://img.shields.io/github/package-json/dependency-version/zS1L3NT/ts-discord-shutup/tracer?style=flat-square)](https://npmjs.com/package/tracer)
