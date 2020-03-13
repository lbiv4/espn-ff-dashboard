# espn-ff-dashboard

This project was based around implementing an information dashboard for an ESPN fantasy football league by accessing data through ESPN APIs and transforming data into graph and table representations.

- Author: Lane Barton (bartoniv@pdx.edu)
- Github: https://github.com/lbiv4/espn-ff-dashboard
- Hosted Site: https://espn-ff-dashboard.herokuapp.com/ (NOTE: This may take 15-30 seconds to load, as Heroku will likely have to wakeup the app if it hasn’t been visited recently)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Additional Libraries/Resources

This code leverages the following libraries:

- Axios: Used for API calls
- React: Main front-end framework used
- `create-react-app`: Generated initial file structure/some documentation
- Reactstrap: CSS-styling as React Components
- React-Icons: Various SVG icons for a more polished look and to confer intentions through images as opposed to buttons and text
- Recharts: React charting library used to render graphs.
- Coolors: A color-scheme generator that helped pick a color scheme

## Contents

- Eight graphs/tables, including:
  - A line graph showing the average OR cumulative scores of each team over time
  - A pie graph showing a given team’s draft selection of players by position for a given round in the draft OR cumulatively through a round of the draft
  - A bar graph showing the frequencies of scores by any team in all games
  - A line graph showing the weekly score for a given team and the median/average for that week
  - A table showing information on all pairings of players and teams where a team drafted the player more than once
  - A table showing scoring highlights for each team, including most/least/average points for or against the team
- All data items can be expanded for a wider view, and most graphs have filters to adjust what information the graph is displaying
- There is the ability to open a sidebar which provides access to:
  - Any dashboards with a subset of graphs/tables (the defaults are “Scores” and “Draft” for scoring and draft related data items)
  - The ability to create a custom dashboard by providing a unique title and selecting which data items are desired. Custom items appear in the sidebar list once created
- Data will persist across browser sessions, so if you’ve already loaded the data once or saved a custom dashboard, that information will be saved. If this data is not desired, it can be deleted by going to `More Tools > Devevloper Tools > Application tab > Local Storage` and clearing/deleting all key/value pairs.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
