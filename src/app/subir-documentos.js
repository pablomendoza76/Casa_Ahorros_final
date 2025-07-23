const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 🔐 Usa tu Service Role Key aquí (⚠️ solo para uso backend seguro)
const supabaseUrl = 'https://zefiqtexdeiwqhtpwsqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZmlxdGV4ZGVpd3FodHB3c3FkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc3NTUyMywiZXhwIjoyMDY2MzUxNTIzfQ.kgvu0_CZDkSWvyWOmi2RT9fAxpycMcBWGgbjCcumODk';

const supabase = createClient(supabaseUrl, supabaseKey);

// 📂 Ruta local de los documentos
const rutaBase = 'C:/Users/Usuario iTC/Desktop/Caja_Ahorros/Documentos_ejemplo';
const prestamoId = 101; // Cambia al ID real del préstamo

const archivos = [
  { nombre: 'cedula_andres_perez.docx', tipo: 'cedula' },
  { nombre: 'certificado_votacion_2025.docx', tipo: 'certificado_votacion' },
  { nombre: 'pagares_mayo_junio_2025.docx', tipo: 'pagares' },
  { nombre: 'otros_documentos_extra.docx', tipo: 'otros_documentos' },
];

async function subirArchivos() {
  for (const archivo of archivos) {
    const rutaLocal = path.join(rutaBase, archivo.nombre);
    const contenido = fs.readFileSync(rutaLocal);
    const rutaStorage = `prestamos/${prestamoId}/${archivo.tipo}-${archivo.nombre}`;

    const { error } = await supabase.storage
      .from('documentosprestamos')
      .upload(rutaStorage, contenido, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`❌ Error al subir ${archivo.nombre}:`, error.message);
      continue;
    }

    const { data } = supabase.storage
      .from('documentosprestamos')
      .getPublicUrl(rutaStorage);

    console.log(`✅ Subido ${archivo.nombre}: ${data.publicUrl}`);
  }
}

subirArchivos();
  