import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      cartDiscount: 0,
      cartDiscountType: 'nominal',
      paymentMethod: 'cash',
      amountPaid: 0,
      customerId: null,
      customerName: '',
      notes: '',
      heldCarts: [],

      addItem: (product, inventory) => {
        const qty = parseFloat(inventory?.quantity) || 0
        const existing = get().items.find(i => i.product_id === product.id)
        if (existing) {
          if (existing.qty >= qty) return false // out of stock
          set({ items: get().items.map(i => i.product_id === product.id ? { ...i, qty: i.qty + 1 } : i) })
        } else {
          if (qty <= 0) return false
          set({
            items: [...get().items, {
              product_id: product.id,
              name: product.name,
              sku: product.sku || '',
              price: parseFloat(product.price) || 0,
              unit: product.unit || 'pcs',
              qty: 1,
              max_qty: qty,
              discount_type: 'nominal',
              discount_value: 0,
            }]
          })
        }
        return true
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter(i => i.product_id !== productId) })
        } else {
          set({ items: get().items.map(i => i.product_id === productId ? { ...i, qty: Math.min(qty, i.max_qty) } : i) })
        }
      },

      updateItemDiscount: (productId, type, value) => {
        set({ items: get().items.map(i => i.product_id === productId ? { ...i, discount_type: type, discount_value: parseFloat(value) || 0 } : i) })
      },

      removeItem: (productId) => set({ items: get().items.filter(i => i.product_id !== productId) }),

      setCartDiscount: (value, type) => set({ cartDiscount: parseFloat(value) || 0, cartDiscountType: type || get().cartDiscountType }),
      setPaymentMethod: (m) => set({ paymentMethod: m }),
      setAmountPaid: (v) => set({ amountPaid: parseFloat(v) || 0 }),
      setCustomer: (id, name) => set({ customerId: id, customerName: name }),
      setNotes: (v) => set({ notes: v }),

      clearCart: () => set({ items: [], cartDiscount: 0, cartDiscountType: 'nominal', paymentMethod: 'cash', amountPaid: 0, customerId: null, customerName: '', notes: '' }),

      holdCart: (label) => {
        const current = { items: get().items, cartDiscount: get().cartDiscount, cartDiscountType: get().cartDiscountType, customerId: get().customerId, customerName: get().customerName, notes: get().notes, label: label || `Hold ${get().heldCarts.length + 1}`, heldAt: new Date().toISOString() }
        set({ heldCarts: [...get().heldCarts, current] })
        get().clearCart()
      },

      resumeCart: (index) => {
        const held = get().heldCarts[index]
        if (!held) return
        set({ items: held.items, cartDiscount: held.cartDiscount, cartDiscountType: held.cartDiscountType, customerId: held.customerId, customerName: held.customerName, notes: held.notes, heldCarts: get().heldCarts.filter((_, i) => i !== index) })
      },

      removeHeldCart: (index) => set({ heldCarts: get().heldCarts.filter((_, i) => i !== index) }),
    }),
    { name: 'exora_pos_cart', storage: createJSONStorage(() => localStorage) }
  )
)

export const useShiftStore = create(
  persist(
    (set, get) => ({
      activeShift: null,
      shiftHistory: [],

      openShift: (cashierId, cashierName, openingCash) => {
        const shift = { id: `SHIFT-${Date.now()}`, cashier_id: cashierId, cashier_name: cashierName, opening_cash: parseFloat(openingCash) || 0, opened_at: new Date().toISOString(), closed_at: null, closing_cash: null, total_sales: 0, total_transactions: 0, notes: '' }
        set({ activeShift: shift })
        return shift
      },

      updateShiftSales: (amount) => {
        const s = get().activeShift
        if (!s) return
        set({ activeShift: { ...s, total_sales: s.total_sales + amount, total_transactions: s.total_transactions + 1 } })
      },

      closeShift: (closingCash, notes) => {
        const s = get().activeShift
        if (!s) return null
        const closed = { ...s, closed_at: new Date().toISOString(), closing_cash: parseFloat(closingCash) || 0, notes: notes || '' }
        set({ activeShift: null, shiftHistory: [closed, ...get().shiftHistory].slice(0, 50) })
        return closed
      },
    }),
    { name: 'exora_pos_shift', storage: createJSONStorage(() => localStorage) }
  )
)

export const usePosSettingsStore = create(
  persist(
    (set) => ({
      pointsRate: 10000,
      pointsValue: 100,
      taxRate: 0,
      receiptHeader: 'EXORA Business',
      receiptFooter: 'Terima kasih atas kunjungan Anda!',
      printReceipt: true,
      setPointsRate: (v) => set({ pointsRate: parseFloat(v) || 10000 }),
      setPointsValue: (v) => set({ pointsValue: parseFloat(v) || 100 }),
      setTaxRate: (v) => set({ taxRate: parseFloat(v) || 0 }),
      setReceiptHeader: (v) => set({ receiptHeader: v }),
      setReceiptFooter: (v) => set({ receiptFooter: v }),
      setPrintReceipt: (v) => set({ printReceipt: v }),
    }),
    { name: 'exora_pos_settings', storage: createJSONStorage(() => localStorage) }
  )
)
