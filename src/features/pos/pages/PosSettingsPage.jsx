import Topbar from '../../../shared/components/ui/Topbar.jsx'
import Button from '../../../shared/components/ui/Button.jsx'
import Input from '../../../shared/components/ui/Input.jsx'
import Card, { CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx'
import { usePosSettingsStore } from '../store/posStore.js'

export default function PosSettingsPage() {
  const s = usePosSettingsStore()
  const ipt = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all w-full"

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Pengaturan POS" subtitle="Konfigurasi kasir"/>
      <div className="flex-1 p-6 flex flex-col gap-5 max-w-2xl">

        <Card>
          <CardHeader><div><p className="text-sm font-bold text-ink">Struk</p><p className="text-2xs text-ink-faint mt-0.5">Header dan footer struk penjualan</p></div></CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Header Struk (Nama Toko)" value={s.receiptHeader} onChange={e=>s.setReceiptHeader(e.target.value)} placeholder="EXORA Business"/>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Footer Struk</label>
              <textarea value={s.receiptFooter} onChange={e=>s.setReceiptFooter(e.target.value)} rows={2} placeholder="Terima kasih atas kunjungan Anda!" className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"/>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="printReceipt" checked={s.printReceipt} onChange={e=>s.setPrintReceipt(e.target.checked)} className="w-4 h-4 rounded border-surface-border text-brand-600 focus:ring-brand-500"/>
              <label htmlFor="printReceipt" className="text-sm font-medium text-ink cursor-pointer">Auto-tampilkan struk setelah checkout</label>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><div><p className="text-sm font-bold text-ink">Loyalty Points</p><p className="text-2xs text-ink-faint mt-0.5">Sistem poin untuk pelanggan</p></div></CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-secondary tracking-wide">Poin per Rp (IDR)</label>
                <input type="number" value={s.pointsRate} onChange={e=>s.setPointsRate(e.target.value)} className={ipt} placeholder="10000"/>
                <p className="text-2xs text-ink-faint">Setiap Rp {Number(s.pointsRate).toLocaleString('id-ID')} = 1 poin</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-ink-secondary tracking-wide">Nilai per 100 Poin (IDR)</label>
                <input type="number" value={s.pointsValue} onChange={e=>s.setPointsValue(e.target.value)} className={ipt} placeholder="100"/>
                <p className="text-2xs text-ink-faint">100 poin = Rp {Number(s.pointsValue).toLocaleString('id-ID')} diskon</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><div><p className="text-sm font-bold text-ink">Pajak</p><p className="text-2xs text-ink-faint mt-0.5">Tarif pajak otomatis (opsional)</p></div></CardHeader>
          <CardBody>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-ink-secondary tracking-wide">Tarif Pajak (%)</label>
              <input type="number" value={s.taxRate} onChange={e=>s.setTaxRate(e.target.value)} className={ipt} placeholder="0" min="0" max="100"/>
              <p className="text-2xs text-ink-faint">Set 0 untuk menonaktifkan pajak</p>
            </div>
          </CardBody>
        </Card>

        <p className="text-2xs text-ink-faint text-center">Pengaturan POS disimpan otomatis di perangkat ini</p>
      </div>
    </div>
  )
}
