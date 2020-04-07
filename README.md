# D3js Ncov19 Dashboard

This is a practice project for learning d3.js.
I did this in a quick & dirty style in my 3-days self quarantine during the long weekend.
So please bear with me for lots of code are written in bad manner.

It's a static pure front-end page made with Angular + D3.js + rxjs.
(Because I don't want to spend any money for hosting the backend on cloud!)
I uploaded the page to [firebase hosting](https://covid19-d3js.web.app/dashboard).

![image](https://github.com/rex44391/ncov19/blob/master/ncov19-dashboard.jpg)

It has four parts:
(1) a control panel which has a checkbox to let user select which kind of data 
    they want to see on the world map and info card and 
    a slider to control the time of data showed on line chart and world map
    a play button to play the whole history

(2) a set of info cards shows the day of country users selected

(3) a world map(named trend-chart in my code) which has tooltip. 
    Users can click on the country to select it

(4) a line chart

## Usage

(1) Download the files from repo by git.
(2) Use your terminal and change to the directory of the this project
(3) 'npm install'
(4) 'ng serve'
(5) check it on localhost:4200

## Further update

I plan to complete rwd for all components to make it fit for small screen.
Also, I will refactor the code to make it look more clean.
(Maybe next long weekend in May)

## Credit

(1) [source of world map data](https://gist.githubusercontent.com/MaciejKus/61e9ff1591355b00c1c1caf31e76a668/raw/4a5d012dc2df1aae1c36e2fdd414c21824329452/combined2.json)
(2) [source of ncov19](https://pomber.github.io/covid19/timeseries.json)
(3) [world map](https://bl.ocks.org/piwodlaiwo/73f7a0e28c53d26c04f30a754de49085)
(4) [responsive multi-line chart](https://bl.ocks.org/josiahdavis/7a02e811360ff00c4eef)
(5) [facade pattern of dashboard service](https://stackblitz.com/edit/facades-with-rxjs-only)
(6) [info card grid css](https://fireship.io/lessons/three-responsive-css-grid-layouts/)

## License

MIT