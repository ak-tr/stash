# Stash

First full-stack project - a pastebin clone using Vue + TS for the frontend and Cloudflare Workers + TS for the backend; helping power this performant and lightweight single-page web app for sharing code snippets.

## App (Frontend)

All frontend files are stored in the `app` directory.

Go to [stash.akif.kr](https://stash.akif.kr) and paste your code. Specify the length of the snippet. Press the combo keys as shown for your system, or click the upload button. Copy the link at the top to share after uploading.

## Worker (Backend)

All backend files are stored in the `worker` directory.

The backend API for this project currently consists of 4 RESTful endpoints. The base url for the API is the same as the app: [stash.akif.kr](https://stash.akif.kr).

### Endpoints

`POST /stash` - provide values `ttl` and `raw` as JSON to create a stash.

`GET /stash/:id` - provide ID of stash to get stash; return type is `application/json`.

`GET /stash/:id/raw` - provide ID of stash to get stash in raw format: return type is `plain/text`

`DELETE /stash/:id` - provide ID of stash to delete stash.

Alternatively, you can view/download the Postman collection [here](https://raw.githubusercontent.com/ak-tr/stash/main/stash_postman.json).