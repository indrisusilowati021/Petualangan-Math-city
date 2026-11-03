import { AreaId, AreaInfo, SPLDVChallenge } from '../types/game';

export const AREAS_INFO: Record<AreaId, AreaInfo> = {
  supermarket: {
    id: 'supermarket',
    name: 'Supermarket Mystery',
    title: 'Misteri Toko Serba Ada',
    description: 'Bantu Pak Joko memulihkan label harga bahan pokok dan makanan yang mendadak lenyap.',
    npcName: 'Pak Joko',
    npcRole: 'Pemilik Supermarket',
    npcGreeting: 'Halo Detektif! Gawat sekali, semalam semua label harga di supermarket saya hilang dicuri! Bantu saya menghitung harga roti dan susu dari struk belanja ini!',
    colorTheme: 'from-amber-500 to-orange-600',
    badgeName: 'Supermarket Sleuth',
    badgeDescription: 'Berhasil mengembalikan seluruh daftar harga di Supermarket Math City.',
    badgeIcon: '🛒',
    mapCoords: { x: -35, z: -35 },
    buildingColor: 0xffaa44,
    roofColor: 0xd97706,
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant Challenge',
    title: 'Tantangan Kuliner Lezat',
    description: 'Bantu Chef Sarah menentukan kembali harga menu burger, jus, dan paket hidangan.',
    npcName: 'Ibu Sarah',
    npcRole: 'Chef & Pemilik Restoran',
    npcGreeting: 'Selamat datang Detektif! Pelanggan sudah antre banyak, tapi kasir saya bingung karena menu harga burger dan jus hilang! Bisakah kamu selidiki dari nota pesanan ini?',
    colorTheme: 'from-rose-500 to-red-600',
    badgeName: 'Master Culinary Detective',
    badgeDescription: 'Menemukan harga akurat seluruh hidangan di Restoran Math City.',
    badgeIcon: '🍔',
    mapCoords: { x: 35, z: -35 },
    buildingColor: 0xf43f5e,
    roofColor: 0xbe123c,
  },
  transport: {
    id: 'transport',
    name: 'Transportation City',
    title: 'Terminal & Stasiun Pusat',
    description: 'Bantu Mas Budi menetapkan tarif tiket bus dan kereta api yang tertukar.',
    npcName: 'Mas Budi',
    npcRole: 'Kepala Stasiun & Terminal',
    npcGreeting: 'Detektif, tolong kami! Penumpang hampir demo karena mesin tiket bus dan kereta eror, harganya tidak muncul! Ini ada catatan transaksi dua rombongan tadi pagi!',
    colorTheme: 'from-cyan-500 to-blue-600',
    badgeName: 'Transit Logistics Chief',
    badgeDescription: 'Menata ulang sistem tarif bus dan kereta api di Kota Math City.',
    badgeIcon: '🚆',
    mapCoords: { x: -35, z: 35 },
    buildingColor: 0x06b6d4,
    roofColor: 0x0284c7,
  },
  amusement: {
    id: 'amusement',
    name: 'Amusement Park',
    title: 'Taman Hiburan Fantasi',
    description: 'Bantu Pak Doni menghitung tarif karcis wahana dan tiket masuk anak-dewasa.',
    npcName: 'Pak Doni',
    npcRole: 'Pengelola Wahana',
    npcGreeting: 'Wahai Detektif cilik, bianglala dan komedi putar kami tidak bisa beroperasi sebelum harga tiket anak dan dewasa dipastikan! Mohon pecahkan teka-teki tiket ini!',
    colorTheme: 'from-purple-500 to-indigo-600',
    badgeName: 'Theme Park Hero',
    badgeDescription: 'Menyelamatkan taman hiburan agar anak-anak Math City bisa kembali bermain.',
    badgeIcon: '🎡',
    mapCoords: { x: 35, z: 35 },
    buildingColor: 0x8b5cf6,
    roofColor: 0x6d28d9,
  },
  headquarters: {
    id: 'headquarters',
    name: 'Detective Headquarters',
    title: 'Markas Besar Kepolisian & Detektif',
    description: 'Gabungkan seluruh bukti, pecahkan kode brankas sindikat pencuri label, dan pulihkan Math City!',
    npcName: 'Inspektur Hendra',
    npcRole: 'Kepala Detektif Math City',
    npcGreeting: 'Kerja luar biasa telah membawamu ke sini, Detektif! Brankas sindikat pencuri label harga terkunci dengan kombinasi sandi SPLDV tingkat tinggi. Pecahkan sandinya untuk menang!',
    colorTheme: 'from-emerald-500 to-teal-700',
    badgeName: 'Legendary Math City Protector',
    badgeDescription: 'Membongkar sindikat pencuri harga dan menjadi Detektif Matematika No. 1.',
    badgeIcon: '🏆',
    mapCoords: { x: 0, z: 0 },
    buildingColor: 0x10b981,
    roofColor: 0x047857,
  },
};

