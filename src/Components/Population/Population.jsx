import React, { useState } from "react";
import { API_KEY } from "../../data";
import btn_img from "../../assets/undo.png";

const Population = () => {
  const [country, setCountry] = useState("");
  const [year1, setYear1] = useState("");
  const [year2, setYear2] = useState("");
  const [year3, setYear3] = useState("");
  const [year4, setYear4] = useState("");

  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const HistoricalYears = [
    2024, 2023, 2022, 2020, 2015, 2010, 2005, 2000, 1995, 1990, 1985, 1980,
    1975, 1970, 1965, 1960, 1955,
  ];
  const forecastYears = [2050, 2045, 2040, 2035, 2030, 2025];

  const fetchData = async (years) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/population?country=${country}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      const newData = {};
      for (const year of years) {
        const population =
          result.historical_population.find(
            (item) => item.year === parseInt(year)
          ) ||
          result.population_forecast.find(
            (item) => item.year === parseInt(year)
          );
        newData[year] = population || { population: null };
      }

      setData((prevData) => ({ ...prevData, ...newData }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareForecast = () => {
    if (!country || !year1 || !year2) {
      setError("Please enter a valid country and select years for comparison.");
      return;
    }
    fetchData([year1, year2]);
  };

  const handleCompareHistorical = () => {
    if (!country || !year3 || !year4) {
      setError("Please enter a valid country and select years for comparison.");
      return;
    }
    fetchData([year3, year4]);
  };

  const resetAllForm = () => {
    setCountry("");
    setYear1("");
    setYear2("");
    setYear3("");
    setYear4("");
    setData({});
    setError(null);
  };

  const resetForm1 = () => {
    setYear1("");
    setYear2("");
    setError(null);
  };

  const resetForm2 = () => {
    setYear3("");
    setYear4("");
    setError(null);
  };

  const resetData = () => {
    setData({});
    setError(null);
  };

  const calculateDifference = (yearA, yearB) => {
    const populationA = data[yearA]?.population;
    const populationB = data[yearB]?.population;

    if (populationA && populationB) {
      return (populationA - populationB).toLocaleString();
    }
    return "N/A";
  };

  return (
    <div className="container bg-gradient-to-br from-[#95c7fa] to-[#e2e8f0] font-spacegrotesk bg-white md:w-[600px] rounded-lg shadow-[15px_15px_25px_#595959] flex justify-center items-center px-4 py-6">
      <article className="bg-white w-full p-6 rounded-lg">
        <h1 className="text-center text-white uppercase tracking-widest py-4 bg-gradient-to-t from-[#0be692] to-[#07bade] rounded-xl">
          Population Comparison
        </h1>
        <div className="p-2 text-center rounded-md">
          <label>
            <span className="text-red-700 font-bold">Country :</span>{" "}
            <input
              className="border-solid border-2 border-slate-200 p-1 rounded-md text-xs"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Japan, Thailand"
            />
          </label>
        </div>

        {/* Form 1: Forecast vs Historical */}
        <div className="bg-slate-100 pb-5 rounded-md">
          <h2 className="p-4 text-center">
            Compare <span className="text-[#2995aa]">Forecast Year</span> with{" "}
            <span className="text-[#2995aa]">Historical Year</span>
          </h2>
          <div className="flex flex-col justify-center items-center gap-1">
            <div>
              <label>
                Year 1{" "}
                <span className="text-sm italic text-slate-500">
                  (Forecast)
                </span>{" "}
                :{" "}
                <select
                  className=""
                  value={year1}
                  onChange={(e) => setYear1(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {forecastYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label>
                Year 2{" "}
                <span className="text-sm italic text-slate-500">
                  (Historical)
                </span>{" "}
                :{" "}
                <select
                  value={year2}
                  onChange={(e) => setYear2(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {HistoricalYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
              <button
                className="bg-white w-full py-1 px-4 rounded-full hover:shadow-[5px_5px_10px_#07bade] bg-gradient-to-t from-[#0be692] to-[#07bade] uppercase tracking-widest text-white font-bold"
                type="button"
                onClick={handleCompareForecast}
                disabled={loading}
              >
                {loading ? <span>Loading...</span> : <span>compare</span>}
              </button>
              <button className="flex flex-col items-center justify-center bg-red-700 hover:bg-red-400 rounded-full">
                <img
                  src={btn_img}
                  type="button"
                  onClick={resetForm1}
                  className="w-[50px] invert brightness-200 p-1"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Form 2: Historical vs Historical */}
        <div className="mt-2 bg-slate-100 pb-5 rounded-md">
          <h2 className="p-4 text-center">
            Compare Two <span className="text-[#219f6f]">Historical Years</span>
          </h2>
          <div className="flex flex-col justify-center items-center gap-1">
            <div>
              <label>
                Year 1{" "}
                <span className="text-sm italic text-slate-500">
                  (Historical)
                </span>{" "}
                :{" "}
                <select
                  className=""
                  value={year3}
                  onChange={(e) => setYear3(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {HistoricalYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label>
                Year 2{" "}
                <span className="text-sm italic text-slate-500">
                  (Historical)
                </span>{" "}
                :{" "}
                <select
                  className=""
                  value={year4}
                  onChange={(e) => setYear4(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {HistoricalYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
              <button
                className="bg-white w-full py-1 px-4 rounded-full hover:shadow-[5px_5px_10px_#07bade] bg-gradient-to-t from-[#0be692] to-[#07bade] uppercase tracking-widest text-white font-bold"
                type="button"
                onClick={handleCompareHistorical}
                disabled={loading}
              >
                {loading ? <span>Loading...</span> : <span>Compare </span>}
              </button>
              <button className="flex flex-col items-center justify-center bg-red-700 hover:bg-red-400 rounded-full">
                <img
                  src={btn_img}
                  type="button"
                  onClick={resetForm2}
                  className="w-[50px] invert brightness-200 p-1"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Results */}
        {Object.keys(data).length > 0 && (
          <div className="mt-10 flex flex-col justify-center items-center bg-slate-100 rounded-md py-4">
            <h2>
              Population Comparison Results :{" "}
              <span className="uppercase text-red-700">{country}</span>
            </h2>
            {Object.entries(data).map(([year, info]) => (
              <p key={year}>
                <strong>Year {year} :</strong>{" "}
                {info.population ? info.population.toLocaleString() : "No data"}
              </p>
            ))}
            {year1 && year2 && (
              <p>
                <strong>
                  Difference between {year1} and {year2}:
                </strong>{" "}
                {calculateDifference(year1, year2)}
              </p>
            )}
            {year3 && year4 && (
              <p>
                <strong>
                  Difference between {year3} and {year4}:
                </strong>{" "}
                {calculateDifference(year3, year4)}
              </p>
            )}

            <div className="flex justify-center items-center">
              <button
                type="button"
                className="mt-6 text-center px-4 py-2 bg-gradient-to-t from-slate-300 to-slate-100 rounded-full hover:text-red-700 hover:font-semibold"
                onClick={resetData}
              >
                Reset All Results
              </button>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="mt-6 text-center px-4 py-2 bg-gradient-to-t from-slate-300 to-slate-100 rounded-full hover:text-red-700 hover:font-semibold"
            onClick={resetAllForm}
          >
            Reset All
          </button>
        </div>
      </article>
    </div>
  );
};

export default Population;
