import { useState } from 'react'
import { Clock, ChevronDown, RefreshCw, Package } from 'lucide-react'
import { cn } from '../../../shared/utils/cn.js'
import Button from '../../../shared/components/ui/Button.jsx'
import Topbar from '../../../shared/components/ui/Topbar.jsx'
import ProductGrid   from '../components/product/ProductGrid.jsx'
import CartPanel     from '../components/cart/CartPanel.jsx'
import ReceiptModal  from '../components/receipt/ReceiptModal.jsx'
import ShiftModal    from '../components/shift/ShiftModal.jsx'
import ShiftSummary  from '../components/shift/ShiftSummary.jsx'
import HeldCartsPanel from '../components/cart/HeldCartsPanel.jsx'
import { usePos }    from '../hooks/usePos.js'
import { formatCurrency } from '../../dashboard/utils/dashboardHelpers.js'

export default function PosPage() {
  const { cart, shift, products, inventory, customers, isLoading, processing, lastReceipt, setLastReceipt, checkout, reloadData, user } = usePos()

  const [showShiftModal,  setShowShiftModal]  = useState(!shift.activeShift)
  const [closedShift,     setClosedShift]     = useState(null)
  const [showHeldCarts,   setShowHeldCarts]   = useState(false)

  const handleOpenShift  = (id, name, cash) => { shift.openShift(id, name, cash); setShowShiftModal(false) }
  const handleCloseShift = (cash, notes) => { const s = shift.closeShift(cash, notes); setClosedShift(s); setShowShiftModal(false) }
  const handleCheckout   = async () => { await checkout(0) }
  const handleHold       = () => {
    const label = `Hold ${cart.heldCarts.length + 1}`
    cart.holdCart(label)
  }

  return (
    <div className="flex flex-col h-screen bg-surface-muted overflow-hidden">
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-surface-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <Package className="w-4 h-4 text-white"/>
            </div>
            <span className="text-sm font-bold text-ink">POS Kasir</span>
          </div>
          {shift.activeShift && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
              <span className="text-2xs font-semibold text-green-700">Shift Aktif</span>
              <span className="text-2xs text-green-600">• {shift.activeShift.cashier_name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {shift.activeShift && (
            <div className="text-right hidden sm:block">
              <p className="text-2xs text-ink-faint">Total Shift</p>
              <p className="text-xs font-bold text-green-600">{formatCurrency(shift.activeShift.total_sales)}</p>
            </div>
          )}
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5"/>} onClick={reloadData} disabled={isLoading}>Refresh</Button>
          {cart.heldCarts?.length > 0 && (
            <Button variant="secondary" size="sm" onClick={()=>setShowHeldCarts(true)}>
              {cart.heldCarts.length} Hold
            </Button>
          )}
          <Button variant={shift.activeShift ? 'secondary' : 'primary'} size="sm" leftIcon={<Clock className="w-3.5 h-3.5"/>} onClick={()=>setShowShiftModal(true)}>
            {shift.activeShift ? 'Tutup Shift' : 'Buka Shift'}
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Product grid */}
        <div className="flex-1 overflow-hidden">
          <ProductGrid
            products={products}
            inventory={inventory}
            isLoading={isLoading}
            onAddItem={(product) => {
              const inv = inventory.find(i => i.product_id === product.id)
              const ok = cart.addItem(product, inv)
              if (!ok) { /* toast handled in store */ }
            }}
          />
        </div>

        {/* Cart panel */}
        <div className="w-80 xl:w-96 border-l border-surface-border overflow-hidden flex flex-col bg-white shrink-0">
          <CartPanel
            cart={cart}
            customers={customers}
            onCheckout={handleCheckout}
            onHold={handleHold}
          />
          {processing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin"/>
                <p className="text-xs font-semibold text-ink">Memproses...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showShiftModal && <ShiftModal shift={shift} user={user} onOpen={handleOpenShift} onClose={handleCloseShift}/>}
      {closedShift   && <ShiftSummary shift={closedShift} onDismiss={()=>setClosedShift(null)}/>}
      {showHeldCarts && <HeldCartsPanel heldCarts={cart.heldCarts||[]} onResume={cart.resumeCart} onRemove={cart.removeHeldCart} onClose={()=>setShowHeldCarts(false)}/>}
      {lastReceipt   && <ReceiptModal receipt={lastReceipt} onClose={()=>setLastReceipt(null)} onNewTransaction={()=>setLastReceipt(null)}/>}
    </div>
  )
}
