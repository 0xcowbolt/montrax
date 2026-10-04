import { escapeHtml, sanitizeText, generateCRC32Like } from './parser.js';
import { getSelectedFaqs, getSimilarAndRelated } from './faqAndSimilar.js';
import { 
  getPriceData, 
  getReviewsData, 
  getParagraphsData, 
  getWhatsNewData, 
  getDescriptionData, 
  getKeywordData,
  getBrandDetailsData,
  getCategoryData,
  getBackgroundColorsData
} from './reviewPriceData.js';

// Helper SeededRandom kecil agar konsisten per brand berdasarkan uniqueHash
class SeededRandom {
  constructor(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }
  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

export async function getBrandSeoData(brandQuery, httpHost, baseUrl, urlOrigin, baseOrigin, baseAmp) {
  const cleanBrandName = sanitizeText(brandQuery);
  const finalBrandTitle = cleanBrandName || 'APLIKASI TERPERCAYA';
  const uniqueHash = generateCRC32Like(brandQuery);

  // Inisialisasi RNG stabil dari uniqueHash (dikonversi dari hex string ke int)
  const rng = new SeededRandom(parseInt(uniqueHash, 16) || 12345);

  // Ambil detail brand dinamis (versi, ukuran, OS, rating, dll)
  const brandDetails = getBrandDetailsData(uniqueHash, {}, [], finalBrandTitle);
  const appCategory = getCategoryData(uniqueHash);
  const bgColors = getBackgroundColorsData(uniqueHash);

  const rawDescription = getDescriptionData(uniqueHash, finalBrandTitle, httpHost);
  const rawKeywords = getKeywordData(uniqueHash, finalBrandTitle, httpHost);

  // --- LOGIKA DINAMIS SEO TITLE (DISESUAIKAN) ---
  const brandUpper = finalBrandTitle.toUpperCase();
  const appVersion = brandDetails.appVersion || '7.0.60';

  // Pilihan simbol/pemisah tunggal (tanda baca atau emoticon secara acak)
  const separatorsAndIcons = ['-', ':', '🎮', '🔥', '✨', '⚡', '🚀', '⭐', '💎', '🎯'];
  const chosenSymbol = separatorsAndIcons[Math.floor(rng.next() * separatorsAndIcons.length)] || '-';

  const randomTitles = [
    'Kumpulan Game Arkade',
    'Pusat Permainan Digital',
    'Portal Hiburan & Akses',
    'Arena Permainan Populer',
    'Layanan Game Terlengkap',
    'Platform Hiburan Interaktif',
    'Katalog Game & Hiburan',
    'Pusat Unduhan & Akses Resmi'
  ];
  const chosenRandomTitle = randomTitles[Math.floor(rng.next() * randomTitles.length)] || 'Pusat Permainan';

  const rawSeoTitle = `${brandUpper} ${chosenSymbol} ${chosenRandomTitle} ${appVersion} Siap Main & Unduh`;
  const seoTitle = escapeHtml(rawSeoTitle);
  // ---------------------------------------------

  const description = escapeHtml(rawDescription);
  const keywords = escapeHtml(rawKeywords);
  // Ambil semua data pendukung secara paralel
  const [faqs, relatedData, priceInfo, reviewsInfo, paragraphs, whatsNew] = await Promise.all([
    getSelectedFaqs(uniqueHash, finalBrandTitle, baseUrl),
    getSimilarAndRelated(uniqueHash, finalBrandTitle, brandDetails.appOS, brandDetails.appSize, baseUrl, urlOrigin),
    Promise.resolve(getPriceData(uniqueHash)),
    getReviewsData(uniqueHash, finalBrandTitle, brandDetails.appOS, brandDetails.appSize),
    getParagraphsData(uniqueHash, finalBrandTitle),
    getWhatsNewData(uniqueHash, finalBrandTitle)
  ]);

  return {
    brandCode: finalBrandTitle,
    seoTitle,
    description,
    keywords,
    appVersion: brandDetails.appVersion,
    appSize: brandDetails.appSize,
    appOS: brandDetails.appOS,
    appDownloads: brandDetails.appDownloads,
    appBahasa: brandDetails.appBahasa,
    displayDate: brandDetails.displayDate,
    appSha: brandDetails.appSha,
    appDate: brandDetails.appDate,
    appRating: brandDetails.appRating,
    appReviewCount: brandDetails.appReviewCount,
    imageUrl: brandDetails.imageUrl,
    appCategory,
    bgColors,
    faqs,
    similarApps: relatedData.similarApps,
    relatedTopics: relatedData.relatedTopics,
    priceData: priceInfo,
    reviews: reviewsInfo.reviews,
    reviewSchemas: reviewsInfo.reviewSchemas,
    paragraphs,
    whatsNew,
    baseOrigin: baseOrigin.trim(),
    baseUrlUri: baseUrl,
    ampLink: baseAmp.trim()
  };
}
