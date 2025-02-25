# Customization

You can override default settings, colors, CSS, HTML and translations in `customization` folder.

## Settings

Default configuration are defined in files from https://github.com/GeotrekCE/Geotrek-rando-v3/tree/main/frontend/config folder.
You can override all settings default values in files from `customization/config/` folder.

- `global.json` to define API URL (and eventual portal filter), Google Analytics, base URL of your portal (for dynamic sitemap.xml) and fallback images URL if some content don't have image (see https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/frontend/config/global.json)
- `header.json` to define logo URL, default and available languages, number items to flatpages to display in navbar (see https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/frontend/config/header.json)
- `home.json` to define homepage settings such as main image URL, blocks to display and trek suggestion block wih trek ID to highlight on homepage (see https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/frontend/config/home.json)
- `footer.json` to define social networks and links (based on translation labels) in footer (see https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/frontend/config/footer.json)
- `filter.json` to define filters to display, their order and values (see https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/frontend/customization/config/filter.json)
- `map.json` to define basemap URL and attribution, center and default zoom (see https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/frontend/config/map.json)

_Warning:_
When setting up Google Analytics, you have to setup a flow. When setting up the flow, be careful to enter the corresponding url (the url of your website), otherwise the data will not be received.

## Colors

You can override colors in `customization/theme/colors.json` file to change the main colors, based on https://github.com/GeotrekCE/Geotrek-rando-v3/blob/main/frontend/tailwind.config.js default theme.

Example for Cevennes national park orange colors:

```json
{
  "primary1": {
    "DEFAULT": "#ff9100",
    "light": "#ffa032"
  },
  "primary3": "#d57b04"
}
```

You can also override CSS in `customization/theme/style.css` file. To help overriding CSS, some ID have been added on main components:

HOME

- header
- header_logo
- footer
- cover_image
- activities_bar
- home_card

SEARCH

- filter_bar
- result_card
- search_map

FLATPAGE

- flatpage_cover
- flatpage_content

## Translations

You can override every texts in translations files, based on default ones (https://github.com/GeotrekCE/Geotrek-rando-v3/tree/main/frontend/src/translations).

You should at least override `home.title`, `home.description` and `home.welcome-text`.

## HTML

You can include some HTML parts in the first and last sections of the homepage, with files:

- `customization/homeTop.html`
- `customization/homeBottom.html`

See HTML examples at https://github.com/GeotrekCE/Geotrek-rando-v3-docker/tree/main/examples.

## Apply changes

After each customization changes, you'll have to rebuild the Docker image by running:

```bash
docker build -t geotrek-rando . ## You can also specify a specific version
docker ps ## To find previous container ID to stop
docker stop {CONTAINER_ID}
docker run --restart unless-stopped -d -p {YOUR_PORT}:80 geotrek-rando
```

Make sure to remove older images, otherwise your server will keep all build and enlarge fast.
