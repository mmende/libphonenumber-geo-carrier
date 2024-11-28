# Phonenumber geo-, carrier- and timezone infos

[![npm version](https://badge.fury.io/js/libphonenumber-geo-carrier.svg?icon=si%3Anpm)](https://badge.fury.io/js/libphonenumber-geo-carrier)
<a href="https://www.npmjs.com/package/libphonenumber-geo-carrier"><img title="npm mongthly downloads" src="https://badgen.net/npm/dm/libphonenumber-geo-carrier?icon=npm"></a>
<a href="https://www.npmjs.com/package/libphonenumber-geo-carrier"><img title="npm total downloads" src="https://badgen.net/npm/dt/libphonenumber-geo-carrier?icon=npm"></a>

This library includes the geocoding, carrier mapping and timezone mapping functionalities that are available in some of googles [libphonenumber](https://github.com/google/libphonenumber) libraries but not in [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js) (a port of libphonenumber).

To reduce the amount of data that needs to be loaded to geocode / carrier map a phonenumber for each mapping only the relevant number prefixes are loaded from a binary json file (BSON).
When the prefix could not be found in the provided locale the library tries to fallback to `en` as locale.
The library supports Node.js only at the moment.

## Installation

```sh
npm install libphonenumber-js libphonenumber-geo-carrier
```

or

```sh
yarn add libphonenumber-js libphonenumber-geo-carrier
```

## Usage

The available methods are:

- `geocoder(phonenumber: PhoneNumber, locale?: GeocoderLocale = 'en'): Promise<string | null>` - Resolved to the geocode or null if no geocode could be found (e.g. for mobile numbers)
- `carrier(phonenumber: PhoneNumber, locale?: CarrierLocale = 'en'): Promise<string | null>` - Resolves to the carrier or null if non could be found (e.g. for fixed line numbers)
- `timezones(phonenumber: PhoneNumber): Promise<Array<string> | null>` - Resolved to an array of timezones or null if non where found.

## Examples

```js
import parsePhoneNumberFromString from 'libphonenumber-js'
import { geocoder, carrier, timezones } from 'libphonenumber-geo-carrier'

const main = async () => {
  const fixedLineNumber = parsePhoneNumberFromString('+41431234567')
  const locationEN = await geocoder(fixedLineNumber) // Zurich
  const locationDE = await geocoder(fixedLineNumber, 'de') // Zürich
  const locationIT = await geocoder(fixedLineNumber, 'it') // Zurigo

  const mobileNumber = parsePhoneNumberFromString('+8619912345678')
  const carrierEN = await carrier(mobileNumber) // China Telecom
  const carrierZH = await carrier(mobileNumber, 'zh') // 中国电信

  const fixedLineNumber2 = parsePhoneNumberFromString('+49301234567')
  const tzones = await timezones(fixedLineNumber2) // ['Europe/Berlin']
}

main()
```
