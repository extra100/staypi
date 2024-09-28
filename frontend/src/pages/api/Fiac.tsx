import { useState, useEffect, useMemo } from 'react'
import { CLIENT_ID, CLIENT_SECRET, HOST } from '../../config'
import TOKEN from '../../token'

export interface FinanceAccount {
  id: number
  name: string
  ref_code: string
  finance_account_category_id: number
  is_locked: number
  parent_id: number | null
  is_parent: number
  currency_id: number | null
  desc: string | null
  children?: FinanceAccount[]
  is_deletable?: boolean
  balance?: number
  max_date?: string
}

const mapFinanceAccount = (item: any): FinanceAccount => ({
  id: item.id,
  name: item.name,
  ref_code: item.ref_code,
  finance_account_category_id: item.finance_account_category_id,
  is_locked: item.is_locked,
  parent_id: item.parent_id,
  is_parent: item.is_parent,
  currency_id: item.currency_id,
  desc: item.desc,
  children: item.children ? item.children.map(mapFinanceAccount) : [],
  is_deletable: item.is_deletable,
  balance: item.balance,
  max_date: item.max_date,
})

export function useFiac() {
  const [loading, setLoading] = useState(true)
  const [fiAc, setFiac] = useState<FinanceAccount | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = sessionStorage.getItem('FinanceAccount')
        if (storedData) {
          setFiac(JSON.parse(storedData))
          setLoading(false)
          return
        }

        const response = await fetch(`${HOST}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
          `${HOST}/finance/accounts?page=1&per_page=20`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        )

        if (!bankTransResponse.ok) {
          throw new Error('Failed to fetch bank transactions')
        }

        const bankTransData = await bankTransResponse.json()
        const accountsData = bankTransData.data.data.map(mapFinanceAccount)

        const kasLancar = accountsData.find(
          (account: FinanceAccount) => account.name === 'KAS LANCAR'
        )
        const kasPenjualanOtlet = kasLancar?.children?.find(
          (child: FinanceAccount) => child.name === 'KAS PENJUALAN OTLET'
        )

        // console.log('KAS PENJUALAN OTLET:', kasPenjualanOtlet)

        setFiac(kasPenjualanOtlet || null)
        sessionStorage.setItem(
          'FinanceAccount',
          JSON.stringify(kasPenjualanOtlet || null)
        )
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const memoizedData = useMemo(() => fiAc, [fiAc])

  return { loading, fiAc }
}
