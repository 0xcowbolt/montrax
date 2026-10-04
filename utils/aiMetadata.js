import { sanitizeText } from './parser.js';

// Ambil sampel acak aman dari array besar
function getRandomSample(arr, maxItems = 50) {
  if (!arr || arr.length === 0) return [];
  if (arr.length <= maxItems) return arr;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, maxItems);
}

export async function handleAiMetadata(requestPath, baseHost, urlOrigin) {
  if (!/^https?:\/\//i.test(baseHost)) {
    baseHost = "https://" + baseHost.replace(/^\/+/, '');
  }
  baseHost = baseHost.replace(/\/+$/, '');

  // Daftar brand statis / hardcoded (tanpa fetch file eksternal)
  const brandsList = [
    'Togel138', 'Asia200', 'Slot88', 'Koitoto', 'Stmtoto', 
    'Togel2win', 'K200m', 'MugoWaras', 'EngineIndo', 'JayaSakti',
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
    'ThorSlot', 'LokiJp', 'ValhallaSlot', 'AsgardWin', 'AtlantisSlot',
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
    'TransactionWin', 'PaymentSlot', 'InvoiceJp', 'ReceiptSlot', 'CheckoutWin'
  ];

  const hostOnly = baseHost.replace(/^https?:\/\//i, '');
  const sampleBrands = getRandomSample(brandsList, 50);

  // 1. Handle /llms.txt
  if (requestPath.includes("llms.txt")) {
    let output = `# Direktori Resmi & Pusat Layanan Digital\n\n`;
    output += `> Pusat direktori tautan resmi, informasi unduhan aplikasi, dan layanan terintegrasi.\n\n`;
    
    output += `## Daftar Brand & Layanan Pilihan\n\n`;
    sampleBrands.forEach(b => {
      const cleanB = sanitizeText(b);
      output += `- [${cleanB}](${baseHost}/${encodeURIComponent(b)}): Situs resmi pendaftaran dan informasi ${cleanB}.\n`;
    });

    output += `\n## Navigasi Utama\n\n`;
    output += `- [Beranda](${baseHost}/): Halaman utama portal.\n`;
    output += `- [Pusat Bantuan & FAQ](${baseHost}/faq): Informasi tanya jawab dan panduan.\n`;

    return { content: output, contentType: "text/plain; charset=utf-8" };
  }

  // 2. Handle /ai-catalog.json
  if (requestPath.includes("ai-catalog.json")) {
    const entries = sampleBrands.map((b, index) => {
      const cleanB = sanitizeText(b);
      const lowerSlug = b.toLowerCase().replace(/[^a-z0-9]/g, '');
      return {
        identifier: `urn:air:${lowerSlug}:catalog:${index}`,
        type: "application/ai-catalog+json",
        displayName: "Katalog " + cleanB,
        url: `${baseHost}/${encodeURIComponent(b)}`,
        description: "Katalog resmi dan informasi unduhan dari " + cleanB + ".",
        representativeQueries: [
          cleanB,
          "situs resmi " + cleanB,
          "login " + cleanB,
          "download apk " + cleanB
        ]
      };
    });

    const jsonData = {
      specVersion: "1.0",
      host: {
        displayName: "Portal Direktori Utama",
        identifier: "did:web:" + hostOnly,
        documentationUrl: `${baseHost}/llms.txt`
      },
      entries: entries
    };

    return { content: JSON.stringify(jsonData, null, 2), contentType: "application/json; charset=utf-8" };
  }

  return null;
}
