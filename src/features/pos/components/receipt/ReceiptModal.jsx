import { useRef } from 'react'
import { Printer, X, MessageCircle, Download } from 'lucide-react'
import Button from '../../../../shared/components/ui/Button.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { formatReceiptDate, calcItemTotal } from '../../utils/posHelpers.js'
import { PAYMENT_METHOD_LABELS } from '../../utils/posHelpers.js'

export default function ReceiptModal({ receipt, onClose, onNewTransaction }) {
  const printRef = useRef(null)
  if (!receipt) return null

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank', 'width=350,height=600')
    win.document.write(`<html><head><title>Struk ${receipt.receiptNo}</title><style>
      body{font-family:monospace;font-size:11px;padding:8px;max-width:300px;margin:0 auto}
      h2{text-align:center;font-size:13px;margin:4px 0}
      .center{text-align:center} .line{border-top:1px dashed #000;margin:4px 0}
      .row{display:flex;justify-content:space-between;margin:2px 0}
      .bold{font-weight:bold} .total{font-size:13px;font-weight:bold}
    </style></head><body>${content}</body></html>`)
    win.document.close()
    win.print()
    win.close()
  }

  const handleWhatsApp = () => {
    const lines = [
      `*${receipt.header || 'EXORA Business'}*`,
      `Struk: ${receipt.receiptNo}`,
      `Tanggal: ${formatReceiptDate(receipt.date)}`,
      `Kasir: ${receipt.cashierName || '-'}`,
      receipt.customerName ? `Pelanggan: ${receipt.customerName}` : '',
      `---`,
      ...receipt.items.map(i => `${i.name} x${i.qty} = ${formatCurrency(calcItemTotal(i))}`),
      `---`,
      `Total: *${formatCurrency(receipt.total)}*`,
      `Bayar: ${formatCurrency(receipt.amountPaid)}`,
      receipt.change > 0 ? `Kembalian: ${formatCurrency(receipt.change)}` : '',
      receipt.pointsEarned > 0 ? `Poin earned: +${receipt.pointsEarned}` : '',
      `---`,
      receipt.footer || 'Terima kasih!',
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/?text=${encodeURIComponent(lines)}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-xs p-5 animate-slide-up flex flex-col gap-3 max-h-[90vh] overflow-y-auto">

        {/* Receipt content */}
        <div ref={printRef} className="font-mono text-xs bg-white">
          <div className="text-center mb-3">
            <p className="font-bold text-sm">{receipt.header || 'EXORA Business'}</p>
            <div className="border-t border-dashed border-gray-300 mt-2 pt-2">
              <p>No: {receipt.receiptNo}</p>
              <p>{formatReceiptDate(receipt.date)}</p>
              <p>Kasir: {receipt.cashierName || '-'}</p>
              {receipt.customerName && <p>Pelanggan: {receipt.customerName}</p>}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 py-2">
            {receipt.items.map((item, i) => (
              <div key={i} className="mb-1.5">
                <p className="font-semibold">{item.name}</p>
                <div className="flex justify-between text-ink-muted">
                  <span>{item.qty} x {formatCurrency(item.price)}</span>
                  <span>{formatCurrency(calcItemTotal(item))}</span>
                </div>
                {item.discount_value > 0 && (
                  <p className="text-amber-600 text-2xs">Diskon: -{item.discount_type==='percent'?item.discount_value+'%':formatCurrency(item.discount_value)}</p>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-300 pt-2 flex flex-col gap-1">
            {receipt.discount > 0 && (
              <div className="flex justify-between text-amber-600"><span>Diskon Total</span><span>-{formatCurrency(receipt.discount)}</span></div>
            )}
            <div className="flex justify-between font-bold text-sm border-t border-gray-300 pt-1">
              <span>TOTAL</span><span>{formatCurrency(receipt.total)}</span>
            </div>
            <div className="flex justify-between"><span>Bayar ({PAYMENT_METHOD_LABELS[receipt.paymentMethod]})</span><span>{formatCurrency(receipt.amountPaid)}</span></div>
            {receipt.change > 0 && <div className="flex justify-between"><span>Kembalian</span><span>{formatCurrency(receipt.change)}</span></div>}
            {receipt.pointsEarned > 0 && <div className="flex justify-between text-green-600"><span>Poin Earned</span><span>+{receipt.pointsEarned} poin</span></div>}
          </div>

          <div className="border-t border-dashed border-gray-300 mt-2 pt-2 text-center">
            <p>{receipt.footer || 'Terima kasih!'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 border-t border-surface-border pt-3">
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" leftIcon={<Printer className="w-3.5 h-3.5"/>} onClick={handlePrint}>Print</Button>
            <Button variant="secondary" size="sm" className="flex-1" leftIcon={<MessageCircle className="w-3.5 h-3.5"/>} onClick={handleWhatsApp}>WA</Button>
          </div>
          <Button size="sm" className="w-full" onClick={onNewTransaction}>Transaksi Baru</Button>
          <button onClick={onClose} className="text-xs text-ink-muted hover:text-ink transition-colors text-center">Tutup</button>
        </div>
      </div>
    </div>
  )
}
