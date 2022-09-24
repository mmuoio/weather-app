import React from "react";

import "./Hourly.css";

const Hourly = ({ getWeatherFromCode, hour }) => {
	const weatherDesc = getWeatherFromCode(hour.weathercode);
	const date = new Date(hour.time);
	const dateHours =
		date.getHours() > 12
			? date.getHours() - 12
			: date.getHours() > 0
			? date.getHours()
			: 12;
	const ampm = date.getHours() <= 11 && date.getHours() >= 0 ? "am" : "pm";
	return (
		<div className="df justify-content-center hourCard">
			<div className="hourlyTime df justify-content-center">
				<div>{dateHours + ampm}</div>
			</div>
			<div className="hourlyIcon">
				<i
					className={"fa-solid hourlyWeatherIcon " + weatherDesc.icon}
				></i>
			</div>
			<div>{Math.round(hour.temperature_2m)}&deg;</div>
		</div>
	);
};

export default Hourly;
