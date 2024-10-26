import React from 'react'
import { Button, DatePicker, message } from 'antd'
import { useIdInvoice } from './PolosanPage'

import { useAddTransactionPolosanMutation } from '../hooks/transaksiPolosanHooks'
import { useAddTransactionMutation } from '../hooks/transactionHooks'

const Polosan = () => {
  const { loading, allInvoices } = useIdInvoice()

  const addPosMutation = useAddTransactionPolosanMutation()
  const { RangePicker } = DatePicker

  const handleSaveInvoices = async () => {
    if (!allInvoices || allInvoices.length === 0) {
      message.error('No invoices to save.')
      return
    }

    try {
      const chunkSize = 1000
      const chunks = Math.ceil(allInvoices.length / chunkSize)

      for (let i = 0; i < chunks; i++) {
        const chunk = allInvoices.slice(i * chunkSize, (i + 1) * chunkSize)
        const formattedInvoices = chunk.map((invoice) => ({
          id: invoice.id,
          trans_date: invoice.trans_date,
          due_date: invoice.due_date,
          status_id: invoice.status_id,
          contact_id: invoice.contact_id,
          due: invoice.due,
          amount_after_tax: invoice.amount_after_tax,
          memo: invoice.memo || 'memo',
          ref_number: invoice.ref_number,
          amount: invoice.amount,
          paid_date: invoice.paid_date || 'paid_date',
          additional_discount_amount: invoice.additional_discount_amount,
          term_id: invoice.term_id || 0,
          attachment: invoice.attachment,
          sales_id: invoice.sales_id || null,
          warehouse_id: invoice.warehouse_id,
          currency_rate: invoice.currency_rate,
          currency_id: invoice.currency_id,
          shipping_cost: invoice.shipping_cost,
          shipping_date: invoice.shipping_date || null,
          contact: {
            id: invoice.contact.id,
            name: invoice.contact.name,
            email: invoice.contact.email || null,
            phone: invoice.contact.phone || null,
            company: invoice.contact.company || null,
            address: invoice.contact.address || 'ALAMAT',
            country_id: invoice.contact.country_id || 0,
            province_id: invoice.contact.province_id || null,
            city_id: invoice.contact.city_id || null,
            district_id: invoice.contact.district_id || null,
            village_id: invoice.contact.village_id || null,
            group_id: invoice.contact.group_id,
            salutation_id: invoice.contact.salutation_id || null,
            type_ids: invoice.contact.type_ids,
            edit_address: invoice.contact.edit_address || null,
            finance_contact_emails: invoice.contact.finance_contact_emails,
          },
          products: invoice.products.map((product) => ({
            name: product.name,
            qty: product.qty,
            unit: product.unit,
          })),
          termin: {
            id: invoice.termin.id || 0,
            name: invoice.termin.name || 'nama termin',
            days: invoice.termin.days || 0,
          },
          sales_person: invoice.sales_person || null,
          attachment_exists: invoice.attachment_exists,
          tags: invoice.tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          })),
          print_status: invoice.print_status,
          order_number: invoice.order_number || null,
          due_days: invoice.due_days,
          qty: invoice.qty,
          warehouse: {
            id: invoice.warehouse.id,
            name: invoice.warehouse.name,
            code: invoice.warehouse.code,
            desc: invoice.warehouse.desc || null,
          },
          witholding_account_id: invoice.witholding_account_id || 0,
          witholding_amount: invoice.witholding_amount || 0,
          witholding_percent: invoice.witholding_percent || 0,
          include_tax: invoice.include_tax || 0,
          reason_id: invoice.reason_id || 0,
          down_payment: invoice.down_payment || 0,
          items: invoice.items.map((item) => ({
            id: item.id,
            tran_id: item.tran_id,
            finance_account_id: item.finance_account_id,
            trans_type_id: item.trans_type_id,
            tax_id: item.tax_id || null,
            desc: item.desc || null,
            qty: item.qty,
            price: item.price,
            price_after_tax: item.price_after_tax,
            amount: item.amount,
            amount_after_tax: item.amount_after_tax,
            discount_percent: item.discount_percent,
            discount_amount: item.discount_amount,
            additional_discount_amount: item.additional_discount_amount,
            taxable: item.taxable,
            tax: item.tax,
            subtotal: item.subtotal,
            unit_id: item.unit_id,
            unit_conv: item.unit_conv,
            discount_amount_input: item.discount_amount_input || null,
            amount_after_tax_ori: item.amount_after_tax_ori || null,
            amount_ori: item.amount_ori || null,
            currency_id: item.currency_id,
            currency_rate: item.currency_rate,
            local_id: item.local_id || null,
          })),
        }))

        await addPosMutation.mutateAsync(formattedInvoices as any)
      }
      message.success('Invoices saved successfully!')
    } catch (error) {
      message.error('Failed to save invoices.')
      console.error('Error saving invoices:', error)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Daftar Invoice</h2>
      <RangePicker format="YYYY-MM-DD" style={{ marginBottom: '20px' }} />
      <Button
        type="primary"
        onClick={handleSaveInvoices}
        disabled={loading || !allInvoices || allInvoices.length === 0}
        style={{ marginTop: '10px' }}
      >
        Save Invoices
      </Button>
    </div>
  )
}

export default Polosan
