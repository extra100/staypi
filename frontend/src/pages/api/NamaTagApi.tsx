import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface DataTag {
  id: number
  name: string
}

export function useIdNamaTag() {
  const [loading, setLoading] = useState(true)
  const [idDataTag, setIdDataTag] = useState<DataTag[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('TagTransactions')
        if (storedData) {
          setIdDataTag(JSON.parse(storedData))
          setLoading(false)
          return
        }

        const response = await fetch(`${HOST}/oauth/token`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials',
          }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        const accessToken = data.access_token

        const bankTransResponse = await fetch(
          `${HOST}/finance/tags?page=1&per_page=2000`,
          {
            headers: {
              Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MmQ2MzFiMC0wZDFjLTQzNWItOGZkYS0yYWI4YmE2YzVkM2EiLCJqdGkiOiJlZDEwNjVlZTFjZjc2Y2IxOTI1NTIzNWU4YzE3YmE4NmNhM2JjMzc4Y2ZhNDRkYjk3NGQzMTA0YjRmZTE4NGI0NmUwZGUwYTlmNDBmY2FjYSIsImlhdCI6MTcyNDgwNTM0Ny41Mjc2MzMsIm5iZiI6MTcyNDgwNTM0Ny41Mjc2MzgsImV4cCI6MTcyNzM5NzM0Ny41MTI0MzEsInN1YiI6IjE5NDYyNyIsInNjb3BlcyI6WyJ3ZWIiLCJmaW5hbmNlIl19.AcCa2aLZemTJpWshwnnvG5906U0En3S_X1K2zMZ9K1JydmwFw2e8yjwwbnpSVBISXMIorLe48_juT_3mrRXENSIx3ek8xC1iAnkvpESzLfT0WuoE8HqhL2NjplobT3XL8ckYtybOE7txAG6rx7zmRKNcZI9NvUikuz5ALs-GlnWfIhs0F4CsXTUjeKWDJR8e6uT50-pXLHisBucby1JyIGQftUu1jHoKa3eKdLbqGoBbVlgERv2XEfyDbq4d-2T6Zfz_AgCHQfgqlOenY-qUzd-eY6-wmMydfB1P0kgqQ32Xf71aubK4mhEeYX-bKepN_6R7A0s7K6W2RDSAHnzd9jVDlNu8f4SvuB3YDxSkLbTktdL_pof_vVidGdK6rlqwK3QrpGIdUW4ErbuWd0MBiNaCkjxSc-87AxYXJjoHMTmX8kdkoYYKPZ8Z4te6SbpS9dNoYzllsZx_OZtry8dLg2KCSk5TlT0ztyGVXULSyCIZT4SnqYxwcvdyJ2kbbvG0sX_RyRxlKbfgoAEbAxqc5Ekf43QqMKeX8N96LXZJFlnHGlN2r223JUwW1ghWOWoVG2Gq1wGLGe6zd2RRHGLIhjbiPVvfcKdvUZxJ09bXJ07Lsa9ReJ7a9zBl8E1nMNe6oxdhK2jm2eyiVmniWRerMIGwLEAc0CHSJ60syeULWAQ`,
            },
          }
        )

        if (!bankTransResponse.ok) {
          throw new Error('Failed to fetch bank transactions')
        }

        const bankTransData = await bankTransResponse.json()
        const formattedData: DataTag[] = bankTransData.data.data.map(
          (item: DataTag) => ({
            id: item.id,
            name: item.name,
          })
        )

        setIdDataTag(formattedData)
        sessionStorage.setItem('TagTransactions', JSON.stringify(formattedData))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const memoizedData = useMemo(() => idDataTag, [idDataTag])

  return { loading, idDataTag }
}
