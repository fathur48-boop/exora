import { useState } from 'react'
import { Plus }     from 'lucide-react'
import Topbar             from '../../../shared/components/ui/Topbar.jsx'
import Button             from '../../../shared/components/ui/Button.jsx'
import Alert              from '../../../shared/components/ui/Alert.jsx'
import InventoryStatCards from '../components/shared/InventoryStatCards.jsx'
import ProductTable       from '../components/products/ProductTable.jsx'
import ProductForm        from '../components/products/ProductForm.jsx'
import StockAdjustModal   from '../components/stock/StockAdjustModal.jsx'
import DeleteConfirmModal from '../../crm/components/shared/DeleteConfirmModal.jsx'
import CrmSearchBar       from '../../crm/components/shared/CrmSearchBar.jsx'
import ExportImportBar    from '../../../shared/components/ui/ExportImportBar.jsx'
import { useProducts }    from '../hooks/useProducts.js'

const PRODUCT_COLUMNS = [
  { key:'name', label:'Nama' },
  { key:'sku', label:'SKU' },
  { key:'category', label:'Kategori' },
  { key:'description', label:'Deskripsi' },
  { key:'price', label:'Harga Jual' },
  { key:'cost', label:'Harga Modal' },
  { key:'unit', label:'Satuan' },
]
import { stockIn,stockOut,adjustStock } from '../services/inventoryService.js'
import { filterProducts,STOCK_STATUS_CONFIG } from '../utils/inventoryHelpers.js'
import { useToast } from '../../../shared/hooks/useToast.js'

const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
const modal = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
const modalBox = "bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"

export default function InventoryPage() {
  const { inventory,isLoading,saving,error,load,create,update,remove,importRows } = useProducts()
  const toast = useToast()
  const [search,setSearch]           = useState('')
  const [statusFilter,setFilter]     = useState('')
  const [showForm,setShowForm]       = useState(false)
  const [editTarget,setEditTarget]   = useState(null)
  const [deleteTarget,setDelete]     = useState(null)
  const [adjustTarget,setAdjust]     = useState(null)
  const [adjustSaving,setAdjSaving]  = useState(false)
  const filtered = filterProducts(inventory,search,statusFilter)

  const handleAdjust = async({mode,quantity,notes,reference})=>{
    setAdjSaving(true)
    try {
      const pid = adjustTarget.product_id
      if(mode==='in')       await stockIn({product_id:pid,quantity,notes,reference})
      else if(mode==='out') await stockOut({product_id:pid,quantity,notes,reference})
      else                  await adjustStock({product_id:pid,quantity,notes})
      await load(); setAdjust(null); toast.success('Stok berhasil diperbarui')
    } catch(e){ toast.error(e.message) } finally{ setAdjSaving(false) }
  }

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Inventory" subtitle={`${inventory.length} produk`} onRefresh={load} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-5">
        {error && <Alert type="error" message={error}/>}
        <InventoryStatCards inventory={inventory} isLoading={isLoading}/>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <CrmSearchBar value={search} onChange={setSearch} placeholder="Cari produk, SKU…" className="w-72"/>
            <select value={statusFilter} onChange={e=>setFilter(e.target.value)} className={sel}>
              <option value="">Semua status</option>
              {Object.entries(STOCK_STATUS_CONFIG).map(([k,c])=><option key={k} value={k}>{c.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <ExportImportBar data={filtered} columns={PRODUCT_COLUMNS} filename="products" onImport={importRows}/>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setShowForm(true)}>Tambah produk</Button>
          </div>
        </div>
        <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden">
          <ProductTable inventory={filtered} isLoading={isLoading} onEdit={setEditTarget} onDelete={setDelete} onAdjust={setAdjust}/>
        </div>
      </div>

      {showForm && <div className={modal}><div className={modalBox}><h2 className="text-sm font-bold text-ink mb-5">Tambah Produk</h2>
        <ProductForm onSubmit={async d=>{await create(d);setShowForm(false)}} onCancel={()=>setShowForm(false)} saving={saving}/></div></div>}

      {editTarget && <div className={modal}><div className={modalBox}><h2 className="text-sm font-bold text-ink mb-5">Edit Produk</h2>
        <ProductForm initial={{...editTarget,name:editTarget.product_name,sku:editTarget.product_sku,category:editTarget.product_category,price:editTarget.product_price,cost:editTarget.product_cost,unit:editTarget.product_unit,is_active:editTarget.product_active}}
          onSubmit={async d=>{await update(editTarget.product_id,d);setEditTarget(null)}} onCancel={()=>setEditTarget(null)} saving={saving}/></div></div>}

      {adjustTarget && <StockAdjustModal productName={adjustTarget.product_name} currentStock={adjustTarget.quantity} unit={adjustTarget.product_unit}
        onConfirm={handleAdjust} onCancel={()=>setAdjust(null)} saving={adjustSaving}/>}

      {deleteTarget && <DeleteConfirmModal title="Hapus produk" description={`"${deleteTarget.product_name}" akan dihapus permanen.`}
        onConfirm={async()=>{await remove(deleteTarget.product_id);setDelete(null)}} onCancel={()=>setDelete(null)} isLoading={saving}/>}
    </div>
  )
}
