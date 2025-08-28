# AdonisJS Inertia Starter Kit

This repo contains an AdonisJS application tailored for building an Inertia powered application using Inertia SSR + ReactJS

## What's included

- TypeScript setup with commands to run developments server using `ts-node + swc` and create production build.
- ESLint and Prettier setup extending the [AdonisJS tooling config](https://github.com/adonisjs/tooling-config) presets.
- Ace command line framework.
- Everything else you get with the core of AdonisJS.
- Shadcn initalized
- Comes with sidebar, utils, etc

## Enabled Feature

- Lucid ORM (MySQL)
- Auth module (Session)
- Inertia.js SSR + React
- Websocket (came with middleware, see: [start/socket.ts](https://github.com/XniceCraft/adonisjs-inertia-starter-kit/blob/main/start/socket.ts))

## Usage

- Clone the repo
- Install dependencies
- Copy `.env.example` to `.env`
- Set app key using `node ace generate:key` command.
- Configuration done

## Shadcn Dependency
```
The components needs badge, sidebar, skeleton, separator, collapsible, dropdown-menu
```

- Install the component
```sh
npx shadcn@latest add badge sidebar skeleton separator collapsible dropdown-menu
```
```sh
pnpm dlx shadcn@latest add badge sidebar skeleton separator collapsible dropdown-menu
```