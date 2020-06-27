/**
 * Just some simple test cases to check for major flaws...
 * should probably much more
 */

import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { geocoder, carrier, timezones } from './index'

it('geocodes with default locale en', async () => {
  const phoneNr = parsePhoneNumberFromString('+41431234567')
  const location = await geocoder(phoneNr)
  expect(location).toEqual('Zurich')
})

it('geocodes other locales correctly', async () => {
  const phoneNr = parsePhoneNumberFromString('+41431234567')
  const locationDE = await geocoder(phoneNr, 'de')
  expect(locationDE).toEqual('Zürich')
  const locationIT = await geocoder(phoneNr, 'it')
  expect(locationIT).toEqual('Zurigo')
})

it('maps a carrier correctly', async () => {
  const phoneNr = parsePhoneNumberFromString('01701234567', 'DE')
  const carrierEN = await carrier(phoneNr)
  expect(carrierEN).toEqual('T-Mobile')
  // There should not be an arabic mapping for german carrier numbers (I guess?)
  const carrierAR = await carrier(phoneNr, 'ar')
  expect(carrierAR).toEqual('T-Mobile')
})

it('maps carriers with different locales correctly', async () => {
  const phoneNr = parsePhoneNumberFromString('+8619912345678')
  const carrierEN = await carrier(phoneNr)
  expect(carrierEN).toEqual('China Telecom')
  const carrierZH = await carrier(phoneNr, 'zh')
  expect(carrierZH).toEqual('中国电信')
})

it('maps timezones correctly', async () => {
  const phoneNr1 = parsePhoneNumberFromString('+49301234567')
  const tz1 = await timezones(phoneNr1)
  expect(tz1).toEqual(['Europe/Berlin'])

  const phoneNr2 = parsePhoneNumberFromString('646-273-5246', 'US')
  const tz2 = await timezones(phoneNr2)
  expect(tz2).toContain('America/New_York')
})
