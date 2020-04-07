# D3js Ncov19 Dashboard

This is a practice project for learning d3.js.<br/>
I did this in a quick & dirty style in my 3-days self quarantine during the long weekend.<br/>
So please bear with me for lots of code are written in bad manner.<br/>

It's a static pure front-end page made with Angular + D3.js + rxjs.<br/>
(Because I don't want to spend any money for hosting the backend on cloud!)<br/>
I uploaded the page to [firebase hosting](https://covid19-d3js.web.app/dashboard).<br/>

![image](https://github.com/rex44391/ncov19/blob/master/ncov19-dashboard.jpg)

It has four parts: <br/>
(1) a control panel which has a checkbox to let user select which kind of data <br/>
    they want to see on the world map and info card and <br/>
    a slider to control the time of data showed on line chart and world map<br/>
    a play button to play the whole history<br/>

(2) a set of info cards shows the day of country users selected<br/>

(3) a world map(named trend-chart in my code) which has tooltip. 
    Users can click on the country to select it<br/>

(4) a line chart<br/>

## Usage

(1) Download the files from repo by git.<br/>
(2) Use your terminal and change to the directory of the this project<br/>
(3) 'npm install'<br/>
(4) 'ng serve'<br/>
(5) check it on localhost:4200<br/>

## Further update

I plan to complete rwd for all components to make it fit for small screen.<br/>
Also, I will refactor the code to make it cleaner.<br/>
(Maybe next long weekend in May)<br/>

## Credit

(1) [source of world map data](https://gist.githubusercontent.com/MaciejKus/61e9ff1591355b00c1c1caf31e76a668/raw/4a5d012dc2df1aae1c36e2fdd414c21824329452/combined2.json)<br/>
(2) [source of ncov19](https://pomber.github.io/covid19/timeseries.json)<br/>
(3) [world map](https://bl.ocks.org/piwodlaiwo/73f7a0e28c53d26c04f30a754de49085)<br/>
(4) [responsive multi-line chart](https://bl.ocks.org/josiahdavis/7a02e811360ff00c4eef)<br/>
(5) [facade pattern of dashboard service](https://stackblitz.com/edit/facades-with-rxjs-only)<br/>
(6) [info card grid css](https://fireship.io/lessons/three-responsive-css-grid-layouts/)<br/>

## License

MIT
