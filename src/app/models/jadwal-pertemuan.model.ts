export class JadwalPertemuan {
    constructor(
        public id?: string,
        public idUkm?: string,
        public namaUkm?: string,
        public nama?: string,
        public tanggal?: string,        
        public jamMulai?: string,
        public jamSelesai?: string,
        public keterangan?: string,
    ) { }
}