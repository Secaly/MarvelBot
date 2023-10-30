# MarvelBot
Bot discord using Marvel's public API.

## About The Project

This is the directory for a Discord application that uses Marvel's API, located here: https://developer.marvel.com/

You can invite my bot directly to your server via this [link](https://discord.com/api/oauth2/authorize?client_id=1166334726257262602&permissions=2147485696&scope=bot), or create your own local version by following the instructions below.

## Getting Started

The application is designed to be containerized and used via a pre-built docker image. You can use it without docker or by building your own image, but this is not recommended.

### Prerequisites

Install Docker

Create an account at [developer.marvel.com](https://developer.marvel.com/) and retrieve your API keys at [developer.marvel.com/account](https://developer.marvel.com/account).

Create a Discord account at [discord.com](https://discord.com/) and create a new application at [discord.com/developers/applications](https://discord.com/developers/applications)

Once the Discord application has been created, you can generate the URL to invite the bot to your server via `OAuth2` -> `URL Generator`, select the bot `scope` and add the `Send Messages` and `Use Slash Commands` permissions.

Once the bot is on your server, you can retrieve its ID by right-clicking `Copy User ID`. If this option doesn't appear, go to `User settings` -> `Advanced` then activate `Developer Mode`.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Secaly/marvelbot.git
   ```
2. Edit the docker-compose.yml with the appropriate keys
   ```yml
   - DISCORD_TOKEN=
   - BOT_ID=
   - MARVEL_API_PUBLIC_KEY=
   - MARVEL_API_PRIVATE_KEY=
   ```
3. Run the docker command
   ```sh
   docker compose up
   ```

## Usage

Once the application has been launched and the bot on the Discord server, you can now use the /search command followed by the name of the Marvel character whose information you want to retrieve.
Exemple :
   ```sh
   /search Wolverine
   ```

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Attribution

Data provided by Marvel. © 2014 Marvel
