import * as XLSX from 'xlsx'

/**
 * @param {Array<object>} rows  - raw data objects
 * @param {Array<{key:string, label:string}>} columns - field -> display column mapping
 * @param {string} filename - without extension
 */
export function exportRows(rows, columns, filename) {
  const mapped = rows.map((row) => {
    const obj = {}
    columns.forEach((c) => { obj[c.label] = row[c.key] ?? '' })
    return obj
  })
  const ws = XLSX.utils.json_to_sheet(mapped)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Downloads a header-only template file matching `columns`.
 */
export function downloadTemplate(columns, filename) {
  const header = {}
  columns.forEach((c) => { header[c.label] = '' })
  const ws = XLSX.utils.json_to_sheet([header])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template')
  XLSX.writeFile(wb, `${filename}-template.xlsx`)
}

/**
 * Parses an uploaded .xlsx/.xls/.csv file into an array of objects keyed by
 * `columns[].key`, matching against `columns[].label` headers in the file.
 */
export function parseImportFile(file, columns) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' })
        const rows = json.map((r) => {
          const obj = {}
          columns.forEach((c) => {
            const val = r[c.label] !== undefined ? r[c.label] : r[c.key]
            obj[c.key] = val !== undefined ? val : ''
          })
          return obj
        })
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.readAsBinaryString(file)
  })
}
