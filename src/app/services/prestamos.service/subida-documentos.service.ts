// subida-documentos-frontend.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubidaDocumentosFrontendService {
  private supabaseUrl = 'https://zefiqtexdeiwqhtpwsqd.supabase.co';
  private supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZmlxdGV4ZGVpd3FodHB3c3FkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc3NTUyMywiZXhwIjoyMDY2MzUxNTIzfQ.kgvu0_CZDkSWvyWOmi2RT9fAxpycMcBWGgbjCcumODk';
  private bucket = 'documentosprestamos';

  constructor(private http: HttpClient) {}

  /**
   * Sube un archivo individual al bucket de Supabase con nombre estandarizado.
   * @param file Archivo a subir
   * @param tipo Tipo de documento (cedula, votacion, etc.)
   * @param prestamoId ID del préstamo al que se asocia
   * @returns URL pública del archivo subido
   */
  async subirArchivo(file: File, tipo: string, prestamoId: number): Promise<string> {
    const nombreSanitizado = `${tipo}-${file.name.replace(/\s+/g, '_').toLowerCase()}`;
    const rutaStorage = `prestamos/${prestamoId}/${nombreSanitizado}`;
    const uploadUrl = `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${rutaStorage}`;
    const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucket}/${rutaStorage}`;

    const headers = new HttpHeaders({
      apikey: this.supabaseKey,
      Authorization: `Bearer ${this.supabaseKey}`,
      'X-Upsert': 'true'
      // 'Content-Type' eliminado intencionalmente para evitar error 400
    });

    await firstValueFrom(this.http.put(uploadUrl, file, { headers }));

    return publicUrl;
  }

  /**
   * Sube múltiples archivos asociados a un préstamo.
   * @param archivos Array de objetos con { file, tipo }
   * @param prestamoId ID del préstamo
   * @returns Arreglo de URLs públicas subidas
   */
  async subirMultiplesArchivos(
    archivos: { file: File; tipo: string }[],
    prestamoId: number
  ): Promise<string[]> {
    const urls: string[] = [];

    for (const item of archivos) {
      const url = await this.subirArchivo(item.file, item.tipo, prestamoId);
      urls.push(url);
    }

    return urls;
  }
}
