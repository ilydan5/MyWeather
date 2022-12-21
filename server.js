const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const favicon = require('serve-favicon')
const path = require('path')
const app = express()

const apiKey = '7e7fda69ce0d4529392ce6cc15222a7c';

app.use(favicon(path.join(__dirname, 'public', 'images', 'weather.ico')))
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {data: {weather: null, windSpeed: null, humidity: null}, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=ru`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {data:{weather: null, windSpeed: null, humidity: null}, error: 'Ошибка, попробуйте снова'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {data:{weather: null, windSpeed: null, humidity: null}, error: 'Ошибка, данных погоды по введённому городу нет, попробуйте снова'});
      } else {
        let weatherText = `${weather.main.temp}\xB0C в городе ${weather.name} (Ощущается как ${weather.main.feels_like}\xB0C)`
        let windSpeed = `Скорость ветра: ${weather.wind.speed}м/с`
        let humidity = `Влажность: ${weather.main.humidity}%`;
        res.render('index', {data:{weather: weatherText, windSpeed, humidity}, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})