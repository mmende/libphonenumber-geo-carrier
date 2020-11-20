import { PhoneNumber } from 'libphonenumber-js'
import { GeocoderLocale, CarrierLocale } from './locales'
import fs from 'fs'
import { promisify } from 'util'
import { deserialize } from 'bson'
import path from 'path'

const access = promisify(fs.access)
const readFile = promisify(fs.readFile)

const getPrefix = (phonenumber: PhoneNumber) =>
  phonenumber.formatInternational().replace(/^\+[0-9]+ ([0-9]+) .*/, '$1')

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
