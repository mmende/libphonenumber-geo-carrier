import { PhoneNumber } from 'libphonenumber-js'
import { GeocoderLocale, CarrierLocale } from './locales'
import fs from 'fs'
import { promisify } from 'util'
import { deserialize } from 'bson'
import path from 'path'

const access = promisify(fs.access)
const readFile = promisify(fs.readFile)

/**
 * Extracts the numbers national prefix which is used as key in the metadata bson files
 *
 * @param phonenumber The phonenumber object
 * @returns The national prefix of the phonenumber (e.g. "+49 6221 123456" => "6221")
 */
const getPrefix = (phonenumber: PhoneNumber) =>
  phonenumber.formatInternational().replace(/^\+[0-9]+ ([0-9]+) .*/, '$1')

/**
 * Maps the dataPath and prefix to geocode, carrier or timezones of null if this info could not be extracted
 *
 * **Note:** Timezones are returned as single string joined with `&`
 *
 * @param dataPath Path of the metadata bson file to use
 * @param prefix National prefix of the given number
 */
const getCode = async (dataPath: string, prefix: string) => {
  try {
    await access(dataPath)
    const bData = await readFile(dataPath)
    const data = deserialize(bData)
    const description = data[prefix]
    return description as string
  } catch (err) {
    // console.log('Could not parse bson', err)
  }
  return null
}

/**
 * Provides geographical information related to the phone number
 *
 * @param phonenumber The phone number
 * @param locale The preferred locale to use (falls back to `en` if there are no localized carrier infos for the given locale)
 */
export const geocoder = async (
  phonenumber: PhoneNumber | undefined,
  locale: GeocoderLocale = 'en'
) => {
  if (!phonenumber) {
    return null
  }
  const { countryCallingCode } = phonenumber
  const prefix = getPrefix(phonenumber)
  let dataPath = path.join(
    __dirname,
    '../resources/geocodes/',
    locale,
    `${countryCallingCode}.bson`
  )
  const code = await getCode(dataPath, prefix)
  if (code) {
    return code
  }
  if (locale !== 'en') {
    // Try fallback to english
    dataPath = path.join(
      __dirname,
      '../resources/geocodes/',
      'en',
      `${countryCallingCode}.bson`
    )
    return await getCode(dataPath, prefix)
  }
  return null
}

/**
 * Maps the phone number to the original carrier
 *
 * **Note:** This method cannot provide data about the current carrier of the phone number,
 * only the original carrier who is assigned to the corresponding range.
 * @see https://github.com/google/libphonenumber#mapping-phone-numbers-to-original-carriers
 *
 * @param phonenumber The phone number
 * @param locale The preferred locale to use (falls back to `en` if there are no localized carrier infos for the given locale)
 */
export const carrier = async (
  phonenumber: PhoneNumber | undefined,
  locale: CarrierLocale = 'en'
) => {
  if (!phonenumber) {
    return null
  }
  const { countryCallingCode } = phonenumber
  const prefix = getPrefix(phonenumber)
  let dataPath = path.join(
    __dirname,
    '../resources/carrier/',
    locale,
    `${countryCallingCode}.bson`
  )
  const code = await getCode(dataPath, prefix)
  if (code) {
    return code
  }
  if (locale !== 'en') {
    // Try fallback to english
    dataPath = path.join(
      __dirname,
      '../resources/carrier/',
      'en',
      `${countryCallingCode}.bson`
    )
    return await getCode(dataPath, prefix)
  }
  return null
}

/**
 * Provides all timezones related to the phone number
 * @param phonenumber The phone number
 */
export const timezones = async (phonenumber: PhoneNumber | undefined) => {
  if (!phonenumber) {
    return null
  }
  const { countryCallingCode } = phonenumber
  let dataPath = path.join(__dirname, '../resources/timezones.bson')
  const zones = await getCode(dataPath, countryCallingCode as string)
  if (typeof zones === 'string') {
    return zones.split('&')
  }
  return null
}
