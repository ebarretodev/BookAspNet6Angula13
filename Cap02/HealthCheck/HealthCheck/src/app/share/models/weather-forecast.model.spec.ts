import { WeatherForecast } from './weather-forecast.model';

describe('WeatherForecast', () => {
  it('should create an instance', () => {
    expect(new WeatherForecast("2023-01-01", 20, 68, "Sunny")).toBeTruthy();
  });
});
