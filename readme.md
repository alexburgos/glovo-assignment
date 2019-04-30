# Glovo Senior Frontend Engineer Challenge

## Assignment
Your task is to create a simple application that will display to the user a list of categories (with icon). If the user enters in a category, he will be able to see all the stores from that category.

But beware, there are certain conditions:

- Open stores should display a message that says: "Open right now"
- Closed stores should display a message that says: "Next opening time: [day of the week] at [hour]"
- Closed stores should be displayed last
- If all the stores of a category are closed, the category itself should be closed
- You should be able to filter by tags


## Tools
I am using Create React App and some third party libraries for date manipulation and utility functions (lodash).

## Server
Just clone this project and run `npm install && npm run serve` (or yarn). Server will be running on port 3001.

## Development
I set up a proxy inside the client that points to port 3001. The React server will run on port 3000, using this proxy allows me to use the endpoints in port 3001 and access resources without violating CORS.

## Build
Inside the client folder run `npm install` or `yarn install` then `npm build` or `yarn build`. This should build a deployable app inside the /build folder. This can then be accessed from the main server to view the app in [http://localhost:3001](http://localhost:3001).
