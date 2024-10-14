import express, { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import NodeCache from 'node-cache'
import expressAsyncHandler from 'express-async-handler'
import { HOST } from '../config'
import TOKEN from '../token'
import { TransactionModel } from '../models/BarangTerJualModel'

type TransaksiBarangTerjual = {
  data: {
    warehouse_id: number
    id: number
    trans_date: string
    due_date: string
    status_id: number
    contact_id: number
    due: number
    amount_after_tax: number
    ref_number: string
    amount: number
    additional_discount_amount: number
    currency_rate: number
    currency_id: number
    shipping_cost: number
    shipping_date: string | null
    business_tran_id: number | null
    contact: {
      id: number
      name: string
    }
    fees: any[]
    products: {
      name: string
      qty: number
      unit: string
    }[]
    reference: string
    tags: {
      id: number
      name: string
      color: string
    }[]
    city: string | null
    province: string | null
    warehouse: {
      id: number
      name: string
      code: string
      desc: string | null
    }
    items: {
      id: number
      tran_id: number
      finance_account_id: number
      trans_type_id: number
      tax_id: number | null
      desc: string
      qty: number
      price: number
      price_after_tax: number
      amount: number
      amount_after_tax: number
      discount_percent: number
      discount_amount: number
      additional_discount_amount: number
      taxable: number
      tax: number
      subtotal: number
      unit_id: number
      unit_conv: number
      discount_amount_input: string
      amount_after_tax_ori: number | null
      amount_ori: number | null
      currency_id: number
      currency_rate: number
      local_id: number | null
      product: {
        id: number
        name: string
        is_track: boolean
        avg_base_price: number
        base_price: number
        code: string
        bundle_type_id: number
        purchase_account_id: number
        sell_account_id: number
        unit_id: number
        pos_product_category_id: number
        wholesale_price: {
          price: number
          min_qty: number
          use_discount_percent: number
        }[]
        is_purchase: boolean
        is_sell: boolean
      }
      unit_name: string
    }[]
    grand_total: {
      subtotal: number
      tax: number
      discount_amount: number
      additional_discount_amount: number
      additional_discount_percent: number
      total: number
      due: number
      shipping_cost: number
      witholding: number | null
      return: number
      paid: number
    }
  }[]
}

const barangTerjualRouter = express.Router()
const fetchBartersByPage = async (
  page: number,
  perPage: number
): Promise<{ data: TransaksiBarangTerjual['data']; total: number }> => {
  const dateFrom = '2024-10-07'
  const dateTo = '2024-10-07'
  const response = await axios.get(
    `${HOST}/reportings/salesDetail?date_from=${dateFrom}&date_to=${dateTo}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  )

  const data = response.data.data.data.map((item: any) => ({
    warehouse_id: item.warehouse_id ?? 0,
    amount: item.amount,

    id: item.id,
    trans_date: item.trans_date,
    due_date: item.due_date,
    ref_number: item.ref_number,
    contact_id: item.contact_id,
    due: item.due,
    amount_after_tax: item.amount_after_tax,
    status_id: item.status_id,

    warehouses:
      item.warehouses?.map((warehouse: any) => ({
        id: warehouse.id ?? 0,
        name: warehouse.name ?? '',
        code: warehouse.code ?? '',
        desc: warehouse.desc ?? '',
      })) ?? [],
    contact: {
      id: item.contact?.id ?? 0,
      name: item.contact?.name ?? '',
      email: item.contact?.email ?? null,
      phone: item.contact?.phone ?? null,
      company: item.contact?.company ?? null,
      address: item.contact?.address ?? '',
      country_id: item.contact?.country_id ?? 0,
      province_id: item.contact?.province_id ?? null,
      city_id: item.contact?.city_id ?? null,
      district_id: item.contact?.district_id ?? null,
      village_id: item.contact?.village_id ?? null,
      group_id: item.contact?.group_id ?? 0,
      salutation_id: item.contact?.salutation_id ?? null,
      type_ids: item.contact?.type_ids ?? [],
      edit_address: item.contact?.edit_address ?? null,
      finance_contact_emails: item.contact?.finance_contact_emails ?? [],
    },
    fees: item.fees ?? [],
    products:
      item.products?.map((product: any) => ({
        name: product.name ?? '',
        qty: product.qty ?? 0,
        unit: product.unit ?? '',
      })) ?? [],
    reference: item.reference ?? '',
    tags:
      item.tags?.map((tag: any) => ({
        id: tag.id ?? 0,
        name: tag.name ?? '',
        color: tag.color ?? '',
      })) ?? [],
    city: item.city ?? null,
    province: item.province ?? null,

    items:
      item.items?.map((itemDetail: any) => ({
        id: itemDetail.id ?? 0,
        tran_id: itemDetail.tran_id ?? 0,
        finance_account_id: itemDetail.finance_account_id ?? 0,
        trans_type_id: itemDetail.trans_type_id ?? 0,
        tax_id: itemDetail.tax_id ?? null,
        desc: itemDetail.desc ?? '',
        qty: itemDetail.qty ?? 0,
        price: itemDetail.price ?? 0,
        price_after_tax: itemDetail.price_after_tax ?? 0,
        amount: itemDetail.amount ?? 0,
        amount_after_tax: itemDetail.amount_after_tax ?? 0,
        discount_percent: itemDetail.discount_percent ?? 0,
        discount_amount: itemDetail.discount_amount ?? 0,
        additional_discount_amount: itemDetail.additional_discount_amount ?? 0,
        taxable: itemDetail.taxable ?? 0,
        tax: itemDetail.tax ?? 0,
        subtotal: itemDetail.subtotal ?? 0,
        unit_id: itemDetail.unit_id ?? 0,
        unit_conv: itemDetail.unit_conv ?? 0,
        discount_amount_input: itemDetail.discount_amount_input ?? '',
        amount_after_tax_ori: itemDetail.amount_after_tax_ori ?? null,
        amount_ori: itemDetail.amount_ori ?? null,
        currency_id: itemDetail.currency_id ?? 0,
        currency_rate: itemDetail.currency_rate ?? 1,
        local_id: itemDetail.local_id ?? null,
        product: {
          id: itemDetail.product?.id ?? 0,
          name: itemDetail.product?.name ?? '',
          is_track: itemDetail.product?.is_track ?? false,
          avg_base_price: itemDetail.product?.avg_base_price ?? 0,
          base_price: itemDetail.product?.base_price ?? 0,
          code: itemDetail.product?.code ?? '',
          bundle_type_id: itemDetail.product?.bundle_type_id ?? 0,
          purchase_account_id: itemDetail.product?.purchase_account_id ?? 0,
          sell_account_id: itemDetail.product?.sell_account_id ?? 0,
          unit_id: itemDetail.product?.unit_id ?? 0,
          pos_product_category_id:
            itemDetail.product?.pos_product_category_id ?? 0,
          wholesale_price:
            itemDetail.product?.wholesale_price?.map((price: any) => ({
              price: price.price ?? 0,
              min_qty: price.min_qty ?? 0,
              use_discount_percent: price.use_discount_percent ?? 0,
            })) ?? [],
          is_purchase: itemDetail.product?.is_purchase ?? false,
          is_sell: itemDetail.product?.is_sell ?? false,
        },
        unit_name: itemDetail.unit_name ?? '',
      })) ?? [],
    grand_total: {
      subtotal: item.grand_total?.subtotal ?? 0,
      tax: item.grand_total?.tax ?? 0,
      discount_amount: item.grand_total?.discount_amount ?? 0,
      additional_discount_amount:
        item.grand_total?.additional_discount_amount ?? 0,
      additional_discount_percent:
        item.grand_total?.additional_discount_percent ?? 0,
      total: item.grand_total?.total ?? 0,
      due: item.grand_total?.due ?? 0,
      shipping_cost: item.grand_total?.shipping_cost ?? 0,
      witholding: item.grand_total?.witholding ?? null,
      return: item.grand_total?.return ?? 0,
      paid: item.grand_total?.paid ?? 0,
    },
  }))
  console.log(JSON.stringify(data, null, 2))

  return {
    data,
    total: response.data.data.total,
  }
}

// Fetching all pages
const fetchAllBarters = async (): Promise<TransaksiBarangTerjual['data']> => {
  const perPage = 200
  let allBarters: TransaksiBarangTerjual['data'] = []
  let page = 1

  const firstPageResult = await fetchBartersByPage(page, perPage)
  allBarters = firstPageResult.data

  const totalBarters = firstPageResult.total
  const totalPages = Math.ceil(totalBarters / perPage)

  // Fetch remaining pages
  for (page = 2; page <= totalPages; page++) {
    const nextPageResult = await fetchBartersByPage(page, perPage)
    allBarters = allBarters.concat(nextPageResult.data)
  }

  return allBarters
}

barangTerjualRouter.get(
  '/barters',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allBarteres = await fetchAllBarters()

      res.json({
        success: true,
        data: allBarteres,
        meta: {
          total: allBarteres.length,
        },
      })
    } catch (error) {
      console.error('Error fetching all barters:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
)
barangTerjualRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const posData = req.body

    // Ensure that _id is removed from the data
    if ('_id' in posData) {
      console.log('Found _id in request body, deleting it...')
      delete posData._id
    }

    // Double-check that _id is removed
    console.log('Final data before saving:', posData)

    try {
      const justPos = await TransactionModel.create(posData)
      res.status(201).json(justPos)
    } catch (error) {
      console.error('Error creating transaction:', error)
      res.status(400).json({ message: 'Error creating transaction', error })
    }
  })
)

export default barangTerjualRouter
