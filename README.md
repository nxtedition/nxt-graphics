# nxt-graphics

## Setup new project

- if you have no git repo yet, `git init`
- run `git submodule add git@github.com:nxtedition/nxt-graphics && cp -r ./nxt-graphics/setup/ ./`
- modify `package.json` and `wtm-config.json`
- run `yarn` or `npm i`

## Development

- Basic: `yarn dev` or `npm run dev`
- Advanced: `yarn start` or `npm run start` (auto-open templates in Chrome Canary with disabled web security)

See Emulating Caspar for more information

## Building

Development builds are identical to production builds, and you should check in your built templates folder to source control to make life easy for non-devs.

## Emulating Caspar

Templates in Caspar will ignore web security features, like disallowing responses with empty `Access-Control-Allow-Origin` headers from being handled in code.

To emulate this, you can disable web security features in your local browser too.
If you have Chrome Canary installed, you can run `./run-canary.js` to spin up a Chrome Canary instance with disabled web security. It will open every built template in a separate tab.

### Why Canary

Chrome Canary is chosen in order to not interfere with Chrome, which for some reason can't start a new instance if already running.
Chrome Canary is a poor default, and should ideally be the version of Chromium that Caspar is running, but it's a hassle to get.
See the `Downloading old builds of Chrome / Chromium` section on [the Chromium Download page](https://www.chromium.org/getting-involved/download-chromium) if you care to have a go.

## wtm-config.json

Short for "web template manager configuration"

- `postBuild.copyTo` (array of strings): after build, copy all templates to every given folder. Typically you want to set this to your test Caspar's templates folder.

NOTE: You must restart webpack (see Development section) before changes take effect

