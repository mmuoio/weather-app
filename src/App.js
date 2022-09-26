import React, { Component } from "react";

import Current from "./components/Current";
//import Weekly from "./components/Weekly";

import "./App.css";

class App extends Component {
	constructor() {
		super();
		this.state = {
			current_weather: {
				temperature: 0,
				windspeed: 0,
				weathercode: 0,
				time: "",
			},
			daily: {
				temperature_2m_max: [0],
				temperature_2m_min: [0],
			},
			hourly: {
				time: [""],
				apparent_temperature: [0],
				relativehumidity_2m: [0],
			},
		};
	}

	componentDidUpdate() {
		//console.log("updated");
	}

	/**
	 * Grabbing the weather data via an API call
	 */
	componentDidMount() {
		fetch(
			"https://api.open-meteo.com/v1/forecast?latitude=40.17&longitude=-75.17&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York"
		)
			.then((response) => response.json())
			.then((weather) => {
				this.setState({
					current_weather: weather.current_weather,
					daily: weather.daily,
					hourly: weather.hourly,
				});
				//console.log("loaded");
			});
	}

	/**
	 * Returns the index in the hourly array for the time provided
	 * @param {string} time
	 * @returns number
	 */
	getTimeIndex = (time) => {
		const { hourly } = this.state;

		return hourly.time.indexOf(time);
	};

	/**
	 * Returns the "feels like" temperature for the time provided
	 * @param {string} time
	 * @returns string
	 */
	getApparentTemp = (time) => {
		const { hourly } = this.state;

		const timeIndex = this.getTimeIndex(time);
		let apparent_temperature = "N/A";
		if (timeIndex >= 0) {
			apparent_temperature = Math.round(
				hourly.apparent_temperature[timeIndex]
			);
		}
		return apparent_temperature;
	};

	/**
	 * Returns the humidity for the time provided
	 * @param {string} time
	 * @returns
	 */
	getRelativeHumidity = (time) => {
		const { hourly } = this.state;

		const timeIndex = this.getTimeIndex(time);
		let humidity = "N/A";
		if (timeIndex >= 0) {
			humidity = Math.round(hourly.relativehumidity_2m[timeIndex]);
		}
		return humidity;
	};

	/**
	 * Takes a numeric code and returns the weather text and icon
	 * @param {number} code
	 * @returns
	 */
	getWeatherFromCode = (code) => {
		const weatherCodes = {
			//Clear
			0: { label: "Clear sky", icon: "fa-sun" },
			//Clouds
			1: { label: "Mostly clear", icon: "fa-cloud-sun" },
			2: { label: "Partly cloudy", icon: "fa-cloud-sun" },
			3: { label: "Cloudy", icon: "fa-cloud" },
			//Fog
			45: { label: "Foggy", icon: "fa-cloud-fog" },
			48: { label: "Rime fog", icon: "fa-cloud-fog" },
			//Drizzle
			51: { label: "Light drizzle", icon: "fa-cloud-drizzle" },
			53: { label: "Drizzle", icon: "fa-cloud-drizzle" },
			55: { label: "Dense drizzle", icon: "fa-cloud-drizzle" },
			56: { label: "Freezing drizzle", icon: "fa-cloud-drizzle" },
			57: { label: "Freezing dense drizzle", icon: "fa-cloud-drizzle" },
			//Rain
			61: { label: "Light rain", icon: "fa-cloud-rain" },
			63: { label: "Rain", icon: "fa-cloud-rain" },
			65: { label: "Heavy rain", icon: "fa-cloud-rain" },
			66: { label: "Freezing rain", icon: "fa-cloud-hail-mixed" },
			67: { label: "Heavy freezing rain", icon: "fa-cloud-hail-mixed" },
			//Snow
			71: { label: "Light snow", icon: "fa-cloud-snow" },
			73: { label: "Snow", icon: "fa-snowflake" },
			75: { label: "Heavy snow", icon: "fa-snowflakes" },
			77: { label: "Snow grains", icon: "fa-snowflakes" },
			//Rain showers
			80: { label: "Light rain showers", icon: "fa-cloud-showers-heavy" },
			81: { label: "Rain showers", icon: "fa-cloud-showers-heavy" },
			82: { label: "Heavy rain showers", icon: "fa-cloud-showers-heavy" },
			85: { label: "Snow showers", icon: "fa-snowflake" },
			86: { label: "Heavy snow showers", icon: "fa-snowflakes" },
			//Thunderstorm
			95: { label: "Thunderstorms", icon: "fa-cloud-bolt" },
			96: { label: "Thunderstorms w/ hail", icon: "fa-cloud-bolt" },
			97: { label: "Thunderstorms w/ heavy hail", icon: "fa-cloud-bolt" },
		};
		return weatherCodes[code];
	};

	/**
	 * Render function
	 * @returns render
	 */
	render() {
		const { current_weather, daily, hourly } = this.state;
		const hourIndex = hourly.time.indexOf(current_weather.time);
		return (
			<div className="container df justify-content-center">
				<Current
					key="current1"
					currentWeather={current_weather}
					daily={daily}
					hourly={hourly}
					getApparentTemp={this.getApparentTemp}
					getRelativeHumidity={this.getRelativeHumidity}
					getWeatherFromCode={this.getWeatherFromCode}
					hourIndex={hourIndex}
				/>
				{/*<Weekly daily={daily} hourly={hourly} />*/}
			</div>
		);
	}
}

export default App;

/*
Components:

Current
Weekly
Daily
Hourly





*/
