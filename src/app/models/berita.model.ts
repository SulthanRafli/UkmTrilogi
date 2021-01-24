export class Berita {
    constructor(
        public id?: string,
        public idUkm?: string,
        public namaUkm?: string,
        public judul?: string,        
        public isiBerita?: string,
        public namaPenulis?: string,
        public tanggalUpload?: string,
        public fileName?: string,
        public imageUrl?: string,
    ) { }
}