import { generateCRC32Like } from './parser.js';

// Generator CRC32 JavaScript (setara dengan abs(crc32($uniqueKey)))
function getCrc32Number(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Pseudo-random generator berbasis seed (Pengganti mt_srand di PHP)
class SeededRandom {
  constructor(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// Fungsi shuffle konsisten dengan SeededRandom
function seededShuffle(array, seed) {
  const rng = new SeededRandom(seed);
  let currentIndex = array.length, randomIndex, temporaryValue;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(rng.next() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// 1. Ambil FAQ Terpilih (Manual Array Version)
export async function getSelectedFaqs(uniqueKey, brandName, baseUrl) {
  const formattedBrand = brandName ? brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase() : 'Aplikasi';
  
  const masterFaqs = [
    {
        "q": "Apakah {brand} aman untuk diunduh dan dipasang?",
        "a": "Ya, {brand} telah melalui pemindaian keamanan berlapis dan dipastikan bersih dari malware, virus, serta aman untuk perangkat Anda."
    },
    {
        "q": "Bagaimana cara memastikan keaslian file {brand} yang diunduh?",
        "a": "Pastikan Anda selalu mengunduh {brand} melalui tautan resmi di halaman ini untuk menghindari file modifikasi pihak ketiga yang berbahaya."
    },
    {
        "q": "Apakah file instalasi {brand} bebas dari iklan berlebihan?",
        "a": "Ya, {brand} dirancang dengan antarmuka yang bersih dan nyaman tanpa gangguan iklan pop-up yang berlebihan."
    },
    {
        "q": "Apakah data pribadi saya aman saat menggunakan {brand}?",
        "a": "Keamanan privasi pengguna adalah prioritas utama. {brand} tidak membagikan data sensitif Anda kepada pihak luar tanpa izin."
    },
    {
        "q": "Apakah {brand} memerlukan akses root pada perangkat?",
        "a": "Tidak, Anda dapat memasang dan menjalankan {brand} secara normal tanpa perlu melakukan rooting pada perangkat Android Anda."
    },
    {
        "q": "Apakah sistem keamanan {brand} rutin diperbarui?",
        "a": "Tentu, pengembang secara berkala memperbarui sistem enkripsi dan keamanan {brand} untuk menangkal celah kerentanan."
    },
    {
        "q": "Apakah akun saya berisiko terkena banned saat memakai {brand}?",
        "a": "Selama Anda menggunakannya sesuai petunjuk dan mengunduh versi resmi {brand} di sini, akun Anda dijamin aman."
    },
    {
        "q": "Bagaimana cara melaporkan bug atau celah keamanan pada {brand}?",
        "a": "Anda dapat menghubungi layanan dukungan pelanggan resmi melalui menu kontak yang tersedia jika menemukan kendala keamanan di {brand}."
    },
    {
        "q": "Apakah {brand} aman digunakan untuk semua jenis smartphone?",
        "a": "Ya, {brand} mendukung hampir semua merek ponsel pintar modern baik spesifikasi entry-level maupun flagship."
    },
    {
        "q": "Apakah ada sertifikasi resmi untuk distribusi {brand}?",
        "a": "Semua rilis file {brand} telah melewati standar kelayakan rilis aplikasi digital yang aman dan stabil."
    },
    {
        "q": "Apakah file unduhan {brand} terdeteksi sebagai false positive oleh antivirus?",
        "a": "Kadang kala beberapa antivirus lokal memberikan peringatan false positive karena sifat file APK pihak ketiga, namun {brand} 100% aman."
    },
    {
        "q": "Apakah {brand} menyimpan riwayat kata sandi pengguna?",
        "a": "Tidak, {brand} menerapkan protokol enkripsi standar industri sehingga kredensial login Anda tetap privat."
    },
    {
        "q": "Apakah tautan unduhan {brand} dilindungi oleh SSL?",
        "a": "Ya, seluruh jalur distribusi dan tautan download {brand} menggunakan protokol HTTPS yang terenkripsi aman."
    },
    {
        "q": "Bisakah saya menggunakan {brand} di emulator PC?",
        "a": "Bisa, {brand} dapat berjalan dengan lancar menggunakan emulator Android populer seperti Bluestacks atau NoxPlayer di komputer."
    },
    {
        "q": "Apakah pengembang {brand} menyediakan jaminan garansi fungsionalitas?",
        "a": "Kami menjamin bahwa aplikasi {brand} yang diunduh dari halaman ini berfungsi dengan baik sesuai deskripsi."
    },

    {
        "q": "Bagaimana cara memperbarui versi terbaru {brand}?",
        "a": "Anda bisa langsung mengunduh file APK versi terbaru dari halaman ini secara berkala untuk mendapatkan pembaruan fitur dan perbaikan bug pada {brand}."
    },
    {
        "q": "Apakah pembaruan {brand} tersedia secara otomatis?",
        "a": "Untuk pembaruan manual via web, Anda dapat memantau halaman ini secara berkala guna mendapatkan file versi paling fresh dari {brand}."
    },
    {
        "q": "Apakah saya harus menghapus versi lama {brand} sebelum update?",
        "a": "Biasanya Anda bisa langsung menimpa (overwrite) instalasi lama dengan file APK terbaru {brand} tanpa menghapus data sebelumnya."
    },
    {
        "q": "Di mana saya bisa melihat changelog atau riwayat pembaruan {brand}?",
        "a": "Informasi mengenai penambahan fitur dan perbaikan pada setiap versi {brand} dapat dilihat di bagian deskripsi pembaruan."
    },
    {
        "q": "Apakah versi terdahulu (old version) {brand} masih bisa diunduh?",
        "a": "Jika perangkat Anda tidak mendukung versi paling baru, Anda dapat mencari arsip versi stabil {brand} sebelumnya."
    },
    {
        "q": "Berapa sering {brand} melakukan pembaruan sistem?",
        "a": "{brand} diperbarui secara berkala setiap ada penyesuaian sistem atau rilis fitur inovatif baru dari tim pengembang."
    },
    {
        "q": "Apakah data permainan atau akun akan hilang saat update {brand}?",
        "a": "Selama Anda tidak melakukan uninstall bersih atau menghapus cache data aplikasi, progress di {brand} akan tetap aman."
    },
    {
        "q": "Bagaimana cara tahu jika ada versi baru dari {brand}?",
        "a": "Kunjungi halaman situs ini secara rutin atau pantau pemberitahuan di dalam platform resmi {brand}."
    },
    {
        "q": "Apakah proses update {brand} memerlukan koneksi internet yang cepat?",
        "a": "Disarankan menggunakan jaringan internet yang stabil agar proses pengunduhan file update {brand} tidak terputus di tengah jalan."
    },
    {
        "q": "Mengapa saya gagal memperbarui {brand}?",
        "a": "Kegagalan update biasanya disebabkan oleh memori penuh atau file unduhan {brand} yang korup; silakan unduh ulang."
    },
    {
        "q": "Apakah versi beta {brand} sudah tersedia untuk umum?",
        "a": "Beberapa fitur uji coba khusus {brand} kadang dirilis terbatas bagi pengguna yang ingin mencoba teknologi teranyar."
    },
    {
        "q": "Apakah {brand} versi lama otomatis tidak bisa digunakan?",
        "a": "Beberapa versi usang {brand} mungkin memerlukan pembaruan jika terjadi pemeliharaan server pusat atau perubahan protokol."
    },
    {
        "q": "Apakah ukuran file update {brand} besar?",
        "a": "Tim pengembang selalu menjaga agar ukuran file update {brand} tetap ringkas dan ramah kuota internet."
    },
    {
        "q": "Bisakah saya melakukan downgrade versi {brand}?",
        "a": "Kami menyarankan tetap menggunakan versi terbaru {brand} demi stabilitas dan keamanan sistem yang optimal."
    },
    {
        "q": "Apakah fitur baru di {brand} langsung bisa digunakan setelah update?",
        "a": "Ya, setelah instalasi pembaruan {brand} selesai, Anda bisa langsung menikmati seluruh fitur tambahannya."
    },

    {
        "q": "Apakah {brand} dapat dijalankan secara offline?",
        "a": "Sebagian besar fitur utama pada {brand} dapat diakses tanpa koneksi internet, namun beberapa fungsi sinkronisasi memerlukan jaringan yang stabil."
    },
    {
        "q": "Jenis koneksi internet apa yang paling baik untuk {brand}?",
        "a": "{brand} dapat berjalan optimal menggunakan jaringan 4G LTE, 5G, maupun sambungan Wi-Fi stabil."
    },
    {
        "q": "Apakah {brand} boros dalam penggunaan kuota data?",
        "a": "Tidak, {brand} telah dioptimalkan agar memiliki efisiensi tinggi dalam penggunaan bandwith data internet."
    },
    {
        "q": "Bagaimana mengatasi {brand} yang lambat saat jaringan buruk?",
        "a": "Pastikan sinyal seluler Anda stabil atau beralihlah ke jaringan Wi-Fi agar performa {brand} kembali responsif."
    },
    {
        "q": "Apakah {brand} mendukung mode hemat data?",
        "a": "Ya, sistem di dalam {brand} secara otomatis menyesuaikan konsumsi data berdasarkan kualitas jaringan Anda."
    },
    {
        "q": "Kenapa {brand} sering mengalami gangguan koneksi (lagging)?",
        "a": "Hal tersebut umumnya terjadi karena server sedang dalam pemeliharaan atau koneksi internet perangkat Anda sedang fluktuatif."
    },
    {
        "q": "Apakah saya bisa memakai VPN saat mengakses {brand}?",
        "a": "Penggunaan VPN diperbolehkan jika Anda ingin mengamankan privasi jaringan saat terhubung ke layanan {brand}."
    },
    {
        "q": "Apakah ada batasan wilayah (geografis) untuk menggunakan {brand}?",
        "a": "{brand} dirancang agar dapat diakses secara global tanpa batasan regional yang merepotkan."
    },
    {
        "q": "Bagaimana cara mengecek status server {brand} sedang online?",
        "a": "Anda bisa melihat indikator koneksi di dalam aplikasi atau memantau pengumuman resmi dari pengelola {brand}."
    },
    {
        "q": "Apakah {brand} tetap berjalan di latar belakang (background)?",
        "a": "Ya, {brand} mempertahankan proses sinkronisasi ringan di latar belakang agar pemberitahuan tetap masuk secara real-time."
    },
    {
        "q": "Apakah pemadaman internet total berdampak pada fungsi lokal {brand}?",
        "a": "Fitur offline dasar pada {brand} masih bisa dibuka, namun fitur berbasis online akan tertunda hingga internet pulih."
    },
    {
        "q": "Apakah {brand} kompatibel dengan jaringan internet publik / hotspot?",
        "a": "Kompatibel, namun pastikan jaringan publik tersebut aman dari ancaman penyadapan data saat memakai {brand}."
    },
    {
        "q": "Apakah latensi (ping) memengaruhi kinerja {brand}?",
        "a": "Untuk pengalaman interaktif yang mulus di {brand}, latensi rendah tentu akan memberikan respons yang jauh lebih cepat."
    },
    {
        "q": "Bagaimana cara melakukan reset koneksi jaringan di {brand}?",
        "a": "Anda cukup menutup aplikasi {brand} sepenuhnya dari Recent Apps lalu membukanya kembali."
    },
    {
        "q": "Apakah {brand} memakan banyak sumber daya bandwidth saat idle?",
        "a": "Sama sekali tidak, {brand} sangat hemat sumber daya ketika sedang tidak aktif digunakan."
    },

    {
        "q": "Berapa ukuran file unduhan {brand} saat ini?",
        "a": "Ukuran file {brand} sangat ringan dan dioptimalkan agar tidak membebani memori penyimpanan perangkat Anda."
    },
    {
        "q": "Berapa RAM minimum yang dibutuhkan untuk menjalankan {brand}?",
        "a": "{brand} dapat berjalan dengan lancar bahkan pada perangkat dengan kapasitas RAM minimal 2GB."
    },
    {
        "q": "Berapa sisa ruang penyimpanan yang harus disiapkan untuk {brand}?",
        "a": "Anda hanya perlu menyediakan ruang kosong beberapa puluh megabita saja untuk instalasi awal dan cache {brand}."
    },
    {
        "q": "Apakah {brand} dapat dipindahkan ke kartu SD (MicroSD)?",
        "a": "Sebagian besar sistem Android modern mengizinkan pemindahan data {brand} ke memori eksternal jika memori internal penuh."
    },
    {
        "q": "Bagaimana cara membersihkan cache sampah dari {brand}?",
        "a": "Anda bisa masuk ke Pengaturan Ponsel > Aplikasi > {brand} > Pilih 'Hapus Cache' untuk menghemat ruang."
    },
    {
        "q": "Apakah {brand} menyebabkan perangkat cepat panas?",
        "a": "Tidak, pengkodean efisien pada {brand} memastikan penggunaan CPU tetap normal dan tidak memicu overheat."
    },
    {
        "q": "Apakah {brand} boros dalam konsumsi baterai ponsel?",
        "a": "{brand} dikembangkan dengan algoritma hemat daya sehingga baterai perangkat Anda tetap awet seharian."
    },
    {
        "q": "Versi Android berapa yang menjadi syarat minimum {brand}?",
        "a": "{brand} mendukung sistem operasi Android versi 5.0 (Lollipop) ke atas hingga versi terbaru saat ini."
    },
    {
        "q": "Apakah {brand} mendukung arsitektur prosesor 64-bit?",
        "a": "Ya, {brand} sepenuhnya dioptimalkan untuk perangkat dengan arsitektur prosesor 64-bit modern demi performa maksimal."
    },
    {
        "q": "Mengapa perangkat saya memperingatkan memori penuh saat instal {brand}?",
        "a": "Pastikan sisa memori internal Anda mencukupi, karena sistem membutuhkan ruang ekstra untuk proses unpacking file {brand}."
    },
    {
        "q": "Apakah {brand} kompatibel dengan layar tablet yang besar?",
        "a": "Ya, tata letak antarmuka {brand} bersifat responsif dan otomatis menyesuaikan ukuran layar ponsel maupun tablet."
    },
    {
        "q": "Apakah ada versi khusus {brand} untuk spesifikasi HP kentang?",
        "a": "File standar {brand} sudah sangat ringkas dan ringan sehingga otomatis ramah untuk semua jenis spesifikasi ponsel."
    },
    {
        "q": "Apakah {brand} mendukung mode gelap (Dark Mode)?",
        "a": "Ya, {brand} menyediakan opsi tema gelap untuk kenyamanan mata pengguna saat beraktivitas di tempat minim cahaya."
    },
    {
        "q": "Bagaimana performa {brand} pada prosesor MediaTek vs Snapdragon?",
        "a": "{brand} berjalan sama baiknya dan stabil di berbagai chipset populer seperti Snapdragon, MediaTek, maupun Exynos."
    },
    {
        "q": "Apakah instalasi {brand} mempengaruhi kinerja aplikasi lain?",
        "a": "Tidak sama sekali, {brand} berjalan di lingkungan sandbox terisolasi tanpa mengganggu kinerja aplikasi lain."
    },

    {
        "q": "Apakah perangkat saya mendukung untuk menginstal {brand}?",
        "a": "{brand} kompatibel dengan hampir semua versi sistem operasi modern saat ini dengan spesifikasi minimum yang sangat ramah perangkat."
    },
    {
        "q": "Bagaimana cara mengatasi kendala saat memasang APK {brand}?",
        "a": "Pastikan Anda telah mengaktifkan opsi 'Sumber Tidak Dikenal' (Unknown Sources) pada pengaturan keamanan perangkat Anda sebelum memulai instalasi {brand}."
    },
    {
        "q": "Di mana file hasil unduhan {brand} tersimpan?",
        "a": "File instalasi {brand} biasanya akan tersimpan otomatis di dalam folder 'Download' atau 'Unduhan' di memori internal perangkat Anda."
    },
    {
        "q": "Apa yang harus dilakukan jika muncul pesan 'Parse Error' saat buka APK {brand}?",
        "a": "Pesan tersebut menandakan file unduhan korup atau versi Android Anda tidak kompatibel; silakan unduh ulang file {brand} terbaru."
    },
    {
        "q": "Apakah saya perlu menghapus versi lama sebelum instal APK {brand} baru?",
        "a": "Disarankan melakukan uninstall terlebih dahulu jika Anda mendapati error penumpukan tanda tangan (signature conflict) pada {brand}."
    },
    {
        "q": "Bagaimana cara mengizinkan instalasi dari sumber luar untuk {brand}?",
        "a": "Masuk ke Pengaturan > Keamanan > Centang 'Sumber Tidak Dikenal' atau izinkan browser Anda menginstal aplikasi."
    },
    {
        "q": "Mengapa proses instalasi {brand} berhenti di tengah jalan?",
        "a": "Hal ini biasanya disebabkan oleh memori RAM yang hampir habis atau ruang penyimpanan internal yang tersisa sedikit."
    },
    {
        "q": "Apakah file {brand} berbentuk format ZIP atau APK?",
        "a": "File instalasi resmi yang disediakan di halaman ini berformat `.apk` siap pasang."
    },
    {
        "q": "Bagaimana cara membuka file APK {brand} setelah diunduh?",
        "a": "Cukup ketuk (tap) pada notifikasi unduhan selesai atau buka File Manager, cari file {brand}, lalu pilih Install."
    },
    {
        "q": "Apakah saya memerlukan aplikasi pihak ketiga untuk menginstal {brand}?",
        "a": "Tidak perlu, penginstal bawaan (package installer) Android sudah cukup untuk memasang {brand} dengan sempurna."
    },
    {
        "q": "Kenapa tombol 'Install' tidak bisa diklik saat memasang {brand}?",
        "a": "Biasanya ada aplikasi overlay layar (seperti pengatur cahaya biru) yang aktif; matikan aplikasi tersebut sementara untuk menginstal {brand}."
    },
    {
        "q": "Apakah {brand} bisa diinstal langsung di iPhone (iOS)?",
        "a": "Halaman ini menyediakan versi Android, untuk pengguna iOS silakan ikuti petunjuk khusus instalasi ekosistem Apple jika tersedia untuk {brand}."
    },
    {
        "q": "Bagaimana cara mengatasi 'App Not Installed' pada {brand}?",
        "a": "Copot pemasangan versi lama yang tersisa atau bersihkan file sampah sisa instalasi sebelumnya dari {brand}."
    },
    {
        "q": "Apakah aman mengunduh {brand} melalui browser seluler?",
        "a": "Sangat aman selama Anda mengunduhnya langsung melalui tautan resmi yang disediakan di situs ini."
    },
    {
        "q": "Berapa lama waktu yang dibutuhkan untuk proses instalasi {brand}?",
        "a": "Proses pemasangan {brand} sangat cepat, biasanya hanya memakan waktu 5 hingga 15 detik saja."
    },

    {
        "q": "Apakah ada biaya langganan untuk menggunakan {brand}?",
        "a": "Tidak ada biaya tersembunyi. Anda dapat mengunduh dan menikmati seluruh layanan {brand} melalui halaman ini secara gratis."
    },
    {
        "q": "Apakah semua fitur di dalam {brand} dapat diakses gratis?",
        "a": "Ya, fitur dasar dan utilitas utama {brand} dapat dinikmati pengguna secara cuma-cuma tanpa syarat rumit."
    },
    {
        "q": "Bagaimana cara menghubungi layanan bantuan pelanggan {brand}?",
        "a": "Anda dapat mengakses menu pusat bantuan atau kontak support yang tertera di platform resmi {brand}."
    },
    {
        "q": "Apakah ada program membership khusus di {brand}?",
        "a": "Beberapa layanan opsional di dalam {brand} mungkin menawarkan keuntungan ekstra bagi pengguna aktif atau member setia."
    },
    {
        "q": "Apakah pembelian dalam aplikasi (in-app purchase) di {brand} bersifat wajib?",
        "a": "Tidak sama sekali, pembelian dalam {brand} bersifat sukarela dan hanya opsional untuk fitur tambahan tertentu."
    },
    {
        "q": "Bagaimana prosedur pengembalian dana jika terjadi kesalahan di {brand}?",
        "a": "Kebijakan transaksi mengikuti ketentuan layanan resmi yang berlaku pada ekosistem {brand}."
    },
    {
        "q": "Apakah {brand} menyediakan layanan dukungan bahasa Indonesia?",
        "a": "Ya, antarmuka {brand} sudah mendukung penuh bahasa Indonesia untuk kemudahan navigasi pengguna lokal."
    },
    {
        "q": "Kapan waktu operasional layanan bantuan {brand}?",
        "a": "Layanan bantuan dan pelaporan kendala terkait {brand} umumnya siap melayani pengguna setiap hari."
    },
    {
        "q": "Apakah saya harus mendaftar akun untuk memakai {brand}?",
        "a": "Beberapa fungsi dasar dapat digunakan langsung tanpa login, namun registrasi diperlukan untuk menyimpan data profil di {brand}."
    },
    {
        "q": "Bagaimana jika saya lupa kata sandi akun {brand}?",
        "a": "Anda bisa menggunakan fitur 'Lupa Sandi' pada halaman login {brand} melalui email atau nomor terdaftar."
    },
    {
        "q": "Apakah akun {brand} saya bisa ditautkan ke media sosial?",
        "a": "Ya, {brand} menyediakan opsi kemudahan tautan masuk melalui akun Google atau platform media sosial populer lainnya."
    },
    {
        "q": "Bagaimana cara menghapus akun {brand} secara permanen?",
        "a": "Anda dapat mengajukan penghapusan data akun melalui menu pengaturan privasi di dalam sistem {brand}."
    },
    {
        "q": "Apakah ada batasan umur untuk menggunakan {brand}?",
        "a": "Pengguna {brand} disesuaikan dengan ketentuan kebijakan konten digital dan batasan usia standar aplikasi."
    },
    {
        "q": "Apakah {brand} memuat konten promosi pihak ketiga?",
        "a": "Platform {brand} menjaga kenyamanan pengguna dengan meminimalisir atau menyaring iklan pihak ketiga yang tidak relevan."
    },
    {
        "q": "Di mana saya bisa membaca syarat dan ketentuan lengkap {brand}?",
        "a": "Syarat, ketentuan, serta kebijakan privasi {brand} dapat diakses melalui tautan footer di situs resmi."
    },

    {
        "q": "Apa yang harus dilakukan jika {brand} tiba-tiba keluar sendiri (Force Close)?",
        "a": "Coba bersihkan data cache aplikasi atau restart ponsel Anda, lalu buka kembali {brand} dengan normal."
    },
    {
        "q": "Bagaimana mengatasi layar {brand} yang membeku (freezing)?",
        "a": "Tutup paksa aplikasi melalui menu pengelola aplikasi ponsel Anda, kemudian jalankan ulang {brand}."
    },
    {
        "q": "Mengapa notifikasi dari {brand} tidak muncul di layar HP?",
        "a": "Periksa pengaturan izin pemberitahuan (notifications permission) untuk {brand} di menu setelan perangkat Anda."
    },
    {
        "q": "Bagaimana jika {brand} gagal melakukan sinkronisasi data?",
        "a": "Pastikan koneksi internet Anda stabil dan coba lakukan refresh manual di dalam halaman utama {brand}."
    },
    {
        "q": "Mengapa suara atau audio di {brand} tidak terdengar?",
        "a": "Periksa volume media perangkat Anda atau pastikan tombol mode senyap (silent) tidak sedang aktif pada {brand}."
    },
    {
        "q": "Bagaimana cara mengatasi layar hitam (black screen) saat membuka {brand}?",
        "a": "Tunggu beberapa saat atau instal ulang file APK {brand} jika file sebelumnya mengalami korupsi data saat diunduh."
    },
    {
        "q": "Apakah saya bisa melaporkan error fatal (crash report) pada {brand}?",
        "a": "Ya, laporan kendala teknis dapat dikirimkan melalui layanan pelanggan agar tim pengembang {brand} dapat segera memperbaikinya."
    },
    {
        "q": "Mengapa {brand} meminta izin akses lokasi atau penyimpanan?",
        "a": "Izin tersebut diperlukan agar fitur-fitur fungsional inti di dalam {brand} dapat berjalan secara optimal."
    },
    {
        "q": "Bagaimana cara mengembalikan pengaturan {brand} ke semula?",
        "a": "Anda bisa memilih opsi 'Hapus Data' (Clear Data) pada menu aplikasi perangkat untuk mereset pengaturan {brand}."
    },
    {
        "q": "Di mana tempat paling aman untuk mengunduh pembaruan {brand} selanjutnya?",
        "a": "Simpan dan tandai (bookmark) halaman situs resmi ini agar Anda selalu mendapat akses unduhan versi teraman dari {brand}."
    }
  ];

  const limitFaqs = 6;
  const hashNum = getCrc32Number(uniqueKey) || 12345;
  
  let tempFaqs = [...masterFaqs];
  tempFaqs = seededShuffle(tempFaqs, hashNum);

  const rawSelectedFaqs = tempFaqs.slice(0, limitFaqs);
  const selectedFaqs = rawSelectedFaqs.map(faq => ({
    q: faq.q.replace(/\{brand\}/g, formattedBrand),
    a: faq.a.replace(/\{brand\}/g, formattedBrand)
  }));

  return selectedFaqs;
}

export async function getSimilarAndRelated(uniqueKey, brandCode, appOS = 'Android', appSize = '18.5 MB', baseUrl, urlOrigin) {
  const formattedBrand = brandCode.charAt(0).toUpperCase() + brandCode.slice(1).toLowerCase();
  const currentHash = getCrc32Number(uniqueKey) || 12345;
  const rng = new SeededRandom(currentHash);

  // Daftar ratusan brand random internal yang jauh lebih banyak
  const brandsList = [
    'Togel138', 'Asia200', 'Slot88', 'Koitoto', 'Stmtoto', 
    'Togel2win', 'K200m', 'MUSANGWIN', 'BANSONWIN', 'JayaSakti',
    'GarudaSlot', 'MegaTogel', 'RajanyaToto', 'BandarJp', 'LintasToto',
    'NusantaraSlot', 'JpVip', 'StarSlot', 'Winner138', 'Gacor88',
    'JpTerus', 'SlotMania', 'ZeusMaxwin', 'MahjongWays', 'GatesOfOlympus',
    'StarlightPrincess', 'Bonanza88', 'SultanSlot', 'Hoki138', 'MasterJp',
    'DewiSlot', 'RajaSlot', 'KaisarToto', 'BintangSlot', 'MegaWin',
    'SuperSlot', 'AcesSlot', 'Fortune88', 'LuckySpin', 'GoldenSlot',
    'DiamondSlot', 'RubySlot', 'EmeraldWin', 'SapphireSlot', 'PlatinumJp',
    'BronzeSlot', 'SilverWin', 'TitanSlot', 'DragonSlot', 'PhoenixWin',
    'TigerSlot', 'LionWin', 'PandaSlot', 'WolfJp', 'EagleSlot',
    'HawkWin', 'SharkSlot', 'WhaleJp', 'DolphinSlot', 'KrakenWin',
    'VikingSlot', 'SpartanJp', 'RomanSlot', 'GreekWin', 'EgyptSlot',
    'MayaWin', 'AztecSlot', 'IncaJp', 'NorseSlot', 'OdinWin',
    'ThorSlot', 'LokiJp', 'AGEN69', 'CERI388', 'OBCTOP',
    'PoseidonJp', 'ZeusSlot', 'HeraWin', 'ApolloSlot', 'AresJp',
    'HermesSlot', 'AthenaWin', 'ArtemisSlot', 'DemeterJp', 'DionysusSlot',
    'HadesWin', 'CronusSlot', 'RheaJp', 'GaiaSlot', 'UranusWin',
    'NexusSlot', 'QuantumJp', 'CosmicSlot', 'GalaxyWin', 'NebulaSlot',
    'SupernovaJp', 'EclipseSlot', 'CometWin', 'MeteorSlot', 'AsteroidJp',
    'OrbitSlot', 'GravityWin', 'VortexSlot', 'PlasmaJp', 'LaserSlot',
    'PhotonWin', 'NeutronSlot', 'ProtonJp', 'ElectronSlot', 'AtomWin',
    'MatrixSlot', 'CyberJp', 'NeonSlot', 'PixelWin', 'VectorSlot',
    'PolygonJp', 'BinarySlot', 'CodeWin', 'ScriptSlot', 'LogicJp',
    'AlgorithmSlot', 'SystemWin', 'NetworkSlot', 'ProtocolJp', 'ServerSlot',
    'CloudWin', 'DataSlot', 'CacheJp', 'BufferSlot', 'StreamWin',
    'PacketSlot', 'RouterJp', 'SwitchSlot', 'GatewayWin', 'FirewallSlot',
    'TerminalJp', 'ConsoleSlot', 'PromptWin', 'CommandSlot', 'QueryJp',
    'IndexSlot', 'SearchWin', 'FilterSlot', 'SortJp', 'MergeSlot',
    'DeployWin', 'BuildSlot', 'CompileJp', 'RenderSlot', 'ExecuteWin',
    'RuntimeSlot', 'FrameworkJp', 'LibrarySlot', 'ModuleWin', 'PackageSlot',
    'RegistryJp', 'SessionSlot', 'CookieWin', 'TokenSlot', 'AuthJp',
    'AccessSlot', 'PermissionWin', 'RoleSlot', 'GroupJp', 'UserSlot',
    'ProfileWin', 'AccountSlot', 'CredentialJp', 'IdentitySlot', 'AvatarWin',
    'BadgeSlot', 'StatusJp', 'LevelSlot', 'RankWin', 'ScoreSlot',
    'PointJp', 'CoinSlot', 'CashWin', 'BalanceSlot', 'WalletJp',
    'VaultSlot', 'BankWin', 'TransferSlot', 'DepositJp', 'WithdrawSlot',
    'TransactionWin', 'PaymentSlot', 'InvoiceJp', 'ReceiptSlot', 'CheckoutWin',
    // Tambahan variasi teks/brand dummy baru agar semakin banyak
    'SitusGacor', 'Maxwin88', 'ScatterHitam', 'PetirMerah', 'JackpotPaus',
    'BandarTogel', 'SlotOnline', 'LiveRtp', 'InfoGacor', 'JpMasal',
    'KoinSultan', 'PutaranMega', 'BonusHarian', 'AgenResmi', 'LinkAlternatif',
    'AntiNawala', 'AksesKilat', 'LoginInstan', 'DaftarCepat', 'MemberSetia',
    'SpinGratis', 'PerkalianX', 'JpBablas', 'SensasiMaxwin', 'GampangMenang',
    'SitusTerpercaya', 'PlatformGacor', 'ArenaSlot', 'PusatJp', 'GudangSlot'
  ];

  let brandNames = brandsList.map(b => b.charAt(0).toUpperCase() + b.slice(1).toLowerCase());

  // Acak konsisten berdasarkan hash
  brandNames = seededShuffle(brandNames, currentHash);

  // Tempatkan brand aktif di urutan pertama
  brandNames = brandNames.filter(b => b.toLowerCase() !== formattedBrand.toLowerCase());
  brandNames.unshift(formattedBrand);
  const brandCount = brandNames.length;

  const displayWords = [
    'Portal Unduh Resmi dan Layanan Pendaftaran Akun Terpercaya',
    'Pembaruan Update Versi Terbaru dengan Performa Sistem Lebih Stabil',
    'Paket Installer Cepat dan Panduan Instalasi Aplikasi Tanpa Hambatan',
    'Aplikasi Mobile Resmi untuk Pengalaman Akses Layanan Terbaik',
    'Berkas Paket Instalasi Terverifikasi Aman dan Bebas dari Malware',
    'Panduan Lengkap Proses Download Aman dan Akses Tautan Resmi',
    'Client Resmi Layanan Akses Cepat dan Manajemen Akun Member',
    'Pusat Unduhan File APK Terlengkap dengan Sistem Keamanan Tinggi',
    'File APK Resmi Terverifikasi untuk Kebutuhan Navigasi Harian',
    'Dukungan Kompatibilitas Perangkat Luas dengan Performa Tanpa Lag'
  ];
  
  const similarApps = [];
  const relatedTopics = [];

  const appCategory = 'Utilities'; 
  const categorySlug = appCategory.toLowerCase();

  // Generate Similar Apps (Tanpa ukuran file / size)
  for (let i = 0; i < 8; i++) {
    const currentBrandName = (i === 0) ? formattedBrand : brandNames[i % brandCount];
    const randomWord = displayWords[Math.floor(rng.next() * displayWords.length)];
    
    const brandSlug = currentBrandName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomUriSlug = `${baseUrl}/store/apps/details/${categorySlug}/${brandSlug}`;

    // Format judul tanpa menyertakan appSize
    const title = `${currentBrandName} - ${randomWord}`;

    similarApps.push({
      title: title,
      slug: randomUriSlug,
      firstLetter: currentBrandName.charAt(0).toUpperCase(),
      bgHex: Math.floor(rng.next() * 16777215).toString(16)
    });
  }

  // Generate Related Topics dengan kalimat yang lebih panjang dan bervariasi
  const topicActions = [
    `Panduan Lengkap Cara Unduh Resmi dan Pemasangan Aplikasi di ${appOS}`,
    `Informasi Pembaruan Versi Terbaru dan Peningkatan Stabilitas Sistem`,
    `Berkas Paket Instalasi Terverifikasi Aman dan Bebas dari Ancaman Malware`,
    `Panduan Lengkap Proses Unduh dan Akses Tautan Resmi yang Aman`,
    `Layanan Pusat Unduhan dan Akses Cepat File Aplikasi Perangkat`,
    `Informasi Rilis Versi Terbaru dan Catatan Pembaruan Sistem untuk ${appOS}`,
    `Solusi Praktis dan Panduan Pemasangan Aplikasi Resmi Tanpa Kendala`,
    `Dokumentasi Teknis dan Spesifikasi Dukungan Kompatibilitas Perangkat`,
    `Pusat Layanan Unduhan dan Tautan Alternatif Resmi yang Terpercaya`,
    `Katalog Informasi Lengkap dan Prosedur Keamanan Pemasangan Aplikasi`
  ];

  for (let i = 0; i < 12; i++) {
    const currentBrandName = brandNames[(i + 1) % brandCount];
    const brandSlug = currentBrandName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomUriSlug = `${baseUrl}/store/apps/details/${categorySlug}/${brandSlug}`;
    
    const selectedAction = topicActions[i % topicActions.length];
    const title = `${currentBrandName} - ${selectedAction}`;

    relatedTopics.push({
      title: title,
      slug: randomUriSlug
    });
  }

  return { similarApps, relatedTopics };
}
