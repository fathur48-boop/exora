import { ShoppingCart, User, ChevronDown, ChevronUp, Pause } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../../../shared/utils/cn.js'
import Button from '../../../../shared/components/ui/Button.jsx'
import CartItem from './CartItem.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { calcCartSubtotal, calcCartTotal, calcChange } from '../../utils/posHelpers.js'

export default function CartPanel({ cart, customers, onCheckout, onHold }) {
  const [showCustomer, setShowCustomer] = useState(false)
  const subtotal = calcCartSubtotal(cart.items)
  const total    = calcCartTotal(cart.items, cart.cartDiscount, cart.cartDiscountType)
  const change   = calcChange(total, cart.amountPaid)
  const discountAmt = subtotal - total + (cart.cartDiscountType==='percent' ? subtotal*(cart.cartDiscount/100) : cart.cartDiscount)
  const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all w-full"

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-brand-600"/>
          <span className="text-sm font-bold text-ink">Cart</span>
          {cart.items.length>0 && <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-2xs font-bold flex items-center justify-center">{cart.items.length}</span>}
        </div>
        <div className="flex gap-1.5">
          {cart.items.length>0 && <Button variant="ghost" size="sm" onClick={onHold} leftIcon={<Pause className="w-3.5 h-3.5"/>}>Hold</Button>}
          {cart.heldCarts?.length>0 && <span className="text-2xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{cart.heldCarts.length} held</span>}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {!cart.items.length ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingCart className="w-8 h-8 text-ink-faint mb-2"/>
            <p className="text-xs text-ink-muted">Cart kosong</p>
            <p className="text-2xs text-ink-faint">Pilih produk untuk menambahkan</p>
          </div>
        ) : (
          <div>
            {cart.items.map(item=>(
              <CartItem key={item.product_id} item={item}
                onUpdateQty={cart.updateQty}
                onUpdateDiscount={cart.updateItemDiscount}
                onRemove={cart.removeItem}/>
            ))}
          </div>
        )}
      </div>

      {cart.items.length>0 && (
        <div className="border-t border-surface-border p-3 flex flex-col gap-2">
          {/* Customer */}
          <button onClick={()=>setShowCustomer(v=>!v)} className="flex items-center justify-between text-xs text-ink-muted hover:text-brand-600 transition-colors">
            <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5"/>{cart.customerName||'Pilih pelanggan (opsional)'}</div>
            {showCustomer?<ChevronUp className="w-3 h-3"/>:<ChevronDown className="w-3 h-3"/>}
          </button>
          {showCustomer && (
            <select value={cart.customerId||''} onChange={e=>{const c=customers.find(x=>x.id===e.target.value);cart.setCustomer(c?.id||null,c?.name||'')}} className={sel}>
              <option value="">-- Tanpa pelanggan --</option>
              {customers.map(c=><option key={c.id} value={c.id}>{c.name}{c.company?` (${c.company})`:''}</option>)}
            </select>
          )}

          {/* Cart discount */}
          <div className="flex gap-2">
            <select value={cart.cartDiscountType} onChange={e=>cart.setCartDiscount(cart.cartDiscount, e.target.value)} className="h-9 px-2 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none w-16">
              <option value="nominal">Rp</option>
              <option value="percent">%</option>
            </select>
            <input type="number" value={cart.cartDiscount||''} min={0}
              onChange={e=>cart.setCartDiscount(e.target.value, cart.cartDiscountType)}
              placeholder="Diskon total"
              className="flex-1 h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"/>
          </div>

          {/* Summary */}
          <div className="bg-surface-muted rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs"><span className="text-ink-muted">Subtotal</span><span className="font-medium text-ink">{formatCurrency(subtotal)}</span></div>
            {discountAmt>0 && <div className="flex justify-between text-xs"><span className="text-amber-600">Diskon</span><span className="font-medium text-amber-600">-{formatCurrency(discountAmt)}</span></div>}
            <div className="flex justify-between text-sm font-bold border-t border-surface-border pt-1.5 mt-0.5"><span className="text-ink">TOTAL</span><span className="text-brand-600">{formatCurrency(total)}</span></div>
          </div>

          {/* Payment method */}
          <div className="grid grid-cols-4 gap-1">
            {[['cash','Tunai'],['transfer','TF'],['card','Kartu'],['qris','QRIS']].map(([m,l])=>(
              <button key={m} onClick={()=>cart.setPaymentMethod(m)} className={cn('py-2 rounded-lg text-2xs font-bold transition-all',cart.paymentMethod===m?'bg-brand-600 text-white shadow-sm':'bg-surface-muted text-ink-muted hover:bg-surface-subtle')}>{l}</button>
            ))}
          </div>

          {/* Cash input */}
          {cart.paymentMethod==='cash' && (
            <div>
              <input type="number" value={cart.amountPaid||''} onChange={e=>cart.setAmountPaid(e.target.value)}
                placeholder="Jumlah dibayar"
                className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"/>
              {cart.amountPaid>0 && <div className={cn('flex justify-between text-xs mt-1',change>=0?'text-green-600':'text-red-500')}>
                <span>Kembalian</span><span className="font-bold">{change>=0?formatCurrency(change):'Kurang '+formatCurrency(Math.abs(change))}</span>
              </div>}
              {/* Quick cash buttons */}
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {[total, Math.ceil(total/10000)*10000, Math.ceil(total/50000)*50000, Math.ceil(total/100000)*100000].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4).map(v=>(
                  <button key={v} onClick={()=>cart.setAmountPaid(v)} className="px-2 py-1 rounded bg-surface-muted text-2xs font-semibold text-ink-muted hover:bg-surface-subtle transition-all">{formatCurrency(v)}</button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <textarea value={cart.notes} onChange={e=>cart.setNotes(e.target.value)} rows={1} placeholder="Catatan (opsional)..."
            className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-xs resize-none focus:outline-none focus:ring-1 focus:ring-brand-500/30 placeholder:text-ink-faint"/>

          {/* Checkout button */}
          <Button onClick={onCheckout} className="w-full" size="sm"
            disabled={cart.paymentMethod==='cash' && cart.amountPaid < total}>
            Bayar {formatCurrency(total)}
          </Button>
        </div>
      )}
    </div>
  )
}
