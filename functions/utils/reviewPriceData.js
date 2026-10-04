import { generateCRC32Like } from './parser.js';

class SeededRandom {
  constructor(seed) {
    this.seed = Math.abs(seed) % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
  rand(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

// 1. Get Price Data
export function getPriceData(uniqueKey) {
  const uriHash = parseInt(generateCRC32Like(uniqueKey), 16) || 12345;
  const rng = new SeededRandom(uriHash);

  const isFree = rng.rand(1, 10) > 8;
  let appPrice = "0";

  if (!isFree) {
    const randomMultiplier = rng.rand(3, 50);
    appPrice = String(randomMultiplier * 5000);
  }

  return {
    appPrice,
    priceCurrency: "IDR",
    isFree
  };
}

// 2. Get Reviews Data (Manual Array Version)
export async function getReviewsData(uniqueKey, brandName, appOS = 'Android', appSize = '15 MB') {
  const formattedBrand = brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase();
  
  const names = [
    'Raka Al Ghifari', 'Nabila Salsabila', 'Zahra Aulia', 'Farel Prayoga', 'Keanu Reivandra',
    'Aurel Hermansyah', 'Bagas Dwi Putra', 'Cika Lestari', 'Dimas Anggara', 'Elang Mahawira',
    'Fathan Al Farizi', 'Gita Gutawa', 'Haikal Hakim', 'Iqbaal Ramadhan', 'Jihan Audia',
    'Keysha Aurelia', 'Luthfi Harits', 'Maura Tiara', 'Naufal Abiyyu', 'Oktavian Pasha',
    'Pratama Arhan', 'Qiana Zahira', 'Raffi Ahmad', 'Salma Salsabil', 'Tegar Septian',
    'Ufairah Zahra', 'Vanesha Prescilla', 'Wahyudi Pratama', 'Xavier Danendra', 'Yusuf Mahardika',
    'Zidan Al Ghifari', 'Aldo Satria', 'Bella Clarissa', 'Candra Wijaya', 'Devi Anggraini',
    'Baskara Putra', 'Nadin Amizah', 'Hindia Baskara', 'Sal Priadi', 'Danilla Riyadi',
    'Kunto Aji', 'Ardhito Pramono', 'Pamungkas Nugraha', 'Fiersa Besari', 'Feby Putri',
    'Tulus Rasyad', 'Isyana Sarasvati', 'Rizky Febian', 'Mahalini Raharja', 'Tiara Andini',
    'Ziva Magnolya', 'Lyodra Ginting', 'Keisya Levronka', 'Brisia Jodie', 'Marion Jola',
    'Chiki Fawzi', 'Juicy Luicy', 'Kaleb J', 'Nuca IDIOT', 'Virgoun Putra',
    'Denny Caknan', 'Happy Asmara', 'Ndarboy Genk', 'Guyon Waton', 'Dewa Budjana',
    'Jess No Limit', 'Lemon RRQ', 'Oura Gaming', 'Jonathan Liandi', 'BTR Ryzen',
    'Luxxy Evos', 'Zuxxy M', 'Skylar Lemon', 'Vior Cute', 'Moba Zilion',
    'Windah Basudara', 'MiawAug Gaming', 'Ewing HD', 'Sarah Viloid', 'Rachel Cia',
    'Liziq Gaming', 'Dyland PROS', 'Frontal Gaming', 'Budi01 Gaming', 'LetDa Hyper',
    'Kuliah Malam', 'Erlan Annisa', 'Bang Jago', 'Kimi Hime', 'Jessica Jane',
    'Chateez Kakak', 'Catheez Cute', 'Alshad Ahmad', 'Ria Ricis', 'Atta Halilintar',
    'Alif Cepmek', 'Bagus Tik Tok', 'Dimas Beck', 'Jerome Polin', 'Tohpati Nugroho',
    'Fadly Faisal', 'Fuji An', 'Azka Corbuzier', 'Nada Tarina', 'Bercyandra Putra',
    'Bima Sastrawan', 'Reza Arap', 'Deddy Corbuzier', 'Pandji Pragiwaksono', 'Marshel Widianto',
    'Kiky Saputri', 'Indra Jegel', 'Rigen Rakelna', 'Ananta Rispo', 'Lolox Medan',
    'Coki Pardede', 'Tretan Muslim', 'Boris Bokir', 'Mamat Alkatiri', 'Awkarin Novilda',
    'Erika Carlina', 'Keanu Agl', 'Dara Arafah', 'Fadil Jaidi', 'Mega Dena',
    'Marvelio Satria', 'Zefanya Aurel', 'Vionicka Putri', 'Reyhan Mahardika', 'Nathaniel Xavier',
    'Alesha Zahra', 'Kenzie Alfarezi', 'Shanum Malika', 'Gibran Rakabuming', 'Kaesang Pangarep',
    'Jan Ethes', 'Alula Latisha', 'Khadijah Aulia', 'Muhammad Al Fatih', 'Ibrahimovic Putra',
    'Cristiano Ronaldo', 'Lionel Messi', 'Neymar Jr', 'Kylian Mbappe', 'Jude Bellingham',
    'Erling Haaland', 'Pedri Gonzalez', 'Gavi Paez', 'Jamal Musiala', 'Bukayo Saka',
    'Marcus Rashford', 'Cole Palmer', 'Phil Foden', 'Rodri Hernandez', 'William Saliba',
    'Declan Rice', 'Martin Odegaard', 'Kai Havertz', 'Gabriel Martinelli', 'Leandro Trossard'
  ];

  const commentTemplates = [
    "Aplikasi {brand} ini sangat luar biasa. Berjalan mulus di perangkat {os} saya. Ukuran {size} sangat sepadan dengan fiturnya!",
    "Fitur-fitur di {brand} update versi terbaru ini jauh lebih stabil dibanding sebelumnya. Proses unduh juga cepat.",
    "Sangat terbantu berkat {brand}. Antarmukanya ramah pengguna dan tidak bikin perangkat lemot. Recommended!",
    "Awalnya ragu, ternyata {brand} bekerja dengan sangat baik di OS {os}. Ukurannya cuma {size} tapi performanya mantap.",
    "Terima kasih pengembang, {brand} berjalan lancar tanpa kendala berarti. Sangat layak dicoba untuk kebutuhan harian.",
    "Performa {brand} di luar dugaan sangat responsif. Sangat cocok untuk pengguna {os} yang mencari efisiensi.",
    "Tidak mengalami lag sama sekali selama menggunakan {brand}. Ukurannya yang {size} tergolong sangat ramah memori.",
    "Aplikasi {brand} ini benar-benar juara! Proses instalasi bersih, cepat, dan langsung bisa dipakai tanpa ribet.",
    "Sistem navigasi di {brand} sangat intuitif. Pengguna baru {os} pasti langsung paham cara pakainya.",
    "Udah coba berbagai aplikasi sejenis, tapi {brand} di versi {os} ini adalah yang paling stabil dan minim bug.",
    "Kecepatan muat {brand} patut diacungi jempol. Hemat baterai dan tidak bikin HP panas sama sekali.",
    "Pembaruan rutin pada {brand} membuktikan kalau developer sangat serius menjaga kualitas aplikasinya.",
    "Sangat puas pakai {brand}. Fitur-fiturnya fungsional dan tidak banyak iklan mengganggu seperti aplikasi lain.",
    "Kestabilan koneksi dan pemrosesan data di {brand} sangat teruji. Mantap untuk perangkat {os}!",
    "Ukuran file {size} terasa sangat ringkas mengingat banyaknya fitur keren yang ditawarkan oleh {brand}.",
    "Antarmuka {brand} sangat bersih dan modern. Nyaman dipandang lama-lama di layar {os}.",
    "Fitur andalan di {brand} bekerja sesuai ekspektasi. Sangat membantu aktivitas harian saya.",
    "Gak salah pilih unduh {brand}. Semua menu tersusun rapi dan mudah diakses bahkan oleh pemula.",
    "Proses sinkronisasi di {brand} super cepat. Data aman dan tidak pernah ada file yang korup.",
    "Aplikasi {brand} ini solusi paling praktis untuk kebutuhan di perangkat {os}.",
    "Bener-bener penyelamat! {brand} punya fitur lengkap dengan ukuran yang cuma {size}.",
    "Fitur pencarian di {brand} sangat akurat dan cepat menemukan apa yang kita cari.",
    "Suka banget sama tata letak tombol di {brand}, sangat ergonomis untuk pengoperasian satu tangan.",
    "Tidak perlu keahlian khusus untuk mengoperasikan {brand}. Semua fiturnya sangat user-friendly.",
    "Kualitas grafis dan respons sentuhan di {brand} terasa sangat halus di perangkat {os}.",
    "Aplikasi {brand} berjalan stabil di latar belakang tanpa menguras kapasitas RAM.",
    "Fitur offline di {brand} sangat membantu ketika sinyal internet sedang bermasalah.",
    "Sangat menghemat waktu dalam menyelesaikan tugas berkat efisiensi dari {brand}.",
    "Integrasi {brand} dengan sistem {os} berjalan sempurna tanpa ada konflik izin akses.",
    "Pilihan warna dan tema di {brand} sangat elegan, tidak membuat mata cepat lelah.",
    "Aman, bersih dari malware, dan {brand} terbukti sangat terpercaya untuk perangkat {os}.",
    "Privasi data di {brand} terjaga dengan baik. Proses login juga sangat aman dan cepat.",
    "Udah scan pakai antivirus, dan file {brand} berukuran {size} ini 100% bersih dan aman.",
    "Situs resmi {brand} memang paling bisa diandalkan untuk mendapatkan file unduhan yang valid.",
    "Tidak ada izin mencurigakan yang diminta oleh {brand} saat dipasang di {os}.",
    "Sistem enkripsi di {brand} membuat saya merasa tenang saat memasukkan data penting.",
    "Pembaruan keamanan di {brand} selalu tepat waktu merespons celah sistem.",
    "Dukungan server yang kuat membuat {brand} tidak pernah mengalami down saat diakses.",
    "Unduh langsung dari link resminya dijamin aman dan bebas dari file modifikasi berbahaya.",
    "Kredibilitas {brand} sebagai aplikasi pilihan di {os} sudah tidak diragukan lagi.",
    "Sangat menghargai komitmen pengembang {brand} dalam menjaga keamanan data pengguna.",
    "Tidak ada pop-up iklan nyasar yang mengganggu kenyamanan privasi di {brand}.",
    "Validasi akun di {brand} sangat ketat namun tetap mudah dilalui oleh pengguna asli.",
    "Perlindungan berlapis pada {brand} memberikan rasa aman ekstra bagi pemilik perangkat {os}.",
    "Sistem proteksi dari {brand} terbukti tangguh menangkal berbagai upaya akses ilegal.",
    "Top banget pokoknya! Wajib install {brand} buat kalian para pengguna {os}.",
    "Puas banget pakai {brand}. Worth it banget dengan ukuran {size} yang ringkas.",
    "Teman-teman kantor pada nanyain pakai aplikasi apa, langsung saya rekomendasikan {brand}.",
    "Terbaik di kelasnya! {brand} mengalahkan aplikasi lain yang ukurannya jauh lebih besar.",
    "Mantap jiwa! {brand} bikin produktivitas meningkat drastis minggu ini.",
    "Gak nyesel download {brand}. Bakal jadi aplikasi wajib di perangkat {os} saya.",
    "Keren parah! Fitur update terbaru dari {brand} bikin makin betah menggunakannya.",
    "Recommended banget buat yang cari kepraktisan di perangkat {os}.",
    "Sumpah ini keren banget, {brand} bekerja luar biasa walau spesifikasi HP standar.",
    "Aplikasi {brand} adalah penemuan terbaik bulan ini buat saya.",
    "Pilihan cerdas buat yang butuh aplikasi handal berukuran {size}.",
    "Kualitas {brand} jauh melampaui ekspektasi awal saya.",
    "Sungguh pengalaman pengguna yang menyenangkan bersama {brand}.",
    "Sukses terus buat developer {brand}, aplikasinya benar-benar luar biasa!",
    "Dihadirkan dengan fitur premium, {brand} membuktikan kualitasnya di {os}.",
    "Respon customer service dan sistem di {brand} sangat cepat tanggap.",
    "Kinerja multi-tasking perangkat {os} tidak terganggu sama sekali saat {brand} aktif.",
    "Proses unduh file {size} dari {brand} cuma butuh waktu beberapa detik saja.",
    "Tampilan animasi transisi di {brand} sangat halus dan memanjakan mata.",
    "Hemat kuota data, {brand} tidak banyak menyedot internet di latar belakang.",
    "Sangat membantu meringankan pekerjaan harian lewat fitur otomatisasi di {brand}.",
    "Kestabilan frame rate pada {brand} patut diacungi jempol untuk ukuran aplikasi {size}.",
    "Kemudahan backup data di {brand} sangat menyelamatkan saat ganti perangkat.",
    "Dokumentasi dan panduan penggunaan di dalam {brand} sangat jelas dan informatif.",
    "Tidak pernah menemui kendala force close semenjak beralih ke {brand}.",
    "Kombinasi warna kontras pada antarmuka {brand} sangat nyaman dibaca.",
    "Fitur notifikasi di {brand} sangat akurat dan tidak pernah terlambat.",
    "Kapasitas cache {brand} sangat ramah dan mudah dibersihkan secara berkala.",
    "Dukungan penuh untuk berbagai resolusi layar di perangkat {os}.",
    "Aplikasi {brand} membuktikan bahwa ukuran kecil bukan berarti minim fitur.",
    "Pengalaman interaksi yang sangat mulus sejak pertama kali membuka {brand}.",
    "Kestabilan server {brand} patut diacungi jempol, jarang sekali gangguan.",
    "Solusi cerdas bagi pengguna {os} yang mendambakan efisiensi tingkat tinggi.",
    "Sangat menginspirasi melihat perkembangan fitur-fitur baru di {brand}.",
    "Keputusan terbaik menginstal {brand} di perangkat utama saya.",
    "Aplikasi {brand} berjalan tanpa celah di ekosistem {os}.",
    "Kemudahan akses dalam satu genggaman benar-benar diwujudkan oleh {brand}.",
    "Performa stabil meski digunakan dalam durasi yang cukup lama.",
    "Penyempurnaan pada versi terkini {brand} terasa sangat signifikan.",
    "Apresiasi tinggi untuk tim pengembang {brand} atas dedikasinya.",
    "Kenyamanan bernavigasi menjadi nilai jual utama dari {brand}.",
    "Efisiensi daya baterai saat menjalankan {brand} sangat luar biasa.",
    "Tidak ada kata bosan menggunakan {brand} berkat variasi fiturnya.",
    "Standar kualitas tinggi yang berhasil dipertahankan oleh {brand}.",
    "Pilihan paling rasional untuk kebutuhan aplikasi di perangkat {os}."
  ];

  const baseHash = parseInt(generateCRC32Like(uniqueKey), 16) || 12345;
  const brandHash = parseInt(generateCRC32Like(brandName), 16) || 54321;
  const pageSeed = baseHash + brandHash;

  const rng = new SeededRandom(pageSeed);
  const totalReviews = rng.rand(5, 7);

  const reviews = [];
  const reviewSchemas = [];

  for (let i = 0; i < totalReviews; i++) {
    const starsCount = rng.rand(4, 5);
    const templateIndex = rng.rand(0, commentTemplates.length - 1);
    const randomTemplate = commentTemplates[templateIndex] || commentTemplates[0];

    const commentText = randomTemplate
      .replace(/\{brand\}/g, formattedBrand)
      .replace(/\{os\}/g, appOS)
      .replace(/\{size\}/g, appSize);

    const nameIndex = rng.rand(0, names.length - 1);
    const reviewerName = names[nameIndex] || "Pengguna Setia";
    const timeAgo = rng.rand(1, 6) + ' hari yang lalu';
    const avatarRand = rng.rand(1, 70);

    reviews.push({
      name: reviewerName,
      avatar: avatarRand,
      time: timeAgo,
      stars: '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount),
      comment: commentText
    });

    reviewSchemas.push({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": String(starsCount)
      },
      "author": {
        "@type": "Person",
        "name": reviewerName
      },
      "reviewBody": commentText
    });
  }

  return { reviews, reviewSchemas };
}

// 3. Get Paragraphs Data (Manual Array Version)
export async function getParagraphsData(
  uniqueKey, 
  brandName = '', 
  appDownloads = '100.000+', 
  appSize = '15 MB', 
  appOS = 'Android'
) {
  const masterParagraphs = [
    "Selamat datang di portal resmi unduhan <strong>{brand}</strong>. Rasakan sensasi bermain di situs slot gacor terpercaya dengan peluang maxwin dan perkalian fantastis hingga x1000 setiap harinya.",
    "Dapatkan aplikasi <strong>{brand}</strong> sekarang juga untuk akses login yang lebih cepat, anti-blokir, dan jaminan gampang menang dalam setiap putaran permainan slot online.",
    "Bagi para pencinta slot gacor, <strong>{brand}</strong> menghadirkan pengalaman bermain tanpa batas dengan RTP tinggi, scatter melimpah, dan fitur bonus melimpah ruah.",
    "Nikmati kemudahan daftar akun resmi <strong>{brand}</strong> melalui aplikasi seluler berukuran {size} ini. Platform game online paling gacor dengan sistem keamanan tingkat tinggi.",
    "Aplikasi <strong>{brand}</strong> dirancang khusus untuk para pemburu JP paus. Dapatkan link alternatif resmi terbaru langsung dari genggaman perangkat {os} Anda.",
    "Bergabunglah bersama ribuan pemain aktif lainnya di <strong>{brand}</strong>. Nikmati berbagai pilihan provider slot gacor terlengkap dengan tingkat kemenangan (*winrate*) tertinggi.",
    "Proses login <strong>{brand}</strong> kini jauh lebih praktis dan aman. Temukan jajaran game slot gacor hari ini dengan modal kecil potensi maxwin jutaan rupiah.",
    "Tingkatkan peluang JP Anda bersama <strong>{brand}</strong>. Aplikasi ringan berukuran {size} yang menyajikan performa stabil untuk bermain slot online tanpa lag.",
    "Miliki segera aplikasi resmi <strong>{brand}</strong> untuk menikmati akses link alternatif, proses deposit cepat 24 jam, serta fitur slot gacor gampang menang.",
    "Solusi terbaik bagi Anda yang mencari situs slot gacor resmi. <strong>{brand}</strong> siap memberikan pengalaman bermain terbaik di perangkat {os} kesayangan Anda.",

    "Lebih dari {downloads} pengguna telah mempercayakan taruhan slot online mereka di <strong>{brand}</strong>. Unduh aplikasinya dan rasakan sensasi perkalian maxwin x500 hingga x1000.",
    "Dengan ukuran file sebesar {size}, <strong>{brand}</strong> memberikan akses instan ke berbagai pilihan permainan slot gacor hari ini tanpa membebani memori internal perangkat.",
    "Kompatibel sempurna dengan sistem operasi {os}, aplikasi <strong>{brand}</strong> menjamin kelancaran putaran spin saat Anda memburu scatter hitam maupun petir merah.",
    "Tim pengembang terus memperbarui sistem keamanan <strong>{brand}</strong> untuk memastikan kelancaran transaksi, proses daftar kilat, serta kenyamanan member setia.",
    "Antarmuka ramah pengguna (user-friendly) pada <strong>{brand}</strong> memudahkan pemula sekalipun untuk melakukan deposit, klaim bonus, dan memilih game slot gacor favorit.",
    "Jangan lewatkan link alternatif resmi <strong>{brand}</strong>. Dapatkan update aplikasi versi terbaru untuk jaminan login anti-ribet dan bebas nawala.",
    "Nikmati fitur putaran turbo dan manual yang responsif di dalam aplikasi <strong>{brand}</strong>, dirancang khusus untuk memaksimalkan peluang JP paus Anda.",
    "Situs slot gacor <strong>{brand}</strong> terbukti kredibel dengan sistem fair play 100%. Unduh aplikasinya sekarang dan buktikan sendiri gacornya hari ini!",
    "Dapatkan kemudahan akses login dan daftar melalui aplikasi resmi <strong>{brand}</strong> yang sudah diunduh oleh lebih dari {downloads} pemain setia.",
    "Raih kemenangan maksimal bersama <strong>{brand}</strong>. Aplikasi game online terpercaya yang menyajikan ribuan pilihan slot gacor dengan jekpot progresif.",
    
    "Selamat datang di halaman unduhan resmi. Aplikasi <strong>{brand}</strong> dirancang khusus untuk memberikan pengalaman pengguna yang luar biasa di perangkat Anda.",
    "Temukan kemudahan dalam satu genggaman bersama <strong>{brand}</strong>. Platform pilihan terbaik yang siap menemani aktivitas digital harian Anda.",
    "Selamat datang! <strong>{brand}</strong> hadir sebagai solusi inovatif yang menjawab seluruh kebutuhan modern pengguna di era digital saat ini.",
    "Akses tautan unduhan aman untuk <strong>{brand}</strong> di sini. Rasakan sendiri performa luar biasa yang sudah diandalkan oleh banyak pengguna.",
    "Selamat datang di portal unduh terpercaya. Dapatkan aplikasi <strong>{brand}</strong> versi paling stabil dan mutakhir secara instan.",
    "Mulai petualangan digital Anda bersama <strong>{brand}</strong>. Aplikasi unggulan yang menawarkan kenyamanan serta efisiensi tingkat tinggi.",
    "Selamat datang di pusat unduhan aplikasi <strong>{brand}</strong>. Kami menyediakan akses cepat, aman, dan bebas dari file berbahaya.",
    "Eksplorasi fitur-fitur menarik dari <strong>{brand}</strong> sekarang juga. Solusi cerdas untuk mengoptimalkan perangkat Anda.",
    "Selamat datang! Dapatkan pengalaman navigasi tanpa batas melalui aplikasi andalan <strong>{brand}</strong>.",
    "Portal resmi unduh <strong>{brand}</strong>. Nikmati kemudahan akses serta pembaruan sistem secara berkala.",

    "Lebih dari {downloads} pengguna aktif telah mengunduh dan merasakan sendiri kehebatan serta kemudahan yang ditawarkan oleh aplikasi ini.",
    "Popularitas <strong>{brand}</strong> terus meningkat, terbukti dengan lebih dari {downloads} unduhan berhasil dicatatkan dalam waktu singkat.",
    "Bergabunglah dengan komunitas besar yang melibatkan lebih dari {downloads} pengguna aktif di seluruh Indonesia menggunakan <strong>{brand}</strong>.",
    "Kepercayaan publik terhadap <strong>{brand}</strong> sangat tinggi, dengan angka unduhan menembus lebih dari {downloads} kali di berbagai perangkat.",
    "Telah diunduh lebih dari {downloads} kali, membuktikan bahwa <strong>{brand}</strong> adalah aplikasi paling dicari saat ini.",
    "Statistik membuktikan lebih dari {downloads} pengguna merasa puas setelah menginstal <strong>{brand}</strong> di perangkat mereka.",
    "Menjadi pilihan utama masyarakat dengan total unduhan melampaui {downloads} pengguna setia.",
    "Rekor unduhan mencapai lebih dari {downloads} kali menjadikan <strong>{brand}</strong> pemimpin di kelasnya.",
    "Ribuan orang telah membuktikan kualitasnya; kini giliran Anda bergabung bersama {downloads} pengguna aktif lainnya.",
    "Dukungan komunitas yang masif dengan lebih dari {downloads} unduhan aktif setiap harinya.",

    "Dengan ukuran file sebesar {size}, <strong>{brand}</strong> sangat ringan, efisien, dan tidak akan menghabiskan ruang penyimpanan memori internal perangkat Anda.",
    "Hadir dengan kapasitas file hanya {size}, aplikasi ini dirancang hemat penyimpanan tanpa mengorbankan kualitas performa.",
    "Ukuran file {size} pada <strong>{brand}</strong> memastikan proses unduh berjalan cepat bahkan dengan koneksi internet standar.",
    "Tidak perlu khawatir memori penuh, sebab <strong>{size}</strong> adalah ukuran optimal yang diusung oleh <strong>{brand}</strong>.",
    "Efisiensi ruang penyimpanan terbaik berkat ukuran ringkas {size} yang dioptimalkan langsung oleh pengembang.",
    "File ringan berukuran {size} membuat <strong>{brand}</strong> sangat ramah bagi perangkat dengan spesifikasi penyimpanan terbatas.",
    "Nikmati fitur kelas berat dalam balutan ukuran file minimalis sebesar {size}.",
    "Pengunduhan instan dalam hitungan detik berkat ukuran {size} yang sangat ramah kuota data.",
    "Optimasi memori tingkat lanjut memastikan {size} dari <strong>{brand}</strong> berjalan tanpa membebani sistem.",
    "Ukuran compact {size} menjadikan <strong>{brand}</strong> pilihan paling rasional untuk efisiensi ruang HP.",

    "Kompatibel dengan sistem operasi {os}, aplikasi ini menjamin performa yang stabil, responsif, dan bebas dari kendala lag saat dijalankan.",
    "Didesain khusus agar berjalan mulus pada platform {os}, menghadirkan stabilitas sistem tanpa celah.",
    "Dukungan penuh terhadap perangkat berbasis {os} membuat <strong>{brand}</strong> dapat dioperasikan secara optimal.",
    "Nikmati integrasi sempurna antara <strong>{brand}</strong> dan ekosistem {os} untuk pengalaman terbaik.",
    "Performa tanpa kompromi di perangkat {os} kesayangan Anda berkat optimalisasi kode tingkat tinggi.",
    "Dirancang secara presisi untuk pengguna {os}, menjamin kompatibilitas menyeluruh di berbagai tipe perangkat.",
    "Stabilitas operasional di atas {os} sudah teruji melalui berbagai tahapan uji coba ketat.",
    "Jalankan aplikasi dengan lancar jaya di atas platform {os} tanpa takut terjadi force close.",
    "Sinkronisasi sistem operasi {os} dengan <strong>{brand}</strong> bekerja secara sinkron dan efisien.",
    "Solusi aplikasi paling stabil untuk menunjang aktivitas di perangkat ber-OS {os}.",

    "Tim pengembang terus memberikan pembaruan rutin untuk memastikan keamanan, peningkatan fitur baru, serta kompatibilitas penuh dengan versi perangkat terkini.",
    "Pembaruan berkala selalu dihadirkan untuk menjaga performa <strong>{brand}</strong> tetap di level tertinggi.",
    "Komitmen developer dalam merilis patch dan update memastikan <strong>{brand}</strong> bebas dari celah keamanan.",
    "Nikmati peningkatan fitur secara berkala melalui update otomatis yang disiapkan oleh tim ahli.",
    "Dukungan teknis jangka panjang menjamin <strong>{brand}</strong> selalu relevan dengan perkembangan teknologi masa kini.",
    "Penyempurnaan sistem yang konsisten menjadikan <strong>{brand}</strong> semakin handal dari waktu ke waktu.",
    "Perbaikan bug dan peningkatan stabilitas rutin dilakukan demi kepuasan mutlak pengguna setia.",
    "Selalu selangkah lebih maju dengan versi pembaruan terbaru yang dioptimalkan khusus untuk Anda.",
    "Pengembangan aktif oleh tim profesional memastikan <strong>{brand}</strong> tidak pernah ketinggalan zaman.",
    "Inovasi tiada henti dari pengembang demi menyajikan kualitas terbaik di setiap rilisnya.",

    "Proses pemasangan sangat mudah dan cepat. Anda hanya memerlukan beberapa ketukan saja untuk langsung menikmati seluruh fitur unggulan yang tersedia.",
    "Instalasi tanpa ribet! Cukup unduh, pasang, dan <strong>{brand}</strong> langsung siap digunakan dalam hitungan detik.",
    "Panduan instalasi yang praktis memudahkan siapa saja untuk memasang aplikasi ini tanpa bantuan teknis.",
    "Hanya butuh beberapa langkah sederhana untuk menyelesaikan proses instalasi <strong>{brand}</strong> di perangkat Anda.",
    "Kemudahan proses setup menjadi prioritas agar Anda bisa langsung merasakan manfaatnya.",
    "Tidak ada konfigurasi rumit; pasang aplikasi dan langsung nikmati seluruh fasilitas di dalamnya.",
    "Prosedur unduh dan pasang yang ramah pengguna membuat <strong>{brand}</strong> sangat praktis diakses.",
    "Hemat waktu dengan sistem instalasi kilat yang disematkan pada paket unduhan ini.",
    "Semua dibuat serba instan, dari tombol unduh hingga beresnya proses instalasi di HP Anda.",
    "Pemasangan bersih dan aman tanpa meninggalkan file sampah yang mengganggu sistem.",

    "Nikmati antarmuka yang modern dan ramah pengguna (user-friendly), dirancang secara khusus agar pemula sekalipun dapat mengoperasikannya tanpa hambatan.",
    "Desain UI/UX yang elegan membuat eksplorasi menu di dalam <strong>{brand}</strong> terasa sangat menyenangkan.",
    "Tampilan visual yang bersih, futuristik, dan tidak bikin mata cepat lelah saat menatap layar.",
    "Navigasi intuitif memastikan setiap tombol dan fitur pada <strong>{brand}</strong> mudah ditemukan oleh siapa saja.",
    "Sentuhan desain modern berpadu dengan responsivitas tinggi demi kenyamanan maksimal pengguna.",
    "Tata letak menu yang tertata rapi memberikan pengalaman interaksi yang sangat natural.",
    "Antarmuka responsif yang menyesuaikan ukuran layar perangkat Anda secara otomatis.",
    "Kenyamanan visual berstandar tinggi yang memanjakan mata di setiap sudut aplikasinya.",
    "Eksperiens pengguna diutamakan melalui desain interaktif yang sangat minim hambatan.",
    "Tampilan berkelas premium yang bisa Anda nikmati secara cuma-cuma melalui <strong>{brand}</strong>.",

    "Jangan lewatkan kesempatan untuk mendapatkan versi terbaru dari <strong>{brand}</strong> langsung melalui tautan unduhan aman yang telah kami sediakan di halaman ini.",
    "Segera unduh sekarang juga dan buktikan sendiri berbagai keunggulan eksklusif yang ditawarkan.",
    "Ambil tautan resminya hari ini dan jadilah bagian dari jutaan pengguna cerdas lainnya.",
    "Klik tombol unduh di bawah untuk memulai pengalaman digital baru yang lebih menyenangkan bersama <strong>{brand}</strong>.",
    "Jangan tunggu nanti, amankan file instalasi <strong>{brand}</strong> versi terkini Anda sekarang juga!",
    "Dapatkan akses penuh tanpa batas dengan mengunduh aplikasi resmi ini dari link terpercaya.",
    "Waktunya beralih ke yang lebih baik. Unduh <strong>{brand}</strong> dan rasakan perbedaannya!",
    "Tautan unduhan tercepat dan teraman sudah siap menanti Anda di halaman ini.",
    "Maksimalkan potensi perangkat Anda dengan menginstal <strong>{brand}</strong> hari ini.",
    "Ambil langkah awal menuju efisiensi digital dengan mengunduh <strong>{brand}</strong> sekarang."
  ];

  const limitParagraphs = 5;
  let tempParagraphs = masterParagraphs.map((paragraph, index) => {
    const sortKey = parseInt(generateCRC32Like(`${index}_${uniqueKey}`), 16) || index;
    return { paragraph, sortKey };
  });

  tempParagraphs.sort((a, b) => a.sortKey - b.sortKey);

  const rawSelected = tempParagraphs.slice(0, limitParagraphs);
  const selectedParagraphs = rawSelected.map(item => {
    let pText = item.paragraph;
    if (typeof pText === 'string') {
      const formattedBrand = brandName ? brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase() : 'Aplikasi';
      pText = pText
        .replace(/\{brand\}/g, formattedBrand)
        .replace(/\{downloads\}/g, appDownloads)
        .replace(/\{size\}/g, appSize)
        .replace(/\{os\}/g, appOS);
    }
    return pText;
  });

  return selectedParagraphs;
}

// 4. Get What's New Data (Manual Array Version)
export async function getWhatsNewData(uniqueKey, brandName = '', appOS = 'Android', appSize = '15 MB') {
  const masterWhatsNew = [
    "Peningkatan performa server dan kecepatan akses secara keseluruhan untuk <strong>{brand}</strong>.",
    "Optimalisasi kinerja sistem agar berjalan lebih mulus dan ringan di perangkat {os}.",
    "Pembaruan antarmuka pengguna (UI/UX) yang dirancang lebih responsif, elegan, dan modern.",
    "Perbaikan bug minor dan peningkatan stabilitas aplikasi dari versi sebelumnya.",
    "Penambahan fitur sinkronisasi data otomatis yang lebih cepat dan aman.",
    "Peningkatan sistem keamanan enkripsi untuk melindungi data privasi pengguna.",
    "Efisiensi penggunaan memori RAM dan baterai agar lebih hemat saat aplikasi beroperasi.",
    "Pembaruan modul dukungan multibahasa untuk kenyamanan pengguna yang lebih luas.",
    "Penambahan opsi penyesuaian tema tampilan sesuai preferensi pengguna.",
    "Pembersihan file cache otomatis demi menjaga performa tetap optimal setiap saat.",
    "Peningkatan kecepatan koneksi untuk meminimalisir jeda saat memuat data utama.",
    "Optimalisasi skrip internal agar konsumsi data internet jauh lebih hemat.",
    "Pembaruan komponen inti untuk mendukung kompatibilitas penuh dengan perangkat versi terbaru.",
    "Penyempurnaan transisi animasi menu agar terasa lebih halus di layar sentuh.",
    "Peningkatan sistem manajemen memori agar tidak mudah terjadi force close saat multitasking.",
    "Perbaikan sistem penanganan kesalahan (*error handling*) yang lebih responsif.",
    "Pembaruan pustaka sistem pihak ketiga guna mendongkrak stabilitas operasional harian.",
    "Penyelarasan konfigurasi latar belakang agar sinkronisasi data berjalan tanpa hambatan.",
    "Peningkatan resolusi elemen visual agar tampil tajam di berbagai ukuran layar.",
    "Optimalisasi waktu muat awal (*cold start*) saat aplikasi pertama kali dibuka.",

    "Pembaruan jalur akses link alternatif resmi <strong>{brand}</strong> agar terbebas dari pemblokiran nawala.",
    "Optimalisasi server khusus untuk memuat daftar game slot gacor hari ini dengan lebih cepat.",
    "Peningkatan kestabilan proses login member agar masuk ke akun jadi jauh lebih instan.",
    "Penyempurnaan sistem pendaftaran akun baru (*register*) agar proses verifikasi makin kilat.",
    "Penambahan rute koneksi alternatif demi menjamin kelancaran akses ke situs <strong>{brand}</strong> 24 jam.",
    "Optimalisasi fitur pencarian untuk menemukan jenis slot gacor dan provider favorit dengan mudah.",
    "Pembaruan modul keamanan transaksi untuk mendukung kelancaran deposit dan penarikan dana.",
    "Peningkatan kestabilan performa saat berburu maxwin dan perkalian besar di jam-jam sibuk.",
    "Penambahan informasi pembaruan RTP live langsung melalui halaman utama aplikasi.",
    "Penyempurnaan fitur notifikasi instan untuk info bonus harian dan event slot gacor terkini.",
    "Peningkatan kecepatan unduh file pembaruan langsung dari server resmi <strong>{brand}</strong>.",
    "Optimalisasi navigasi menu utama agar akses ke menu daftar dan login semakin praktis.",
    "Pembaruan sistem anti-lag khusus untuk memaksimalkan putaran spin tanpa gangguan.",
    "Penambahan pintasan cepat untuk menghubungi layanan pelanggan (*live chat*) 24/7.",
    "Penyempurnaan layout tampilan khusus pengguna mobile agar nyaman digenggam satu tangan.",
    "Pembaruan protokol enkripsi data akun untuk mencegah risiko akses tidak sah.",
    "Optimalisasi performa grafis dalam game agar animasi guliran gulungan slot makin mulus.",
    "Peningkatan stabilitas koneksi jaringan seluler dan Wi-Fi secara otomatis.",
    "Pembaruan sistem caching halaman untuk menghemat kuota internet pengguna setia.",
    "Penyempurnaan fitur riwayat permainan agar pemain dapat memantau putaran terakhir dengan akurat.",

    "Perbaikan layout tata letak tombol pada layar beresolusi kecil maupun tablet.",
    "Pembaruan ikon aplikasi agar terlihat lebih segar, modern, dan profesional.",
    "Penambahan fitur mode malam (*dark mode*) otomatis mengikuti pengaturan sistem perangkat.",
    "Optimalisasi modul kompresi data untuk mempercepat proses unduh file berukuran {size}.",
    "Penyempurnaan integrasi sistem dengan berbagai versi sistem operasi {os}.",
    "Pembersihan modul kode usang untuk merampingkan keseluruhan struktur aplikasi.",
    "Peningkatan responsivitas tombol interaktif saat menerima sentuhan cepat.",
    "Pembaruan panduan bantuan dan FAQ interaktif di dalam menu aplikasi.",
    "Penambahan fitur salin tautan cepat untuk membagikan info <strong>{brand}</strong> ke teman.",
    "Optimalisasi manajemen daya agar perangkat tidak cepat panas saat digunakan dalam durasi lama.",
    "Penyempurnaan sistem backup otomatis untuk mengamankan preferensi pengguna.",
    "Pembaruan sertifikat keamanan SSL guna menjamin koneksi end-to-end yang valid.",
    "Peningkatan kestabilan operasional saat beralih dari jaringan data ke Wi-Fi.",
    "Perbaikan kecil pada teks antarmuka agar informasi yang disampaikan lebih jelas.",
    "Optimalisasi alur navigasi dari halaman login menuju beranda utama.",
    "Pembaruan sistem pemantauan performa otomatis guna mendeteksi kendala secara dini.",
    "Penambahan variasi animasi pemuatan (*loading*) yang lebih dinamis dan interaktif.",
    "Penyempurnaan kompatibilitas audio dan efek suara dalam aplikasi.",
    "Peningkatan perlindungan privasi pengguna dari pelacakan pihak ketiga yang tidak diinginkan.",
    "Pembaruan sistem verifikasi perangkat untuk memastikan keamanan akses akun member.",
    "Optimalisasi kapasitas penyimpanan internal agar penggunaan ruang cache terkontrol.",
    "Penyempurnaan fitur keluar akun (*logout*) otomatis saat terdeteksi tidak aktif.",
    "Peningkatan kecepatan pemrosesan skrip JavaScript di latar belakang sistem.",
    "Perbaikan masalah kecil pada tampilan orientasi layar potret dan lanskap.",
    "Pembaruan database internal untuk mempercepat pengenalan versi perangkat baru.",
    "Penambahan opsi laporan kendala langsung dari menu pengaturan aplikasi.",
    "Optimalisasi struktur file instalasi agar proses pasang berjalan tanpa hambatan.",
    "Penyempurnaan sistem penyesuaian otomatis terhadap kualitas jaringan yang tersedia.",
    "Peningkatan stabilitas server utama saat menghadapi lonjakan trafik kunjungan.",
    "Pembaruan berkala rutin yang didedikasikan untuk kenyamanan maksimal seluruh pengguna <strong>{brand}</strong>."
  ];

  const uniqueHashNum = parseInt(generateCRC32Like(uniqueKey), 16) || 12345;
  let countWhatsNew = 4 + (uniqueHashNum % 3);
  if (countWhatsNew < 4) countWhatsNew = 4;

  let tempWhatsNew = masterWhatsNew.map((item, index) => {
    const sortKey = parseInt(generateCRC32Like(`${index}_${uniqueKey}`), 16) || index;
    return { item, sortKey };
  });

  tempWhatsNew.sort((a, b) => a.sortKey - b.sortKey);

  const rawSelected = tempWhatsNew.slice(0, countWhatsNew);
  return rawSelected.map(wrapper => {
    let item = wrapper.item;
    if (typeof item === 'string') {
      const formattedBrand = brandName ? brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase() : 'Aplikasi';
      item = item
        .replace(/\{brand\}/g, formattedBrand)
        .replace(/\{os\}/g, appOS)
        .replace(/\{size\}/g, appSize);
    }
    return item;
  });
}

// 5. Get Description Data (Baru Ditambahkan)
export function getDescriptionData(uniqueKey, brandName, pubHost = '') {
  const formattedBrand = brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase();
  let finalDescription = '';

  const fallbackTemplates = [
    `Unduh aplikasi resmi ${formattedBrand} melalui ${pubHost} · Nikmati pengalaman akses yang lebih cepat, aman, dan stabil langsung dari perangkat Anda.`,
    `Dapatkan file instalasi terbaru ${formattedBrand} di ${pubHost} : Kemudahan login, navigasi optimal, serta performa aplikasi terbaik khusus pengguna ${pubHost}.`,
    `Pusat unduhan resmi ${formattedBrand} terpercaya / Akses tautan unduh ${pubHost} sekarang juga untuk mendapatkan pembaruan aplikasi versi terbaru dengan mudah.`,
    `Install aplikasi ${formattedBrand} sekarang lewat ${pubHost} → Desain antarmuka yang ringan dan responsif memastikan kenyamanan maksimal di setiap penggunaan.`,
    `Nikmati kemudahan mengunduh ${formattedBrand} langsung melalui portal ${pubHost} · Cepat, aman, dan kompatibel untuk berbagai perangkat seluler Anda.`,
    `${formattedBrand} versi terbaru kini hadir di ${pubHost} : Unduh aplikasinya sekarang dan rasakan kemudahan akses tanpa hambatan.`,
    `Portal unduhan resmi ${formattedBrand} untuk ${pubHost} / Dapatkan file APK/aplikasi dengan proses instalasi yang cepat dan aman.`,
    `Akses link unduh resmi ${formattedBrand} via ${pubHost} → Solusi praktis dan handal untuk kebutuhan aplikasi seluler Anda hari ini.`,
    `Tautan unduh aplikasi ${formattedBrand} terverifikasi di ${pubHost} · Dapatkan kemudahan akses dengan performa yang optimal.`,
    `Perbarui dan unduh ${formattedBrand} langsung dari ${pubHost} : Nikmati fitur-fitur unggulan dalam satu genggaman.`
  ];

  const uriHash = parseInt(generateCRC32Like(uniqueKey), 16) || 12345;
  const rng = new SeededRandom(uriHash);
  const randomIndex = rng.rand(0, fallbackTemplates.length - 1);
  const selectedTemplate = fallbackTemplates[randomIndex];

  finalDescription = selectedTemplate
    .replace(/\{\{brand\}\}/g, formattedBrand)
    .replace(/\{brand\}/g, formattedBrand)
    .replace(/\{\{pubhost\}\}/gi, pubHost)
    .replace(/\{pubhost\}/gi, pubHost);

  return finalDescription;
}

// 6. Get Keyword Data (Baru Ditambahkan)
export function getKeywordData(uniqueKey, brandName, pubHost = '') {
  const fallbackKeywordArrays = [
    ["unduh aplikasi", "download apk", "link unduh resmi", "pasang aplikasi", "versi terbaru", "portal unduhan", "login", "daftar", "main"],
    ["instalasi aplikasi", "download resmi", "akses unduh", "aplikasi seluler", "file apk terbaru", "pusat download", "login", "daftar", "main"],
    ["unduh file", "download cepat", "link download", "aplikasi mobile", "unduh perangkat", "pasang apk", "login", "daftar", "main"],
    ["download mudah", "situs unduh", "aplikasi resmi", "unduh aman", "pemasangan aplikasi", "download versi terbaru", "login", "daftar", "main"]
  ];

  const uriHash = parseInt(generateCRC32Like(uniqueKey), 16) || 12345;
  const rng = new SeededRandom(uriHash);
  const randomIndex = rng.rand(0, fallbackKeywordArrays.length - 1);
  const selectedKeywordsArray = fallbackKeywordArrays[randomIndex];

  const formattedBrand = brandName.toLowerCase();
  const processedArray = selectedKeywordsArray.map(keyword => `${formattedBrand} ${keyword}`);

  return processedArray.join(', ');
}

export function getBrandDetailsData(uniqueKey, whitelistData = {}, randomData = [], seoBrandName = 'Asia200') {
  const uriHash = parseInt(generateCRC32Like(uniqueKey), 16) || 12345;
  const rng = new SeededRandom(uriHash);

  let currentBrand = null;
  let brandName = '';

  if (whitelistData && typeof whitelistData === 'object' && whitelistData[uniqueKey]) {
    currentBrand = whitelistData[uniqueKey];
    brandName = currentBrand['name'] ? currentBrand['name'] : seoBrandName;
  } else {
    if (randomData && Array.isArray(randomData) && randomData.length > 0) {
      const randomIndex = rng.rand(0, randomData.length - 1);
      const randomPick = randomData[randomIndex];

      brandName = randomPick['name'] ? randomPick['name'] : seoBrandName;
      currentBrand = {
        version: randomPick['version'] || '1.0.0',
        fileSize: randomPick['fileSize'] || '15 MB',
        androidOS: randomPick['androidOS'] || 'Android 8.0+',
        unduhan: randomPick['unduhan'] || '100,000+',
        bahasa: randomPick['bahasa'] || 'Indonesia',
        Diperbarui: randomPick['Diperbarui'] || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        sha: randomPick['sha'] || 'SHA256: ' + generateCRC32Like(uniqueKey)
      };
    } else {
      brandName = seoBrandName;
      
      // Format tanggal mundur acak
      const daysAgo = rng.rand(1, 30);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - daysAgo);
      const formattedDateString = targetDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

      currentBrand = {
        version: `${rng.rand(1, 10)}.${rng.rand(0, 9)}.${rng.rand(10, 999)}`,
        fileSize: `${rng.rand(10, 500)}.${rng.rand(1, 9)} MB`,
        androidOS: `Android ${rng.rand(5, 12)}.0+`,
        unduhan: `${(rng.rand(50, 5000) * 1000).toLocaleString('id-ID')}+`,
        bahasa: `Indonesia (${rng.rand(1, 52)} lainnya)`,
        Diperbarui: formattedDateString,
        sha: 'SHA256: ' + generateCRC32Like(uniqueKey + rng.rand())
      };
    }
  }

  const appVersion = currentBrand['version'];
  const appSize = currentBrand['fileSize'];
  const appOS = currentBrand['androidOS'];
  const appDownloads = currentBrand['unduhan'];
  const appBahasa = currentBrand['bahasa'];
  const displayDate = currentBrand['Diperbarui'];
  const appSha = currentBrand['sha'];
  
  // Format tanggal ISO (Y-m-d\TH:i:sP)
  const parsedDateObj = new Date(displayDate);
  const appDate = !isNaN(parsedDateObj) ? parsedDateObj.toISOString() : new Date().toISOString();

  const hurufPertama = brandName ? brandName.charAt(0).toUpperCase() : 'A';
  const imageUrl = `https://dummyimage.com/240x240/007a99/ffffff.png&text=${hurufPertama}`;

  const appRating = (rng.rand(38, 49) / 10).toFixed(1);
  const appReviewCount = rng.rand(1000, 99999);

  return {
    brandName,
    appVersion,
    appSize,
    appOS,
    appDownloads,
    appBahasa,
    displayDate,
    appSha,
    appDate,
    imageUrl,
    appRating,
    appReviewCount
  };
}

// 8. Get Category Data
export function getCategoryData(uniqueKey) {
  const categories = ['Pendidikan', 'Petualangan', 'Kasual', 'Game', 'Alat', 'Produktivitas', 'GameApplication', 'Strategi', 'Kartu', 'Multiplayer'];
  const uriHash = parseInt(generateCRC32Like(uniqueKey), 16) || 12345;
  const rng = new SeededRandom(uriHash);

  const categoryIndex = rng.rand(0, categories.length - 1);
  return categories[categoryIndex];
}

// 9. Get Image URL Data
export function getImageUrlData(brandName) {
  const hurufPertama = brandName ? brandName.charAt(0).toUpperCase() : 'A';
  return `https://dummyimage.com/240x240/007a99/ffffff.png&text=${hurufPertama}`;
}

// 10. Get Background Colors Data
export function getBackgroundColorsData(uniqueKey) {
  const bgColors = ['007a99', '1a1a1a', '7a0000', '004d1a', '4d004d', '996600'];
  const hashNum = parseInt(generateCRC32Like(uniqueKey), 16) || 12345;
  const count = bgColors.length;

  return {
    bg1: bgColors[hashNum % count],
    bg2: bgColors[(hashNum >> 1) % count],
    bg3: bgColors[(hashNum >> 2) % count],
    bg4: bgColors[(hashNum >> 3) % count]
  };
}
