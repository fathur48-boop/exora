import { useCallback, useEffect, useState } from 'react'
import { useCartStore, useShiftStore, usePosSettingsStore } from '../store/posStore.js'
import { fetchProducts } from '../../inventory/services/productService.js'
import { fetchInventory } from '../../inventory/services/inventoryService.js'
import { fetchCustomers } from '../../crm/services/customerService.js'
import { processCheckout, updateLoyaltyPoints } from '../services/posService.js'
import { calcCartTotal, calcChange, calcLoyaltyPoints, generateReceiptNo } from '../utils/posHelpers.js'
import { useToast } from '../../../shared/hooks/useToast.js'
import { useAuthStore } from '../../auth/store/authStore.js'

export function usePos() {
  const cart     = useCartStore()
  const shift    = useShiftStore()
  const settings = usePosSettingsStore()
  const toast    = useToast()
  const user     = useAuthStore(s => s.user)

  const [products,  setProducts]  = useState([])
  const [inventory, setInventory] = useState([])
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [lastReceipt, setLastReceipt] = useState(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [p, inv, c] = await Promise.all([fetchProducts(), fetchInventory(), fetchCustomers()])
      setProducts(p || [])
      setInventory(inv || [])
      setCustomers(c || [])
    } catch (e) {
      toast.error('Gagal memuat data: ' + e.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [])

  const checkout = async (pointsRedeemed = 0) => {
    if (!cart.items.length) { toast.error('Cart kosong'); return null }
    if (!shift.activeShift) { toast.error('Buka shift kasir terlebih dahulu'); return null }

    const total    = calcCartTotal(cart.items, cart.cartDiscount, cart.cartDiscountType)
    const change   = calcChange(total, cart.amountPaid)
    const points   = calcLoyaltyPoints(total, settings.pointsRate)
    const receiptNo = generateReceiptNo()

    if (cart.paymentMethod === 'cash' && cart.amountPaid < total) {
      toast.error('Jumlah bayar kurang dari total')
      return null
    }

    setProcessing(true)
    try {
      const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0)
      const discount = subtotal - total + (cart.cartDiscountType === 'percent' ? subtotal * (cart.cartDiscount / 100) : cart.cartDiscount)

      const sale = await processCheckout({
        receiptNo, items: cart.items, subtotal, discount, total,
        paymentMethod: cart.paymentMethod, amountPaid: cart.amountPaid, change,
        customerId: cart.customerId, customerName: cart.customerName,
        notes: cart.notes, cashierId: user?.id, cashierName: user?.full_name,
        shiftId: shift.activeShift?.id, pointsEarned: points, pointsRedeemed,
      })

      // Update loyalty
      if (cart.customerId) {
        await updateLoyaltyPoints(cart.customerId, points, pointsRedeemed).catch(() => {})
      }

      // Update shift
      shift.updateShiftSales(total)

      // Refresh inventory
      fetchInventory().then(setInventory).catch(() => {})

      const receipt = {
        ...sale, receiptNo, items: cart.items, subtotal, discount, total,
        paymentMethod: cart.paymentMethod, amountPaid: cart.amountPaid, change,
        customerName: cart.customerName, cashierName: user?.full_name,
        pointsEarned: points, date: new Date().toISOString(),
        header: settings.receiptHeader, footer: settings.receiptFooter,
      }
      setLastReceipt(receipt)
      cart.clearCart()
      toast.success(`Transaksi ${receiptNo} berhasil!`)
      return receipt
    } catch (e) {
      toast.error('Checkout gagal: ' + e.message)
      return null
    } finally {
      setProcessing(false)
    }
  }

  return { cart, shift, settings, products, inventory, customers, isLoading, processing, lastReceipt, setLastReceipt, checkout, reloadData: loadData, user }
}
