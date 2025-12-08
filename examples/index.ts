// Usage: npx tsx examples/index.ts <phone-number> [<locale>]

import { carrier, geocoder, timezones } from 'libphonenumber-geo-carrier'

import parsePhoneNumberFromString from 'libphonenumber-js'

const main = async () => {
  if (process.argv.length < 2) {
    console.error('Usage: npx tsx examples/index.ts <phone-number> [<locale>]')
  }
  let nr = process.argv[2]
  const pn = parsePhoneNumberFromString(nr)
  const code = (process.argv[3] as any) || 'en'

  if (!pn) {
    console.error('Invalid phone number')
    process.exit(1)
  }

  const location = await geocoder(pn, code)
  const carrierName = await carrier(pn, code)
  const tzones = await timezones(pn)

  console.log(`Phone Number: ${pn.formatInternational()}`)
  console.log(`Location: ${location}`)
  console.log(`Carrier: ${carrierName}`)
  console.log(`Timezones: ${tzones?.join(', ')}`)
}
main()
