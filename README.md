# What does this library do?

This library includes the geocoding and carrier mapping functionalities that are available in some of googles libphonenumber libraries but not in libphonenumber-js (a port of libphonenumber).
To reduce the amount of data that needs to be loaded to geocode / carrier map a phonenumber for each mapping only the relevant number prefixes are loaded from a binary json file (BSON).
When the prefix could not be found in the provided locale the library tries to fallback to `en` as locale.
The library supports Node.js only at the moment.

# Installation

```sh
npm install libphonenumber-js libphonenumber-geo-carrier
```

or

```sh
yarn add libphonenumber-js libphonenumber-geo-carrier
```

# Usage

```js
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { geocoder, carrier } from 'libphonenumber-geo-carrier'

const main = async () => {
  const fixedLineNumber = parsePhoneNumberFromString('+41431234567')
  const locationEN = await geocoder(fixedLineNumber) // Zurich
  const locationDE = await geocoder(fixedLineNumber, 'de') // Zürich
  const locationIT = await geocoder(fixedLineNumber, 'it') // Zurigo

  const mobileNumber = parsePhoneNumberFromString('01701234567', 'DE')
  const originalCarrier = await carrier(mobileNumber) // T-Mobile
  // Works with locale as well, but there are not so much translations available for carriers:
  // const originalCarrier = await carrier(fixedLineNumber, 'zh')
}
main()
```