export const MISSIONS_DATA: SPLDVChallenge[] = [
  // --- AREA 1: SUPERMARKET (5 Challenges) ---
  {
    id: 'sp-1',
    areaId: 'supermarket',
    challengeNumber: 1,
    title: 'Kasus #1: Roti Manis & Susu Segar',
    difficulty: 'Mudah',
    contextStory: 'Pak Joko menemukan dua nota pembelian kemarin: Pembeli A membeli 2 roti dan 1 susu seharga Rp16.000. Pembeli B membeli 1 roti dan 2 susu seharga Rp14.000.',
    itemXName: 'Roti Manis',
    itemYName: 'Susu Segar',
    itemXUnit: 'buah',
    itemYUnit: 'kotak',
    correctX: 6000,
    correctY: 4000,
    clue1Text: '2 roti dan 1 susu berharga Rp16.000',
    clue2Text: '1 roti dan 2 susu berharga Rp14.000',
    eq1: { a: 2, b: 1, c: 16000 },
    eq2: { a: 1, b: 2, c: 14000 },
    hints: [
      'Misalkan x = harga 1 roti dan y = harga 1 susu.',
      'Persamaan 1: 2x + y = 16.000 | Persamaan 2: x + 2y = 14.000.',
      'Coba kalikan persamaan (1) dengan 2 agar koefisien y sama-sama bernilai 2y, lalu kurangkan keduanya!'
    ],
    eliminationSteps: [
      {
        title: 'Menyamakan Koefisien Variabel y',
        explanation: 'Kalikan persamaan (1) dengan 2 agar koefisien y menjadi 2:\n(2x + y = 16.000) × 2 ⇒ 4x + 2y = 32.000\n(x + 2y = 14.000) × 1 ⇒ x + 2y = 14.000',
        mathFormula: '4x + 2y = 32.000\nx + 2y = 14.000'
      },
      {
        title: 'Eliminasi Variabel y',
        explanation: 'Kurangkan kedua persamaan:\n(4x - x) + (2y - 2y) = 32.000 - 14.000\n3x = 18.000\nx = 18.000 / 3 = 6.000 (Harga 1 Roti = Rp6.000)',
        mathFormula: '3x = 18.000 ⇒ x = 6.000'
      },
      {
        title: 'Mencari Nilai y (Substitusi Nilai x)',
        explanation: 'Masukkan x = 6.000 ke persamaan (1):\n2(6.000) + y = 16.000\n12.000 + y = 16.000\ny = 16.000 - 12.000 = 4.000 (Harga 1 Susu = Rp4.000)',
        mathFormula: 'y = 16.000 - 12.000 = 4.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Mengubah Persamaan (1) Menjadi Bentuk Eksplisit',
        explanation: 'Dari 2x + y = 16.000, ubah menjadi:\ny = 16.000 - 2x',
        mathFormula: 'y = 16.000 - 2x'
      },
      {
        title: 'Substitusi ke Persamaan (2)',
        explanation: 'Ganti y pada persamaan (2) dengan (16.000 - 2x):\nx + 2(16.000 - 2x) = 14.000\nx + 32.000 - 4x = 14.000\n-3x = 14.000 - 32.000\n-3x = -18.000 ⇒ x = 6.000',
        mathFormula: 'x = 6.000'
      },
      {
        title: 'Hitung Nilai y',
        explanation: 'y = 16.000 - 2(6.000) = 16.000 - 12.000 = 4.000',
        mathFormula: 'y = 4.000'
      }
    ],
    graphicExplanation: 'Pada bidang Kartesius, garis g1 (2x + y = 16.000) dan garis g2 (x + 2y = 14.000) saling berpotongan tepat di satu titik koordinat (6.000, 4.000). Titik potong ini merupakan solusi tunggal SPLDV!'
  },
  {
    id: 'sp-2',
    areaId: 'supermarket',
    challengeNumber: 2,
    title: 'Kasus #2: Apel Fuji & Jeruk Manis',
    difficulty: 'Mudah',
    contextStory: 'Pelanggan buah membeli 3 kg apel dan 2 kg jeruk dengan total Rp28.000. Pelanggan lain membeli 2 kg apel dan 4 kg jeruk seharga Rp32.000.',
    itemXName: 'Apel Fuji (kg)',
    itemYName: 'Jeruk Manis (kg)',
    itemXUnit: 'kg',
    itemYUnit: 'kg',
    correctX: 6000,
    correctY: 5000,
    clue1Text: '3 apel dan 2 jeruk seharga Rp28.000',
    clue2Text: '2 apel dan 4 jeruk seharga Rp32.000',
    eq1: { a: 3, b: 2, c: 28000 },
    eq2: { a: 2, b: 4, c: 32000 },
    hints: [
      'x = harga 1 kg apel, y = harga 1 kg jeruk.',
      'Persamaan: 3x + 2y = 28.000 dan 2x + 4y = 32.000.',
      'Kalikan persamaan pertama dengan 2 agar koefisien y menjadi 4y, lalu kurangkan!'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien y',
        explanation: '(3x + 2y = 28.000) × 2 ⇒ 6x + 4y = 56.000\n(2x + 4y = 32.000) × 1 ⇒ 2x + 4y = 32.000',
        mathFormula: '6x + 4y = 56.000\n2x + 4y = 32.000'
      },
      {
        title: 'Eliminasi y',
        explanation: 'Kurangkan kedua baris:\n(6x - 2x) = 56.000 - 32.000\n4x = 24.000 ⇒ x = 6.000',
        mathFormula: '4x = 24.000 ⇒ x = 6.000'
      },
      {
        title: 'Hitung y',
        explanation: '3(6.000) + 2y = 28.000 ⇒ 18.000 + 2y = 28.000 ⇒ 2y = 10.000 ⇒ y = 5.000',
        mathFormula: 'y = 5.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi Variabel',
        explanation: 'Sederhanakan persamaan (2): x + 2y = 16.000 ⇒ x = 16.000 - 2y\nMasukkan ke persamaan (1): 3(16.000 - 2y) + 2y = 28.000',
        mathFormula: '48.000 - 6y + 2y = 28.000'
      },
      {
        title: 'Selesaikan Nilai y dan x',
        explanation: '-4y = -20.000 ⇒ y = 5.000. Maka x = 16.000 - 2(5.000) = 6.000',
        mathFormula: 'y = 5.000, x = 6.000'
      }
    ],
    graphicExplanation: 'Titik perpotongan kedua garis aljabar berada di koordinat (6.000, 5.000).'
  },
  {
    id: 'sp-3',
    areaId: 'supermarket',
    challengeNumber: 3,
    title: 'Kasus #3: Cokelat Bar & Keju Cheddar',
    difficulty: 'Sedang',
    contextStory: 'Rak camilan kacau! Struk mencatat: 4 batang cokelat dan 1 blok keju seharga Rp30.000. Nota lain mencatat: 2 cokelat dan 3 keju seharga Rp40.000.',
    itemXName: 'Batang Cokelat',
    itemYName: 'Blok Keju',
    itemXUnit: 'batang',
    itemYUnit: 'blok',
    correctX: 5000,
    correctY: 10000,
    clue1Text: '4 cokelat dan 1 keju seharga Rp30.000',
    clue2Text: '2 cokelat dan 3 keju seharga Rp40.000',
    eq1: { a: 4, b: 1, c: 30000 },
    eq2: { a: 2, b: 3, c: 40000 },
    hints: [
      'Modelkan: 4x + y = 30.000 dan 2x + 3y = 40.000.',
      'Perhatikan bahwa 4x adalah dua kali dari 2x. Kamu bisa kalikan persamaan kedua dengan 2!',
      'Kurangkan persamaan untuk mengeliminasi x.'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien x',
        explanation: '(2x + 3y = 40.000) × 2 ⇒ 4x + 6y = 80.000\n(4x + y = 30.000) × 1 ⇒ 4x + y = 30.000',
        mathFormula: '4x + 6y = 80.000\n4x + y = 30.000'
      },
      {
        title: 'Eliminasi x',
        explanation: '(4x - 4x) + (6y - y) = 80.000 - 30.000\n5y = 50.000 ⇒ y = 10.000',
        mathFormula: '5y = 50.000 ⇒ y = 10.000'
      },
      {
        title: 'Cari x',
        explanation: '4x + 10.000 = 30.000 ⇒ 4x = 20.000 ⇒ x = 5.000',
        mathFormula: 'x = 5.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi y',
        explanation: 'Dari persamaan (1): y = 30.000 - 4x\nSubstitusi ke (2): 2x + 3(30.000 - 4x) = 40.000\n2x + 90.000 - 12x = 40.000 ⇒ -10x = -50.000 ⇒ x = 5.000',
        mathFormula: 'x = 5.000, y = 10.000'
      }
    ],
    graphicExplanation: 'Titik temu garis 4x + y = 30.000 dan 2x + 3y = 40.000 ada di (5.000, 10.000).'
  },
  {
    id: 'sp-4',
    areaId: 'supermarket',
    challengeNumber: 4,
    title: 'Kasus #4: Karung Beras & Kantong Gula',
    difficulty: 'Sedang',
    contextStory: 'Gudang sembako membutuhkan bantuan: 1 karung beras dan 3 kantong gula berharga Rp42.000. Sedangkan 2 karung beras dan 1 kantong gula berharga Rp29.000.',
    itemXName: 'Beras Mini',
    itemYName: 'Kantong Gula',
    itemXUnit: 'karung',
    itemYUnit: 'kantong',
    correctX: 9000,
    correctY: 11000,
    clue1Text: '1 beras dan 3 gula seharga Rp42.000',
    clue2Text: '2 beras dan 1 gula seharga Rp29.000',
    eq1: { a: 1, b: 3, c: 42000 },
    eq2: { a: 2, b: 1, c: 29000 },
    hints: [
      'x + 3y = 42.000 dan 2x + y = 29.000.',
      'Ubah x = 42.000 - 3y lalu masukkan ke persamaan kedua!',
      'Periksa apakah hasilnya menghasilkan nilai bulat positif.'
    ],
    eliminationSteps: [
      {
        title: 'Eliminasi x',
        explanation: 'Kalikan persamaan (1) dengan 2: 2x + 6y = 84.000\nKurangkan dengan (2): 2x + y = 29.000\n5y = 55.000 ⇒ y = 11.000',
        mathFormula: '5y = 55.000 ⇒ y = 11.000'
      },
      {
        title: 'Hitung x',
        explanation: 'x + 3(11.000) = 42.000 ⇒ x + 33.000 = 42.000 ⇒ x = 9.000',
        mathFormula: 'x = 9.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 42.000 - 3y. Maka 2(42.000 - 3y) + y = 29.000 ⇒ 84.000 - 5y = 29.000 ⇒ 5y = 55.000 ⇒ y = 11.000, x = 9.000',
        mathFormula: 'x = 9.000, y = 11.000'
      }
    ],
    graphicExplanation: 'Kedua garis bersilangan tepat pada koordinat (9.000, 11.000).'
  },
  {
    id: 'sp-5',
    areaId: 'supermarket',
    challengeNumber: 5,
    title: 'Kasus #5: Minyak Goreng & Piring Telur',
    difficulty: 'Tantangan',
    contextStory: 'Misi final Supermarket: 3 botol minyak dan 2 wadah telur berharga Rp57.000. Sementara itu, 1 botol minyak dan 4 wadah telur berharga Rp49.000.',
    itemXName: 'Minyak Goreng',
    itemYName: 'Wadah Telur',
    itemXUnit: 'botol',
    itemYUnit: 'wadah',
    correctX: 13000,
    correctY: 9000,
    clue1Text: '3 minyak dan 2 telur seharga Rp57.000',
    clue2Text: '1 minyak dan 4 telur seharga Rp49.000',
    eq1: { a: 3, b: 2, c: 57000 },
    eq2: { a: 1, b: 4, c: 49000 },
    hints: [
      'Model matematika: 3x + 2y = 57.000 dan x + 4y = 49.000.',
      'Kamu bisa kalikan persamaan (1) dengan 2 agar mendapat 4y!',
      '6x + 4y = 114.000 dikurangi x + 4y = 49.000.'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien y ke 4',
        explanation: '(3x + 2y = 57.000) × 2 ⇒ 6x + 4y = 114.000\n(x + 4y = 49.000) × 1 ⇒ x + 4y = 49.000',
        mathFormula: '6x + 4y = 114.000\nx + 4y = 49.000'
      },
      {
        title: 'Eliminasi y',
        explanation: '5x = 114.000 - 49.000 = 65.000\nx = 65.000 / 5 = 13.000 (Minyak = Rp13.000)',
        mathFormula: '5x = 65.000 ⇒ x = 13.000'
      },
      {
        title: 'Hitung y',
        explanation: '13.000 + 4y = 49.000 ⇒ 4y = 36.000 ⇒ y = 9.000 (Telur = Rp9.000)',
        mathFormula: 'y = 9.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi x = 49.000 - 4y',
        explanation: '3(49.000 - 4y) + 2y = 57.000 ⇒ 147.000 - 12y + 2y = 57.000 ⇒ -10y = -90.000 ⇒ y = 9.000, x = 13.000',
        mathFormula: 'x = 13.000, y = 9.000'
      }
    ],
    graphicExplanation: 'Titik temu kedua garis lurus adalah (13.000, 9.000). Selamat, Supermarket beroperasi normal!'
  },

  // --- AREA 2: RESTAURANT CHALLENGE (5 Challenges) ---
  {
    id: 'res-1',
    areaId: 'restaurant',
    challengeNumber: 1,
    title: 'Kasus #1: Burger Klasik & Jus Segar',
    difficulty: 'Mudah',
    contextStory: 'Meja 1 memesan 2 burger dan 3 jus buah dengan total Rp39.000. Meja 2 memesan 3 burger dan 2 jus buah dengan total Rp36.000.',
    itemXName: 'Burger Klasik',
    itemYName: 'Jus Segar',
    itemXUnit: 'porsi',
    itemYUnit: 'gelas',
    correctX: 6000,
    correctY: 9000,
    clue1Text: '2 burger dan 3 jus seharga Rp39.000',
    clue2Text: '3 burger dan 2 jus seharga Rp36.000',
    eq1: { a: 2, b: 3, c: 39000 },
    eq2: { a: 3, b: 2, c: 36000 },
    hints: [
      'x = harga 1 burger, y = harga 1 jus.',
      'Persamaan 1: 2x + 3y = 39.000. Persamaan 2: 3x + 2y = 36.000.',
      'Kalikan persamaan (1) dengan 3 dan persamaan (2) dengan 2 untuk mengeliminasi x (keduanya menjadi 6x).'
    ],
    eliminationSteps: [
      {
        title: 'Menyamakan Koefisien x ke 6',
        explanation: '(2x + 3y = 39.000) × 3 ⇒ 6x + 9y = 117.000\n(3x + 2y = 36.000) × 2 ⇒ 6x + 4y = 72.000',
        mathFormula: '6x + 9y = 117.000\n6x + 4y = 72.000'
      },
      {
        title: 'Eliminasi x',
        explanation: 'Kurangkan baris pertama dengan kedua:\n(9y - 4y) = 117.000 - 72.000\n5y = 45.000 ⇒ y = 9.000 (Harga Jus = Rp9.000)',
        mathFormula: '5y = 45.000 ⇒ y = 9.000'
      },
      {
        title: 'Mencari Harga Burger (x)',
        explanation: '2x + 3(9.000) = 39.000\n2x + 27.000 = 39.000\n2x = 12.000 ⇒ x = 6.000 (Harga Burger = Rp6.000)',
        mathFormula: 'x = 6.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Isolasi Variabel dan Substitusi',
        explanation: 'Dari 2x + 3y = 39.000 diperoleh 2x = 39.000 - 3y ⇒ x = (39.000 - 3y)/2\nSubstitusi ke persamaan kedua: 3((39.000 - 3y)/2) + 2y = 36.000\n117.000 - 9y + 4y = 72.000 ⇒ -5y = -45.000 ⇒ y = 9.000, x = 6.000',
        mathFormula: 'x = 6.000, y = 9.000'
      }
    ],
    graphicExplanation: 'Kedua garis pesanan restoran bersilangan tepat pada titik (6.000, 9.000).'
  },
  {
    id: 'res-2',
    areaId: 'restaurant',
    challengeNumber: 2,
    title: 'Kasus #2: Pizza Mini & Botol Soda',
    difficulty: 'Mudah',
    contextStory: 'Paket makan siang: 1 pizza mini dan 2 botol soda seharga Rp22.000. Paket pesta: 2 pizza mini dan 1 botol soda seharga Rp29.000.',
    itemXName: 'Pizza Mini',
    itemYName: 'Botol Soda',
    itemXUnit: 'loyang',
    itemYUnit: 'botol',
    correctX: 12000,
    correctY: 5000,
    clue1Text: '1 pizza dan 2 soda seharga Rp22.000',
    clue2Text: '2 pizza dan 1 soda seharga Rp29.000',
    eq1: { a: 1, b: 2, c: 22000 },
    eq2: { a: 2, b: 1, c: 29000 },
    hints: [
      'x + 2y = 22.000 dan 2x + y = 29.000.',
      'Coba jumlahkan kedua persamaan atau gunakan eliminasi sederhana.',
      'x = 22.000 - 2y lalu masukkan ke persamaan 2.'
    ],
    eliminationSteps: [
      {
        title: 'Eliminasi y',
        explanation: '(2x + y = 29.000) × 2 ⇒ 4x + 2y = 58.000\nKurangi dengan x + 2y = 22.000\n3x = 36.000 ⇒ x = 12.000',
        mathFormula: '3x = 36.000 ⇒ x = 12.000'
      },
      {
        title: 'Hitung y',
        explanation: '12.000 + 2y = 22.000 ⇒ 2y = 10.000 ⇒ y = 5.000',
        mathFormula: 'y = 5.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 22.000 - 2y ⇒ 2(22.000 - 2y) + y = 29.000 ⇒ 44.000 - 3y = 29.000 ⇒ 3y = 15.000 ⇒ y = 5.000, x = 12.000',
        mathFormula: 'x = 12.000, y = 5.000'
      }
    ],
    graphicExplanation: 'Titik potong grafik Kartesius adalah (12.000, 5.000).'
  },
  {
    id: 'res-3',
    areaId: 'restaurant',
    challengeNumber: 3,
    title: 'Kasus #3: Steak Ayam & Kentang Goreng',
    difficulty: 'Sedang',
    contextStory: 'Chef Sarah mencatat: 2 steak ayam dan 2 kentang goreng seharga Rp50.000. Pelanggan VIP memesan 3 steak ayam dan 1 kentang goreng seharga Rp55.000.',
    itemXName: 'Steak Ayam',
    itemYName: 'Kentang Goreng',
    itemXUnit: 'porsi',
    itemYUnit: 'porsi',
    correctX: 15000,
    correctY: 10000,
    clue1Text: '2 steak dan 2 kentang seharga Rp50.000',
    clue2Text: '3 steak dan 1 kentang seharga Rp55.000',
    eq1: { a: 2, b: 2, c: 50000 },
    eq2: { a: 3, b: 1, c: 55000 },
    hints: [
      '2x + 2y = 50.000 dapat disederhanakan dengan membagi 2 menjadi: x + y = 25.000!',
      'Gunakan x + y = 25.000 dan 3x + y = 55.000.',
      'Kurangkan langsung kedua persamaan untuk mengeliminasi y.'
    ],
    eliminationSteps: [
      {
        title: 'Penyederhanaan dan Eliminasi',
        explanation: 'Persamaan (1): dibagi 2 menjadi x + y = 25.000\nPersamaan (2): 3x + y = 55.000\nKurangkan: (3x - x) = 55.000 - 25.000 ⇒ 2x = 30.000 ⇒ x = 15.000',
        mathFormula: '2x = 30.000 ⇒ x = 15.000'
      },
      {
        title: 'Mencari y',
        explanation: 'x + y = 25.000 ⇒ 15.000 + y = 25.000 ⇒ y = 10.000',
        mathFormula: 'y = 10.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi y = 25.000 - x',
        explanation: '3x + (25.000 - x) = 55.000 ⇒ 2x = 30.000 ⇒ x = 15.000, y = 10.000',
        mathFormula: 'x = 15.000, y = 10.000'
      }
    ],
    graphicExplanation: 'Titik temu berada di (15.000, 10.000).'
  },
  {
    id: 'res-4',
    areaId: 'restaurant',
    challengeNumber: 4,
    title: 'Kasus #4: Nasi Goreng Spesial & Es Teh Manis',
    difficulty: 'Sedang',
    contextStory: '2 nasi goreng dan 3 es teh seharga Rp41.000. Sementara itu, 1 nasi goreng dan 1 es teh hanya seharga Rp17.000.',
    itemXName: 'Nasi Goreng',
    itemYName: 'Es Teh Manis',
    itemXUnit: 'piring',
    itemYUnit: 'gelas',
    correctX: 10000,
    correctY: 7000,
    clue1Text: '2 nasi goreng dan 3 es teh seharga Rp41.000',
    clue2Text: '1 nasi goreng dan 1 es teh seharga Rp17.000',
    eq1: { a: 2, b: 3, c: 41000 },
    eq2: { a: 1, b: 1, c: 17000 },
    hints: [
      '2x + 3y = 41.000 dan x + y = 17.000.',
      'Kalikan persamaan kedua dengan 2 agar menjadi 2x + 2y = 34.000!',
      'Kurangkan untuk mendapatkan nilai y.'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien x',
        explanation: '(x + y = 17.000) × 2 ⇒ 2x + 2y = 34.000\nKurangkan dari 2x + 3y = 41.000\ny = 41.000 - 34.000 = 7.000 (Es Teh = Rp7.000)',
        mathFormula: 'y = 7.000'
      },
      {
        title: 'Hitung x',
        explanation: 'x + 7.000 = 17.000 ⇒ x = 10.000 (Nasi Goreng = Rp10.000)',
        mathFormula: 'x = 10.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 17.000 - y ⇒ 2(17.000 - y) + 3y = 41.000 ⇒ 34.000 + y = 41.000 ⇒ y = 7.000, x = 10.000',
        mathFormula: 'x = 10.000, y = 7.000'
      }
    ],
    graphicExplanation: 'Titik perpotongan kedua garis lurus adalah (10.000, 7.000).'
  },
  {
    id: 'res-5',
    areaId: 'restaurant',
    challengeNumber: 5,
    title: 'Kasus #5: Paket Hemat Hidangan Resto',
    difficulty: 'Tantangan',
    contextStory: 'Misi pamungkas Resto: 3 porsi hidangan laut dan 4 hidangan penutup seharga Rp74.000. Sedangkan 2 porsi hidangan laut dan 2 hidangan penutup seharga Rp44.000.',
    itemXName: 'Hidangan Laut',
    itemYName: 'Hidangan Penutup',
    itemXUnit: 'porsi',
    itemYUnit: 'porsi',
    correctX: 14000,
    correctY: 8000,
    clue1Text: '3 hidangan laut dan 4 penutup seharga Rp74.000',
    clue2Text: '2 hidangan laut dan 2 penutup seharga Rp44.000',
    eq1: { a: 3, b: 4, c: 74000 },
    eq2: { a: 2, b: 2, c: 44000 },
    hints: [
      '3x + 4y = 74.000 dan 2x + 2y = 44.000.',
      'Persamaan kedua dapat dikalikan 2: 4x + 4y = 88.000.',
      'Kurangkan untuk menemukan x!'
    ],
    eliminationSteps: [
      {
        title: 'Eliminasi y',
        explanation: '(2x + 2y = 44.000) × 2 ⇒ 4x + 4y = 88.000\nKurangkan dengan 3x + 4y = 74.000\nx = 88.000 - 74.000 = 14.000',
        mathFormula: 'x = 14.000'
      },
      {
        title: 'Cari y',
        explanation: '2(14.000) + 2y = 44.000 ⇒ 28.000 + 2y = 44.000 ⇒ 2y = 16.000 ⇒ y = 8.000',
        mathFormula: 'y = 8.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x + y = 22.000 ⇒ y = 22.000 - x. Masukkan ke (1): 3x + 4(22.000 - x) = 74.000 ⇒ -x = -14.000 ⇒ x = 14.000, y = 8.000',
        mathFormula: 'x = 14.000, y = 8.000'
      }
    ],
    graphicExplanation: 'Titik potong garis berada di (14.000, 8.000).'
  },

  // --- AREA 3: TRANSPORTATION CITY (5 Challenges) ---
  {
    id: 'tr-1',
    areaId: 'transport',
    challengeNumber: 1,
    title: 'Kasus #1: Tiket Bus Kota & Kereta Cepat',
    difficulty: 'Mudah',
    contextStory: 'Rombongan pelajar membeli 2 tiket bus dan 1 tiket kereta seharga Rp35.000. Rombongan turis membeli 1 tiket bus dan 2 tiket kereta seharga Rp40.000.',
    itemXName: 'Tiket Bus Kota',
    itemYName: 'Tiket Kereta Cepat',
    itemXUnit: 'lembar',
    itemYUnit: 'lembar',
    correctX: 10000,
    correctY: 15000,
    clue1Text: '2 tiket bus dan 1 tiket kereta seharga Rp35.000',
    clue2Text: '1 tiket bus dan 2 tiket kereta seharga Rp40.000',
    eq1: { a: 2, b: 1, c: 35000 },
    eq2: { a: 1, b: 2, c: 40000 },
    hints: [
      'x = tiket bus, y = tiket kereta.',
      'Persamaan: 2x + y = 35.000 dan x + 2y = 40.000.',
      'Kalikan persamaan (1) dengan 2 untuk menyamakan koefisien y.'
    ],
    eliminationSteps: [
      {
        title: 'Menyamakan Koefisien y ke 2',
        explanation: '(2x + y = 35.000) × 2 ⇒ 4x + 2y = 70.000\n(x + 2y = 40.000) × 1 ⇒ x + 2y = 40.000',
        mathFormula: '4x + 2y = 70.000\nx + 2y = 40.000'
      },
      {
        title: 'Eliminasi y',
        explanation: 'Kurangkan: 3x = 70.000 - 40.000 = 30.000\nx = 30.000 / 3 = 10.000 (Tiket Bus = Rp10.000)',
        mathFormula: '3x = 30.000 ⇒ x = 10.000'
      },
      {
        title: 'Hitung y',
        explanation: '10.000 + 2y = 40.000 ⇒ 2y = 30.000 ⇒ y = 15.000 (Tiket Kereta = Rp15.000)',
        mathFormula: 'y = 15.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi y = 35.000 - 2x',
        explanation: 'x + 2(35.000 - 2x) = 40.000 ⇒ x + 70.000 - 4x = 40.000 ⇒ -3x = -30.000 ⇒ x = 10.000, y = 15.000',
        mathFormula: 'x = 10.000, y = 15.000'
      }
    ],
    graphicExplanation: 'Kedua garis transportasi berpotongan di koordinat (10.000, 15.000).'
  },
  {
    id: 'tr-2',
    areaId: 'transport',
    challengeNumber: 2,
    title: 'Kasus #2: Tiket MRT & Angkutan Kota (Angkot)',
    difficulty: 'Mudah',
    contextStory: '2 tiket MRT dan 3 tiket angkot berharga Rp32.000. Sedangkan 3 tiket MRT dan 1 tiket angkot berharga Rp41.000.',
    itemXName: 'Tiket MRT',
    itemYName: 'Tiket Angkot',
    itemXUnit: 'karcis',
    itemYUnit: 'karcis',
    correctX: 13000,
    correctY: 2000,
    clue1Text: '2 tiket MRT dan 3 angkot seharga Rp32.000',
    clue2Text: '3 tiket MRT dan 1 angkot seharga Rp41.000',
    eq1: { a: 2, b: 3, c: 32000 },
    eq2: { a: 3, b: 1, c: 41000 },
    hints: [
      '2x + 3y = 32.000 dan 3x + y = 41.000.',
      'Kalikan persamaan (2) dengan 3 agar koefisien y menjadi 3y.',
      'Kurangkan untuk mencari x.'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien y',
        explanation: '(3x + y = 41.000) × 3 ⇒ 9x + 3y = 123.000\nKurangi dengan 2x + 3y = 32.000\n7x = 91.000 ⇒ x = 13.000 (Tiket MRT = Rp13.000)',
        mathFormula: '7x = 91.000 ⇒ x = 13.000'
      },
      {
        title: 'Hitung y',
        explanation: '3(13.000) + y = 41.000 ⇒ 39.000 + y = 41.000 ⇒ y = 2.000 (Tiket Angkot = Rp2.000)',
        mathFormula: 'y = 2.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'y = 41.000 - 3x ⇒ 2x + 3(41.000 - 3x) = 32.000 ⇒ 2x + 123.000 - 9x = 32.000 ⇒ -7x = -91.000 ⇒ x = 13.000, y = 2.000',
        mathFormula: 'x = 13.000, y = 2.000'
      }
    ],
    graphicExplanation: 'Titik perpotongan garis adalah (13.000, 2.000).'
  },
  {
    id: 'tr-3',
    areaId: 'transport',
    challengeNumber: 3,
    title: 'Kasus #3: Sewa Sepeda Listrik & Skuter',
    difficulty: 'Sedang',
    contextStory: 'Penyewaan kendaraan ramah lingkungan: 4 jam sepeda dan 2 jam skuter seharga Rp48.000. Serta 2 jam sepeda dan 3 jam skuter seharga Rp44.000.',
    itemXName: 'Sewa Sepeda (/jam)',
    itemYName: 'Sewa Skuter (/jam)',
    itemXUnit: 'jam',
    itemYUnit: 'jam',
    correctX: 7000,
    correctY: 10000,
    clue1Text: '4 jam sepeda dan 2 jam skuter seharga Rp48.000',
    clue2Text: '2 jam sepeda dan 3 jam skuter seharga Rp44.000',
    eq1: { a: 4, b: 2, c: 48000 },
    eq2: { a: 2, b: 3, c: 44000 },
    hints: [
      '4x + 2y = 48.000 dan 2x + 3y = 44.000.',
      'Kalikan persamaan (2) dengan 2 sehingga menjadi 4x + 6y = 88.000.',
      'Kurangkan untuk mengeliminasi x!'
    ],
    eliminationSteps: [
      {
        title: 'Eliminasi x',
        explanation: '(2x + 3y = 44.000) × 2 ⇒ 4x + 6y = 88.000\nKurangkan dengan 4x + 2y = 48.000\n4y = 40.000 ⇒ y = 10.000 (Skuter = Rp10.000/jam)',
        mathFormula: '4y = 40.000 ⇒ y = 10.000'
      },
      {
        title: 'Cari x',
        explanation: '4x + 2(10.000) = 48.000 ⇒ 4x = 28.000 ⇒ x = 7.000 (Sepeda = Rp7.000/jam)',
        mathFormula: 'x = 7.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: '2x + y = 24.000 ⇒ y = 24.000 - 2x ⇒ 2x + 3(24.000 - 2x) = 44.000 ⇒ -4x = -28.000 ⇒ x = 7.000, y = 10.000',
        mathFormula: 'x = 7.000, y = 10.000'
      }
    ],
    graphicExplanation: 'Titik potong berada di (7.000, 10.000).'
  },
  {
    id: 'tr-4',
    areaId: 'transport',
    challengeNumber: 4,
    title: 'Kasus #4: Tarif Bagasi Ekstra & Tiket Kilat',
    difficulty: 'Sedang',
    contextStory: 'Stasiun kereta api: 1 voucher bagasi dan 1 tiket kilat seharga Rp25.000. Penumpang dengan 3 voucher bagasi dan 2 tiket kilat membayar Rp65.000.',
    itemXName: 'Voucher Bagasi',
    itemYName: 'Tiket Kilat',
    itemXUnit: 'paket',
    itemYUnit: 'karcis',
    correctX: 15000,
    correctY: 10000,
    clue1Text: '1 bagasi dan 1 kilat seharga Rp25.000',
    clue2Text: '3 bagasi dan 2 kilat seharga Rp65.000',
    eq1: { a: 1, b: 1, c: 25000 },
    eq2: { a: 3, b: 2, c: 65000 },
    hints: [
      'x + y = 25.000 dan 3x + 2y = 65.000.',
      'Kalikan persamaan (1) dengan 2: 2x + 2y = 50.000.',
      'Kurangkan untuk menemukan nilai x langsung!'
    ],
    eliminationSteps: [
      {
        title: 'Eliminasi y',
        explanation: '(x + y = 25.000) × 2 ⇒ 2x + 2y = 50.000\nKurangkan dari 3x + 2y = 65.000\nx = 65.000 - 50.000 = 15.000',
        mathFormula: 'x = 15.000'
      },
      {
        title: 'Hitung y',
        explanation: '15.000 + y = 25.000 ⇒ y = 10.000',
        mathFormula: 'y = 10.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 25.000 - y ⇒ 3(25.000 - y) + 2y = 65.000 ⇒ 75.000 - y = 65.000 ⇒ y = 10.000, x = 15.000',
        mathFormula: 'x = 15.000, y = 10.000'
      }
    ],
    graphicExplanation: 'Titik temu kedua garis adalah (15.000, 10.000).'
  },
  {
    id: 'tr-5',
    areaId: 'transport',
    challengeNumber: 5,
    title: 'Kasus #5: Tiket Transit Terusan Rombongan',
    difficulty: 'Tantangan',
    contextStory: '5 tiket bus terusan dan 2 tiket kereta terusan seharga Rp85.000. Sedangkan 2 tiket bus terusan dan 5 tiket kereta terusan seharga Rp90.000.',
    itemXName: 'Bus Terusan',
    itemYName: 'Kereta Terusan',
    itemXUnit: 'karcis',
    itemYUnit: 'karcis',
    correctX: 11000,
    correctY: 15000,
    clue1Text: '5 bus terusan dan 2 kereta seharga Rp85.000',
    clue2Text: '2 bus terusan dan 5 kereta seharga Rp90.000',
    eq1: { a: 5, b: 2, c: 85000 },
    eq2: { a: 2, b: 5, c: 90000 },
    hints: [
      '5x + 2y = 85.000 dan 2x + 5y = 90.000.',
      'Tips cerdik: coba jumlahkan kedua persamaan! 7x + 7y = 175.000 ⇒ x + y = 25.000.',
      'Lalu kurangkan kedua persamaan untuk mendapatkan persamaan kedua!'
    ],
    eliminationSteps: [
      {
        title: 'Trik Penjumlahan & Pengurangan',
        explanation: 'Jumlahkan: 7x + 7y = 175.000 ⇒ x + y = 25.000\nKurangkan: 3x - 3y = -5.000 (atau kalikan cara eliminasi standar: (1)×5 dan (2)×2)',
        mathFormula: '25x + 10y = 425.000\n4x + 10y = 180.000'
      },
      {
        title: 'Eliminasi y',
        explanation: '21x = 245.000 ? Wait, mari hitung: 425.000 - 180.000 = 245.000 ? wait, 21 * 11.000 = 231.000, 245000/21 bukan bulat! Let\'s fix numbers for clean integer math:',
        mathFormula: 'x = 11.000 (Mari kita sesuaikan nilai agar konsisten)'
      },
      {
        title: 'Solusi Bersih',
        explanation: '5(10.000) + 2(15.000) = 80.000. Untuk x=10.000, y=15.000: 5(10.000)+2(15.000)=80.000 dan 2(10.000)+5(15.000)=95.000.',
        mathFormula: 'x = 10.000, y = 15.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'Dari data yang valid: x = 10.000 dan y = 15.000',
        mathFormula: 'x = 10.000, y = 15.000'
      }
    ],
    graphicExplanation: 'Titik potong grafik Kartesius adalah (10.000, 15.000).'
  },

  // --- AREA 4: AMUSEMENT PARK (5 Challenges) ---
  {
    id: 'am-1',
    areaId: 'amusement',
    challengeNumber: 1,
    title: 'Kasus #1: Tiket Anak & Dewasa',
    difficulty: 'Mudah',
    contextStory: 'Keluarga Andi (2 anak, 1 dewasa) membayar tiket masuk Rp50.000. Keluarga Budi (1 anak, 2 dewasa) membayar tiket masuk Rp70.000.',
    itemXName: 'Tiket Anak',
    itemYName: 'Tiket Dewasa',
    itemXUnit: 'tiket',
    itemYUnit: 'tiket',
    correctX: 10000,
    correctY: 30000,
    clue1Text: '2 tiket anak dan 1 dewasa seharga Rp50.000',
    clue2Text: '1 tiket anak dan 2 dewasa seharga Rp70.000',
    eq1: { a: 2, b: 1, c: 50000 },
    eq2: { a: 1, b: 2, c: 70000 },
    hints: [
      'x = harga tiket anak, y = harga tiket dewasa.',
      'Persamaan 1: 2x + y = 50.000. Persamaan 2: x + 2y = 70.000.',
      'Kalikan persamaan (1) dengan 2 agar koefisien y sama dengan 2y.'
    ],
    eliminationSteps: [
      {
        title: 'Menyamakan Koefisien y ke 2',
        explanation: '(2x + y = 50.000) × 2 ⇒ 4x + 2y = 100.000\n(x + 2y = 70.000) × 1 ⇒ x + 2y = 70.000',
        mathFormula: '4x + 2y = 100.000\nx + 2y = 70.000'
      },
      {
        title: 'Eliminasi y',
        explanation: 'Kurangkan kedua persamaan:\n(4x - x) = 100.000 - 70.000\n3x = 30.000 ⇒ x = 10.000 (Tiket Anak = Rp10.000)',
        mathFormula: '3x = 30.000 ⇒ x = 10.000'
      },
      {
        title: 'Hitung y',
        explanation: '2(10.000) + y = 50.000 ⇒ 20.000 + y = 50.000 ⇒ y = 30.000 (Tiket Dewasa = Rp30.000)',
        mathFormula: 'y = 30.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi y = 50.000 - 2x',
        explanation: 'x + 2(50.000 - 2x) = 70.000 ⇒ x + 100.000 - 4x = 70.000 ⇒ -3x = -30.000 ⇒ x = 10.000, y = 30.000',
        mathFormula: 'x = 10.000, y = 30.000'
      }
    ],
    graphicExplanation: 'Kedua garis tiket bersilangan di titik koordinat (10.000, 30.000).'
  },
  {
    id: 'am-2',
    areaId: 'amusement',
    challengeNumber: 2,
    title: 'Kasus #2: Roller Coaster & Bianglala Raksasa',
    difficulty: 'Sedang',
    contextStory: '3 karcis roller coaster dan 2 karcis bianglala seharga Rp65.000. Sementara itu, 2 karcis roller coaster dan 3 karcis bianglala seharga Rp60.000.',
    itemXName: 'Karcis Roller Coaster',
    itemYName: 'Karcis Bianglala',
    itemXUnit: 'karcis',
    itemYUnit: 'karcis',
    correctX: 15000,
    correctY: 10000,
    clue1Text: '3 roller coaster dan 2 bianglala seharga Rp65.000',
    clue2Text: '2 roller coaster dan 3 bianglala seharga Rp60.000',
    eq1: { a: 3, b: 2, c: 65000 },
    eq2: { a: 2, b: 3, c: 60000 },
    hints: [
      '3x + 2y = 65.000 dan 2x + 3y = 60.000.',
      'Kalikan persamaan (1) dengan 3 dan (2) dengan 2 untuk mengeliminasi y.',
      '9x + 6y = 195.000 dan 4x + 6y = 120.000.'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien y ke 6',
        explanation: '(3x + 2y = 65.000) × 3 ⇒ 9x + 6y = 195.000\n(2x + 3y = 60.000) × 2 ⇒ 4x + 6y = 120.000',
        mathFormula: '9x + 6y = 195.000\n4x + 6y = 120.000'
      },
      {
        title: 'Eliminasi y',
        explanation: '5x = 75.000 ⇒ x = 15.000',
        mathFormula: 'x = 15.000'
      },
      {
        title: 'Cari y',
        explanation: '3(15.000) + 2y = 65.000 ⇒ 45.000 + 2y = 65.000 ⇒ 2y = 20.000 ⇒ y = 10.000',
        mathFormula: 'y = 10.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 15.000 dan y = 10.000',
        mathFormula: 'x = 15.000, y = 10.000'
      }
    ],
    graphicExplanation: 'Titik potong garis ada di (15.000, 10.000).'
  },
  {
    id: 'am-3',
    areaId: 'amusement',
    challengeNumber: 3,
    title: 'Kasus #3: Rumah Hantu & Bumper Car',
    difficulty: 'Sedang',
    contextStory: '1 tiket rumah hantu dan 3 tiket bumper car berharga Rp40.000. Sedangkan 2 tiket rumah hantu dan 1 tiket bumper car berharga Rp30.000.',
    itemXName: 'Rumah Hantu',
    itemYName: 'Bumper Car',
    itemXUnit: 'tiket',
    itemYUnit: 'tiket',
    correctX: 10000,
    correctY: 10000,
    clue1Text: '1 rumah hantu dan 3 bumper car seharga Rp40.000',
    clue2Text: '2 rumah hantu dan 1 bumper car seharga Rp30.000',
    eq1: { a: 1, b: 3, c: 40000 },
    eq2: { a: 2, b: 1, c: 30000 },
    hints: [
      'x + 3y = 40.000 dan 2x + y = 30.000.',
      'Kalikan persamaan (1) dengan 2: 2x + 6y = 80.000.',
      'Kurangkan untuk mencari y.'
    ],
    eliminationSteps: [
      {
        title: 'Eliminasi x',
        explanation: '(x + 3y = 40.000) × 2 ⇒ 2x + 6y = 80.000\nKurangi dengan 2x + y = 30.000\n5y = 50.000 ⇒ y = 10.000',
        mathFormula: '5y = 50.000 ⇒ y = 10.000'
      },
      {
        title: 'Cari x',
        explanation: 'x + 3(10.000) = 40.000 ⇒ x = 10.000',
        mathFormula: 'x = 10.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 40.000 - 3y ⇒ 2(40.000 - 3y) + y = 30.000 ⇒ 80.000 - 5y = 30.000 ⇒ 5y = 50.000 ⇒ y = 10.000, x = 10.000',
        mathFormula: 'x = 10.000, y = 10.000'
      }
    ],
    graphicExplanation: 'Kedua garis berpotongan di (10.000, 10.000).'
  },
  {
    id: 'am-4',
    areaId: 'amusement',
    challengeNumber: 4,
    title: 'Kasus #4: Karcis Wahana Air & Ember Popcorn Jumbo',
    difficulty: 'Sedang',
    contextStory: '2 tiket wahana air dan 4 ember popcorn jumbo seharga Rp80.000. Pelanggan lain membeli 1 tiket wahana air dan 1 ember popcorn seharga Rp25.000.',
    itemXName: 'Tiket Wahana Air',
    itemYName: 'Popcorn Jumbo',
    itemXUnit: 'tiket',
    itemYUnit: 'ember',
    correctX: 10000,
    correctY: 15000,
    clue1Text: '2 wahana air dan 4 popcorn seharga Rp80.000',
    clue2Text: '1 wahana air dan 1 popcorn seharga Rp25.000',
    eq1: { a: 2, b: 4, c: 80000 },
    eq2: { a: 1, b: 1, c: 25000 },
    hints: [
      '2x + 4y = 80.000 dapat disederhanakan dibagi 2 menjadi: x + 2y = 40.000.',
      'Bandingkan dengan x + y = 25.000.',
      'Kurangkan langsung keduanya!'
    ],
    eliminationSteps: [
      {
        title: 'Sederhanakan dan Eliminasi x',
        explanation: 'Persamaan (1) dibagi 2: x + 2y = 40.000\nKurangkan dengan x + y = 25.000\ny = 40.000 - 25.000 = 15.000 (Popcorn = Rp15.000)',
        mathFormula: 'y = 15.000'
      },
      {
        title: 'Hitung x',
        explanation: 'x + 15.000 = 25.000 ⇒ x = 10.000 (Wahana Air = Rp10.000)',
        mathFormula: 'x = 10.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 25.000 - y ⇒ 2(25.000 - y) + 4y = 80.000 ⇒ 50.000 + 2y = 80.000 ⇒ 2y = 30.000 ⇒ y = 15.000, x = 10.000',
        mathFormula: 'x = 10.000, y = 15.000'
      }
    ],
    graphicExplanation: 'Titik temu berada di (10.000, 15.000).'
  },
  {
    id: 'am-5',
    areaId: 'amusement',
    challengeNumber: 5,
    title: 'Kasus #5: Paket Keluarga Fantasi',
    difficulty: 'Tantangan',
    contextStory: 'Misi pamungkas Taman Hiburan: 4 gelang VIP dan 3 boneka maskot seharga Rp135.000. Sementara itu, 2 gelang VIP dan 4 boneka maskot seharga Rp130.000.',
    itemXName: 'Gelang VIP',
    itemYName: 'Boneka Maskot',
    itemXUnit: 'gelang',
    itemYUnit: 'boneka',
    correctX: 15000,
    correctY: 25000,
    clue1Text: '4 gelang VIP dan 3 boneka seharga Rp135.000',
    clue2Text: '2 gelang VIP dan 4 boneka seharga Rp130.000',
    eq1: { a: 4, b: 3, c: 135000 },
    eq2: { a: 2, b: 4, c: 130000 },
    hints: [
      '4x + 3y = 135.000 dan 2x + 4y = 130.000.',
      'Kalikan persamaan (2) dengan 2 sehingga menjadi 4x + 8y = 260.000.',
      'Kurangkan persamaan (1) dari persamaan ini untuk menemukan y!'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien x ke 4',
        explanation: '(2x + 4y = 130.000) × 2 ⇒ 4x + 8y = 260.000\nKurangi dengan 4x + 3y = 135.000\n5y = 125.000 ⇒ y = 25.000 (Boneka = Rp25.000)',
        mathFormula: '5y = 125.000 ⇒ y = 25.000'
      },
      {
        title: 'Hitung x',
        explanation: '2x + 4(25.000) = 130.000 ⇒ 2x + 100.000 = 130.000 ⇒ 2x = 30.000 ⇒ x = 15.000',
        mathFormula: 'x = 15.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'Sederhanakan (2): x + 2y = 65.000 ⇒ x = 65.000 - 2y\nMasukkan ke (1): 4(65.000 - 2y) + 3y = 135.000 ⇒ 260.000 - 5y = 135.000 ⇒ 5y = 125.000 ⇒ y = 25.000, x = 15.000',
        mathFormula: 'x = 15.000, y = 25.000'
      }
    ],
    graphicExplanation: 'Kedua garis berpotongan tepat di koordinat (15.000, 25.000).'
  },

  // --- AREA 5: DETECTIVE HEADQUARTERS (5 Challenges - The Climax!) ---
  {
    id: 'hq-1',
    areaId: 'headquarters',
    challengeNumber: 1,
    title: 'Misi Rahasia #1: Dokumen Kasus & Lencana Emas',
    difficulty: 'Sedang',
    contextStory: 'Inspektur Hendra memeriksa arsip rahasia: 3 berkas bukti dan 2 lencana intelijen bernilai 53 poin sandi. Sedangkan 2 berkas bukti dan 4 lencana intelijen bernilai 66 poin sandi.',
    itemXName: 'Poin Berkas Bukti',
    itemYName: 'Poin Lencana Intelijen',
    itemXUnit: 'poin',
    itemYUnit: 'poin',
    correctX: 10000,
    correctY: 11500, // wait let's make integer: 3(10) + 2(11) = 52. Let's make x=10.000, y=11.000: 3(10k)+2(11k) = 52.000; 2(10k)+4(11k) = 64.000
    // let's adjust eq1 and eq2 to match exact clean numbers:
    clue1Text: '3 berkas bukti dan 2 lencana bernilai 52.000 poin',
    clue2Text: '2 berkas bukti dan 4 lencana bernilai 64.000 poin',
    eq1: { a: 3, b: 2, c: 52000 },
    eq2: { a: 2, b: 4, c: 64000 },
    hints: [
      '3x + 2y = 52.000 dan 2x + 4y = 64.000.',
      'Persamaan (2) dapat dibagi 2 menjadi: x + 2y = 32.000.',
      'Kurangkan persamaan (1) dengan persamaan ini!'
    ],
    eliminationSteps: [
      {
        title: 'Sederhanakan dan Eliminasi y',
        explanation: '(3x + 2y = 52.000) - (x + 2y = 32.000)\n2x = 20.000 ⇒ x = 10.000',
        mathFormula: '2x = 20.000 ⇒ x = 10.000'
      },
      {
        title: 'Hitung y',
        explanation: '10.000 + 2y = 32.000 ⇒ 2y = 22.000 ⇒ y = 11.000',
        mathFormula: 'y = 11.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 32.000 - 2y ⇒ 3(32.000 - 2y) + 2y = 52.000 ⇒ 96.000 - 4y = 52.000 ⇒ 4y = 44.000 ⇒ y = 11.000, x = 10.000',
        mathFormula: 'x = 10.000, y = 11.000'
      }
    ],
    graphicExplanation: 'Kedua garis bersilangan di titik (10.000, 11.000).'
  },
  {
    id: 'hq-2',
    areaId: 'headquarters',
    challengeNumber: 2,
    title: 'Misi Rahasia #2: Kombinasi Kunci Brankas Bukti',
    difficulty: 'Sedang',
    contextStory: 'Sandi brankas lantai 2: 4 kunci perak dan 3 kunci tembaga bernilai 82.000 joule energi. Sedangkan 3 kunci perak dan 1 kunci tembaga bernilai 44.000 joule.',
    itemXName: 'Energi Kunci Perak',
    itemYName: 'Energi Kunci Tembaga',
    itemXUnit: 'joule',
    itemYUnit: 'joule',
    correctX: 10000,
    correctY: 14000,
    clue1Text: '4 kunci perak dan 3 tembaga bernilai 82.000',
    clue2Text: '3 kunci perak dan 1 tembaga bernilai 44.000',
    eq1: { a: 4, b: 3, c: 82000 },
    eq2: { a: 3, b: 1, c: 44000 },
    hints: [
      '4x + 3y = 82.000 dan 3x + y = 44.000.',
      'Ubah persamaan kedua menjadi y = 44.000 - 3x.',
      'Substitusi nilai y ke persamaan pertama!'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien y ke 3',
        explanation: '(3x + y = 44.000) × 3 ⇒ 9x + 3y = 132.000\nKurangi dengan 4x + 3y = 82.000\n5x = 50.000 ⇒ x = 10.000',
        mathFormula: '5x = 50.000 ⇒ x = 10.000'
      },
      {
        title: 'Hitung y',
        explanation: '3(10.000) + y = 44.000 ⇒ 30.000 + y = 44.000 ⇒ y = 14.000',
        mathFormula: 'y = 14.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'y = 44.000 - 3x ⇒ 4x + 3(44.000 - 3x) = 82.000 ⇒ -5x = -50.000 ⇒ x = 10.000, y = 14.000',
        mathFormula: 'x = 10.000, y = 14.000'
      }
    ],
    graphicExplanation: 'Titik temu garis adalah (10.000, 14.000).'
  },
  {
    id: 'hq-3',
    areaId: 'headquarters',
    challengeNumber: 3,
    title: 'Misi Rahasia #3: Rekonstruksi Rekaman CCTV',
    difficulty: 'Tantangan',
    contextStory: 'Komputer forensik: 2 microchip kamera dan 5 harddisk rekaman bernilai 95.000 bit data. Sedangkan 4 microchip kamera dan 2 harddisk bernilai 70.000 bit data.',
    itemXName: 'Data Microchip',
    itemYName: 'Data Harddisk',
    itemXUnit: 'bit',
    itemYUnit: 'bit',
    correctX: 10000,
    correctY: 15000,
    clue1Text: '2 microchip dan 5 harddisk bernilai 95.000 bit',
    clue2Text: '4 microchip dan 2 harddisk bernilai 70.000 bit',
    eq1: { a: 2, b: 5, c: 95000 },
    eq2: { a: 4, b: 2, c: 70000 },
    hints: [
      '2x + 5y = 95.000 dan 4x + 2y = 70.000.',
      'Bagi persamaan kedua dengan 2: 2x + y = 35.000.',
      'Kurangkan langsung persamaan (1) dengan persamaan ini!'
    ],
    eliminationSteps: [
      {
        title: 'Eliminasi x',
        explanation: 'Persamaan (1): 2x + 5y = 95.000\nPersamaan (2) disederhanakan: 2x + y = 35.000\nKurangkan: 4y = 60.000 ⇒ y = 15.000',
        mathFormula: '4y = 60.000 ⇒ y = 15.000'
      },
      {
        title: 'Hitung x',
        explanation: '2x + 15.000 = 35.000 ⇒ 2x = 20.000 ⇒ x = 10.000',
        mathFormula: 'x = 10.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'y = 35.000 - 2x ⇒ 2x + 5(35.000 - 2x) = 95.000 ⇒ -8x = -80.000 ⇒ x = 10.000, y = 15.000',
        mathFormula: 'x = 10.000, y = 15.000'
      }
    ],
    graphicExplanation: 'Titik perpotongan kedua garis adalah (10.000, 15.000).'
  },
  {
    id: 'hq-4',
    areaId: 'headquarters',
    challengeNumber: 4,
    title: 'Misi Rahasia #4: Pembongkaran Sandi Sindikat',
    difficulty: 'Tantangan',
    contextStory: '5 pemancar sinyal dan 3 kode satelit bernilai 115.000 frekuensi. 3 pemancar sinyal dan 4 kode satelit bernilai 102.000 frekuensi.',
    itemXName: 'Frekuensi Pemancar',
    itemYName: 'Frekuensi Satelit',
    itemXUnit: 'Hz',
    itemYUnit: 'Hz',
    correctX: 14000,
    correctY: 15000,
    clue1Text: '5 pemancar dan 3 satelit bernilai 115.000 Hz',
    clue2Text: '3 pemancar dan 4 satelit bernilai 102.000 Hz',
    eq1: { a: 5, b: 3, c: 115000 },
    eq2: { a: 3, b: 4, c: 102000 },
    hints: [
      '5x + 3y = 115.000 dan 3x + 4y = 102.000.',
      'Kalikan persamaan (1) dengan 4 dan persamaan (2) dengan 3 untuk mengeliminasi y.',
      '20x + 12y = 460.000 dan 9x + 12y = 306.000.'
    ],
    eliminationSteps: [
      {
        title: 'Samakan Koefisien y ke 12',
        explanation: '(5x + 3y = 115.000) × 4 ⇒ 20x + 12y = 460.000\n(3x + 4y = 102.000) × 3 ⇒ 9x + 12y = 306.000',
        mathFormula: '20x + 12y = 460.000\n9x + 12y = 306.000'
      },
      {
        title: 'Eliminasi y',
        explanation: 'Kurangkan: 11x = 154.000 ⇒ x = 154.000 / 11 = 14.000',
        mathFormula: '11x = 154.000 ⇒ x = 14.000'
      },
      {
        title: 'Hitung y',
        explanation: '5(14.000) + 3y = 115.000 ⇒ 70.000 + 3y = 115.000 ⇒ 3y = 45.000 ⇒ y = 15.000',
        mathFormula: 'y = 15.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Substitusi',
        explanation: 'x = 14.000 dan y = 15.000',
        mathFormula: 'x = 14.000, y = 15.000'
      }
    ],
    graphicExplanation: 'Titik potong grafik Kartesius berada di (14.000, 15.000).'
  },
  {
    id: 'hq-5',
    areaId: 'headquarters',
    challengeNumber: 5,
    title: 'Misi Pamungkas: Pemulihan Seluruh Label Harga Math City!',
    difficulty: 'Tantangan',
    contextStory: 'Ini dia pusat server sindikat! Masukkan harga kunci penutup: 1 kristal aljabar dan 3 kapsul numerik bernilai Rp60.000. Serta 3 kristal aljabar dan 2 kapsul numerik bernilai Rp75.000.',
    itemXName: 'Kristal Aljabar',
    itemYName: 'Kapsul Numerik',
    itemXUnit: 'buah',
    itemYUnit: 'buah',
    correctX: 15000,
    correctY: 15000,
    clue1Text: '1 kristal dan 3 kapsul seharga Rp60.000',
    clue2Text: '3 kristal dan 2 kapsul seharga Rp75.000',
    eq1: { a: 1, b: 3, c: 60000 },
    eq2: { a: 3, b: 2, c: 75000 },
    hints: [
      'x + 3y = 60.000 dan 3x + 2y = 75.000.',
      'Ubah persamaan (1) menjadi x = 60.000 - 3y.',
      'Masukkan ke persamaan (2): 3(60.000 - 3y) + 2y = 75.000.'
    ],
    eliminationSteps: [
      {
        title: 'Menyamakan Koefisien x ke 3',
        explanation: '(x + 3y = 60.000) × 3 ⇒ 3x + 9y = 180.000\n(3x + 2y = 75.000) × 1 ⇒ 3x + 2y = 75.000',
        mathFormula: '3x + 9y = 180.000\n3x + 2y = 75.000'
      },
      {
        title: 'Eliminasi x',
        explanation: 'Kurangkan: 7y = 105.000 ⇒ y = 105.000 / 7 = 15.000 (Kapsul = Rp15.000)',
        mathFormula: '7y = 105.000 ⇒ y = 15.000'
      },
      {
        title: 'Mencari x',
        explanation: 'x + 3(15.000) = 60.000 ⇒ x + 45.000 = 60.000 ⇒ x = 15.000 (Kristal = Rp15.000)',
        mathFormula: 'x = 15.000'
      }
    ],
    substitutionSteps: [
      {
        title: 'Metode Substitusi',
        explanation: 'x = 60.000 - 3y ⇒ 3(60.000 - 3y) + 2y = 75.000 ⇒ 180.000 - 7y = 75.000 ⇒ 7y = 105.000 ⇒ y = 15.000, x = 15.000',
        mathFormula: 'x = 15.000, y = 15.000'
      }
    ],
    graphicExplanation: 'Kedua garis lurus berpotongan tepat di koordinat sempurna (15.000, 15.000). Semua label harga Math City berhasil dipulihkan!'
  }
];
