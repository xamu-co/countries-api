/* eslint-disable import/no-unresolved */
import _ from "lodash";

import { defineCachedEventHandler, getQuery, getRouterParam, useStorage } from "#imports";

import type { iCountry, tSupportedLangs } from "../../types";
import {
	getMatches,
	makeJsonResponse,
	makeMapCountryData,
	makeMapStateData,
	mapCityData,
	supportedLangs,
} from "./utils";

/** Request chache in seconds */
const maxAge = Number(process.env.REQUEST_CACHE) || 60 * 60 * 24;

/**
 * Get the edges from a given collection
 */
export default defineCachedEventHandler(
	async (event) => {
		const JsonResponse = makeJsonResponse(event);

		try {
			const query = getQuery(event);
			const lang = <tSupportedLangs | undefined>query.lang;
			const withStates = typeof query.states === "string";
			const withCities = typeof query.cities === "string";
			const storage = useStorage("assets:countries");

			// Check for lang errors
			if (lang) {
				if (typeof lang !== "string") {
					return JsonResponse("Non supported lang format was given", 422);
				} else if (!supportedLangs.includes(lang)) {
					const langs = supportedLangs.join(", ");

					return JsonResponse(`Unsupported translation, supported ones are: ${langs}`, 422);
				}
			}

			const mapCountryData = makeMapCountryData(lang, withStates, withCities);
			const mapStateData = makeMapStateData(withCities);
			const countryParam = getRouterParam(event, "country");

			const countries: iCountry[] = await storage.getItem("index.json");
			const country = countries.find(({ name, iso2, iso3, translations }) => {
				const matchable = [...getMatches(name), iso2, iso3, ...Object.values(translations)];

				return matchable
					.filter((v): v is string => !!v)
					.map((v) => v.toLowerCase())
					.includes(countryParam?.toLowerCase());
			});

			// Country does not exist
			if (!countryParam || !country) {
				return JsonResponse("No country with the given data was found", 404);
			}

			const countryPath = `${_.kebabCase(country.name)}.json`;
			const countryData: iCountry = await storage.getItem(countryPath);
			const stateParam = getRouterParam(event, "state");
			const stateData = countryData.states?.find(({ name, state_code }) => {
				const matchable = [...getMatches(name), state_code];

				return matchable
					.filter((v) => !!v)
					.map((v) => v.toLowerCase())
					.includes(stateParam?.toLowerCase());
			});

			// State does not exist
			if (!stateParam || !stateData) {
				return JsonResponse(`No state with the given data was found within "${countryData.name}"`, 404);
			}

			const cityParam = getRouterParam(event, "city");
			const cityData = stateData.cities?.find(({ name }) => {
				const matchable = getMatches(name);

				return matchable
					.filter((v) => !!v)
					.map((v) => v.toLowerCase())
					.includes(cityParam?.toLowerCase());
			});

			// City does not exist
			if (!cityParam || !cityData) {
				return JsonResponse(`No city with the given data was found within "${stateData.name}"`, 404);
			}

			const mappedCity = mapCityData(cityData);
			const withCountry = typeof query.country === "string";
			const withState = typeof query.state === "string";

			if (withState) mappedCity.state = mapStateData(stateData);
			if (withCountry) mappedCity.country = mapCountryData(countryData);

			// Specific city
			return JsonResponse(mappedCity);
		} catch (error) {
			// handle unexpected errors
			if (process.env.DEBUG) console.error(error);

			return JsonResponse("Something went wrong", 500);
		}
	},
	{ maxAge }
);
