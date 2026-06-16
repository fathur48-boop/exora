import { useState }               from 'react'
import { useParams,useNavigate }  from 'react-router-dom'
import { ArrowLeft,Edit2,ArrowUpDown } from 'lucide-react'
import Topbar           from '../../../shared/components/ui/Topbar.jsx'
import Button           from '../../../shared/components/ui/Button.jsx'
import Spinner          from '../../../shared/components/ui/Spinner.jsx'
import Card, { CardBody,CardHeader } from '../../../shared/components/ui/Card.jsx'
import StockBadge       from '../components/stock/StockBadge.jsx'
import StockAdjustModal from '../components/stock/StockAdjustModal.jsx'
import ProductForm      from '../components/products/ProductForm.jsx'
import MovementTable    from '../components/stock/MovementTable.jsx'
import { useProductDetail }  from '../hooks/useProductDetail.js'
import { useStockMovements } from '../hooks/useStockMovements.js'
import { updateProduct }     from '../services/productService.js'
import { formatCurrency }    from '../../dashboard/utils/dashboardHelpers.js'
import { formatUnit }        from '../utils/inventoryHelpers.js'
import { useToast }          from '../../../shared/hooks/useToast.js'

export default function ProductDetailPage() {
  const { id } = useParams(); const navigate = useNavigate(); const toast = useToast()
  const { product,isLoading,saving,reload,doStockIn,doStockOut,doAdjust } = useProductDetail(id)
  const { movements,isLoading:movLoading,reload:reloadMov } = useStockMovements(id)
  const [editing,setEditing]   = useState(false)
  const [showAdj,setShowAdj]   = useState(false)
  const [savingEdit,setSavEdit] = useState(false)
  if(isLoading)return <div className="flex items-center justify-center min-h-full"><Spinner size="lg" className="text-brand-400"/></div>
  if(!product)return null
  const handleUpdate = async(data)=>{setSavEdit(true);try{await updateProduct(id,data);await reload();setEditing(false);toast.success('Produk diperbarui')}catch(e){toast.error(e.message)}finally{setSavEdit(false)}}
  const handleAdjust = async({mode,quantity,notes,reference})=>{
    if(mode==='in')await doStockIn({quantity,notes,reference})
    else if(mode==='out')await doStockOut({quantity,notes,reference})
    else await doAdjust({quantity,notes})
    await reloadMov(); setShowAdj(false)
  }
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title={product.name} subtitle="Detail produk"/>
      <div className="flex-1 p-6 flex flex-col gap-6 max-w-5xl">
        <button onClick={()=>navigate('/inventory')} className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-600 transition-colors w-fit font-medium">
          <ArrowLeft className="w-3.5 h-3.5"/> Kembali ke Inventory
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <div><p className="text-sm font-bold text-ink">{product.name}</p><p className="text-xs font-mono text-ink-muted">{product.sku}</p></div>
                <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5"/>} onClick={()=>setEditing(true)}>Edit</Button>
              </CardHeader>
              <CardBody>
                {editing ? <ProductForm initial={product} onSubmit={handleUpdate} onCancel={()=>setEditing(false)} saving={savingEdit}/>
                : <div className="grid grid-cols-2 gap-4">
                    {[['Kategori',product.category||'—'],['Satuan',product.unit||'—'],['Harga Jual',formatCurrency(product.price)],['Harga Modal',formatCurrency(product.cost)]].map(([l,v])=>(
                      <div key={l}><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">{l}</p><p className="text-sm font-semibold text-ink">{v}</p></div>
                    ))}
                  </div>}
              </CardBody>
            </Card>
            <Card>
              <CardHeader><p className="text-xs font-bold text-ink uppercase tracking-wide">Riwayat Pergerakan Stok</p></CardHeader>
              <CardBody className="p-0"><MovementTable movements={movements} isLoading={movLoading}/></CardBody>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader><p className="text-xs font-bold text-ink uppercase tracking-wide">Stok</p></CardHeader>
              <CardBody className="flex flex-col gap-4">
                <div className="text-center py-4">
                  <p className="text-5xl font-extrabold text-ink tracking-tight">{Number(product.quantity||0).toLocaleString('id-ID')}</p>
                  <p className="text-sm text-ink-muted mt-1 font-medium">{product.unit||'pcs'}</p>
                  <div className="mt-3 flex justify-center"><StockBadge quantity={product.quantity} minStock={product.min_stock}/></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-surface-subtle rounded-xl p-3"><p className="text-ink-faint font-medium">Min. Stok</p><p className="font-bold text-ink mt-0.5">{formatUnit(product.min_stock||0,product.unit)}</p></div>
                  <div className="bg-surface-subtle rounded-xl p-3"><p className="text-ink-faint font-medium">Lokasi</p><p className="font-bold text-ink mt-0.5">{product.location||'—'}</p></div>
                </div>
                <Button variant="primary" size="sm" leftIcon={<ArrowUpDown className="w-4 h-4"/>} className="w-full" onClick={()=>setShowAdj(true)}>Kelola Stok</Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      {showAdj && <StockAdjustModal productName={product.name} currentStock={product.quantity||0} unit={product.unit} onConfirm={handleAdjust} onCancel={()=>setShowAdj(false)} saving={saving}/>}
    </div>
  )
}
