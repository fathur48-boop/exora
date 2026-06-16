export const ROLE_OPTIONS = [
  { value:'super_admin', label:'Super Admin' },
  { value:'owner',       label:'Owner'       },
  { value:'manager',     label:'Manager'     },
  { value:'staff',       label:'Staff'       },
]
export const ROLE_CONFIG = {
  super_admin:{label:'Super Admin', color:'bg-red-100 text-red-700'      },
  owner:      {label:'Owner',       color:'bg-purple-100 text-purple-700'},
  manager:    {label:'Manager',     color:'bg-blue-100 text-blue-700'    },
  staff:      {label:'Staff',       color:'bg-gray-100 text-gray-600'    },
}
export const DEFAULT_SETTINGS = {
  company_name:'', company_email:'', company_phone:'', company_address:'', company_website:'',
  currency:'IDR', timezone:'Asia/Jakarta', date_format:'DD/MM/YYYY', fiscal_year_start:'01',
}
export const CURRENCY_OPTIONS    = ['IDR','USD','EUR','SGD','MYR']
export const TIMEZONE_OPTIONS    = ['Asia/Jakarta','Asia/Makassar','Asia/Jayapura','Asia/Singapore','UTC']
export const DATE_FORMAT_OPTIONS = ['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD']
export const MONTH_OPTIONS = [
  {value:'01',label:'Januari'},{value:'02',label:'Februari'},{value:'03',label:'Maret'},{value:'04',label:'April'},
  {value:'05',label:'Mei'},{value:'06',label:'Juni'},{value:'07',label:'Juli'},{value:'08',label:'Agustus'},
  {value:'09',label:'September'},{value:'10',label:'Oktober'},{value:'11',label:'November'},{value:'12',label:'Desember'},
]
