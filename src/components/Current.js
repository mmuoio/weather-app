import React, { Component } from "react";
import Hourly from "./Hourly";
import "./Current.css";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

class Current extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hourIndex: this.props.hourIndex,
			hourArr: [],
		};
	}

	/**
	 * Set the initial state
	 */
	componentDidMount() {
		this.setState({
			hourIndex: this.props.hourIndex,
			hourArr: this.getHourArray(this.props.hourIndex, this.props.hourly),
		});
	}
	/**
	 * Whenever this component or the parent updates (like when the API call responds), update the state again
	 */
	componentDidUpdate() {
		if (
			this.state.hourIndex !== this.props.hourIndex &&
			this.state.hourArr.length === 0
		) {
			this.setState({
				hourIndex: this.props.hourIndex,
				hourArr: this.getHourArray(
					this.props.hourIndex,
					this.props.hourly
				),
			});
		}
	}

	getHourArray(hourIndex, hourly) {
		let newHourArr = [];
		if (hourly.time.length > 1) {
			for (let i = hourIndex + 1; i < hourIndex + 5; i++) {
				let hour = {
					time: hourly.time[i],
					apparent_temperature: hourly.apparent_temperature[i],
					temperature_2m: hourly.temperature_2m[i],
					weathercode: hourly.weathercode[i],
					index: i,
				};

				newHourArr.push(hour);
			}
		}
		return newHourArr;
	}

	getNextHours() {
		const currentHourIndex = this.state.hourIndex + 4;
		const newHourArr = this.getHourArray(
			currentHourIndex,
			this.props.hourly
		);
		this.setState({
			hourArr: newHourArr,
			hourIndex: currentHourIndex,
		});
		if ($(".prevArrow").classList.contains("disabled")) {
			$(".prevArrow").classList.remove("disabled");
		}
	}

	getPrevHours() {
		let currentHourIndex = this.state.hourIndex - 4;
		if (currentHourIndex <= 0) currentHourIndex = 0;
		const newHourArr = this.getHourArray(
			currentHourIndex,
			this.props.hourly
		);
		this.setState({
			hourArr: newHourArr,
			hourIndex: currentHourIndex,
		});
		if (currentHourIndex === 0) {
			$(".prevArrow").classList.add("disabled");
		}
	}

	render() {
		const {
			currentWeather,
			daily,
			getApparentTemp,
			getRelativeHumidity,
			getWeatherFromCode,
		} = this.props;
		const { hourArr } = this.state;
		const weatherDesc = getWeatherFromCode(currentWeather.weathercode);

		return (
			<div className="currentWrapper">
				<div className="currentContainer">
					<div className="weatherIconContainer df align-content-center justify-content-center">
						<div
							style={{
								width: "100%",
							}}
						>
							<i
								className={
									"fa-solid weatherIcon " + weatherDesc.icon
								}
							></i>
						</div>
						<div>{Math.round(currentWeather.temperature)}&deg;</div>
					</div>
					<div className="currentContentHeader">
						<h1>{weatherDesc.label}</h1>
						Feels like: {getApparentTemp(currentWeather.time)}&deg;
					</div>
					<div className="currentContent">
						<div className="currentCard">
							<h3>High</h3>
							{Math.round(daily.temperature_2m_max[0])}&deg;
						</div>
					</div>
					<div className="currentContent">
						<div className="currentCard">
							<h3>Low</h3>
							{Math.round(daily.temperature_2m_min[0])}&deg;
						</div>
					</div>
					<div className="currentContent">
						<div className="currentCard">
							<h3>Humidity</h3>
							{getRelativeHumidity(currentWeather.time)}%
						</div>
					</div>
					<div className="currentContent">
						<div className="currentCard">
							<h3>Wind</h3>
							{currentWeather.windspeed} mph
						</div>
					</div>
				</div>
				<div className="currentHourlyContainer">
					{hourArr.map((hour, index) => (
						<div>
							<Hourly
								key={"hourly" + hour.index}
								hour={hour}
								getWeatherFromCode={getWeatherFromCode}
								index={index}
							/>
						</div>
					))}
					<div className="df justify-content-center align-items-center arrowCard">
						<div
							className="arrow prevArrow"
							onClick={this.getPrevHours.bind(this)}
						>
							<i className="fa-solid fa-circle-chevron-left"></i>
						</div>
						<div
							className="arrow nextArrow"
							onClick={this.getNextHours.bind(this)}
						>
							<i className="fa-solid fa-circle-chevron-right"></i>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Current;
