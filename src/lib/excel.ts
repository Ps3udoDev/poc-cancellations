import * as ExcelJS from "exceljs";

export interface ExportExcelOptions<T> {
  data: T[];
  filename?: string;
  sheetName?: string;
  /**
   * Column definitions. Si no se proveen, se generarán automáticamente
   * usando las claves del primer objeto del arreglo 'data'.
   */
  columns?: {
    header: string;
    key: keyof T;
    width?: number;
  }[];
}

/**
 * Utilería genérica para exportar un arreglo de objetos a un archivo Excel (.xlsx) altamente formateado.
 * 
 * @param options Opciones de exportación incluyendo los datos a generar, nombre del archivo, etc.
 */
export async function exportToExcel<T extends Record<string, any>>({
  data,
  filename = "Reporte.xlsx",
  sheetName = "Reporte",
  columns,
}: ExportExcelOptions<T>) {
  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar a Excel.");
    return;
  }

  // 1. Crear un nuevo libro de trabajo (Workbook) y su hoja (Worksheet)
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistema de Generación";
  workbook.created = new Date();
  
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }] // Congelar la primera fila (cabeceras)
  });

  // 2. Determinar las columnas genéricas si no fueron provistas
  // Simplemente tomamos las llaves del primer objeto
  let excelColumns = columns;
  if (!excelColumns) {
    const firstRow = data[0];
    excelColumns = Object.keys(firstRow).map((key) => ({
      header: capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1')), // Formatear camelCase a normal
      key: key,
      width: 20, // Ancho por defecto
    }));
  }

  // 3. Aplicar las columnas al worksheet
  worksheet.columns = excelColumns.map((col) => ({
    header: col.header,
    key: col.key as string,
    width: col.width || 20,
  }));

  // 4. Agregar la data genérica
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // 5. Aplicar estilos básicos (Cabeceras modernas y agradables)
  const headerRow = worksheet.getRow(1);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0A2342" }, // Navy blue (nuestro color base)
    };
    cell.font = {
      color: { argb: "FFFFFFFF" },
      bold: true,
      size: 11,
      name: "Arial"
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center"
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF153050' } },
      left: { style: 'thin', color: { argb: 'FF153050' } },
      bottom: { style: 'thin', color: { argb: 'FF153050' } },
      right: { style: 'thin', color: { argb: 'FF153050' } }
    };
  });

  // Estilo a las filas intercaladas de la tabla
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip cabecera
    
    row.height = 20;

    row.eachCell((cell) => {
      // Color intercalado suave
      if (rowNumber % 2 === 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" }, // bg-surface-low equivalente aprox
        };
      }
      
      // Bordes tenues en las celdas
      cell.border = {
        bottom: { style: "hair", color: { argb: "FFE2E8F0" } },
      };
      
      // Formateo de fechas / números automáticos se maneja por exceljs si los tipos están bien,
      // pero forzaremos la alineación estándar.
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
    });
  });

  // 6. Auto-ajustar el ancho de las columnas según contenido si es necesario
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    // Añadir paddings extra, con un límite máximo de 50
    column.width = Math.min(Math.max(maxLength + 4, column.header?.length || 10), 50);
  });

  // 7. Descargar usando Buffer y FileSaver en entorno de navgeador
  // Nota: En frontend moderno es suficiente usar HTML5 Blob y descarga de link
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Util para ayudar con keys sin formatear
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).trim();
}
