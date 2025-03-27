import axios from 'axios'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../config'

async function getAccessToken(): Promise<string> {
  try {
    const response = await axios.post(
      `${HOST}/oauth/token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return response.data.access_token
  } catch (error) {
    console.error('Failed to fetch access token:', error)
    throw new Error('Failed to fetch access token')
  }
}

async function fetchContacts(): Promise<any[]> {
  const accessToken = await getAccessToken()
  let allContacts: any[] = []
  let page = 1
  let hasMoreData = true

  while (hasMoreData) {
    try {
      console.log(`Fetching contacts from page ${page}`)
      const contactResponse = await axios.get(`${HOST}/finance/contacts`, {
        params: { page, per_page: 10 },
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YjdmMDI0YS01N2U4LTQ3MGItYWI3Yi1iMmMwZGE3OWU5ZDgiLCJqdGkiOiIwZDVjZWRlMGRmOTA1MmYwYjE4M2U1MjBjMDkwN2QwZjc5Nzc1NDJhYzdkYjY4NDZkNjY3NWJhMTFjNTFmNzRjZjViOGRkYjQwOTJjZmRlZSIsImlhdCI6MTcxMDc4MjUwNS41Mjg0NjgsIm5iZiI6MTcxMDc4MjUwNS41Mjg0NzEsImV4cCI6MTc0MjMxODUwNS41MTY5NjksInN1YiI6IjE5NDYyNyIsInNjb3BlcyI6W119.TI2y8gFarEQ7_Y3JIOdEIZCs_uEeMjHZFhJ8NWecDz-anMsoGBsTQjo2IH0YIJKpIeCLrWOLfto9MFNf5dUn-YovjcZRpsjLOAuXpTQ6mFATD2NX1yvDAlpr3GtoRE928OpWCdiNcEuhE-AXxmk_FrQxlRremdq2HcjzBDP_F4o3MzNzrh2JVdv7Ui4Q8cGRm2j2pFznNsn1uIYvvTYZN7QjMJxDwv8S6GpAYg01PiwKixVtXcRczax4sG9gVewVrtRo3MpZONNTfM2h1i7qi8rwjW1jSgNuY5afuTUAAMi9TpNenXX4GlXpgqUNjC8L79n6AhMoXEtWW9AJQQ7sHa9gMYs83W1gnVWHJKCj48Wak8K95L6fxxiw9_lcFZiQCHIlRzt_NyC5yR9o25mnf1SdDIEvhwWSgw3OvBzjHDC9dstMmlN-8g19tn4mWP0L1KMM5n4Qh0v2nacxgGfbjzcNPTaxhP29zgkxuIdh2oyzyhPugYys7S3sgtM2zahHdsBA9X452CvD6W14vY-ywvCWEIhAuzlQYsZdPqJddyz2_XJOhXxFiMfw9VfjRIExDb8oDKs08vT3hwFvHUqtIXevtv9Ch3buKdW8WDphHC8V6D3LdUR-0_yPMwyVeKISAwNND2ZOPqMdMS9fsJHIgvjLUqVnbP4mcI0uX_r3DX4`,
        },
      })

      const dataContact = contactResponse.data
      console.log(
        'Fetched contacts data:',
        JSON.stringify(dataContact, null, 2)
      )

      if (Array.isArray(dataContact.data)) {
        const formattedData = dataContact.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          group_id: item.group?.id ?? 'unknown',
          group_name: item.group?.name ?? 'unknown',
          receivable: item.receivable,
        }))

        allContacts = [...allContacts, ...formattedData]

        if (dataContact.data.length < 10) {
          hasMoreData = false
        } else {
          page++
        }
      } else {
        console.error('Unexpected data format:', dataContact.data)
        throw new Error('Unexpected data format')
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
      throw new Error('Failed to fetch contacts')
    }
  }

  return allContacts
}

export { fetchContacts }
