export const SITE_CONFIG = {
  eventName: 'Åseda Truckmeet',
  year: 2026,
  edition: '10 år',
  dates: '26-28 juni 2026',
  location: 'Åseda Folkets park',
  address: 'Åseda, Uppvidinge Kommun, Sverige',
  organization: 'Truckmeet i syd ideell förening',
  orgAddress: 'Ekängsvägen 2',
  orgZip: '577 71 Virserum',
  orgPhone: '0495-76 60 60',
  contactEmail: 'kontakt@asedatruckmeet.se',
  eventStartDate: '2026-06-26T15:00:00+02:00',
  pretixShopUrl: 'https://asedatruckmeet.se/butik',
} as const;

export const ARTISTS = [
  { name: 'Pipex', genre: 'Dansband', description: 'Sveriges festigaste dansband', image: 'https://images.pexels.com/photos/13230484/pexels-photo-13230484.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Da Buzz', genre: 'Eurodance', description: '90-talsikoner som får alla att dansa', image: 'https://images.pexels.com/photos/7513442/pexels-photo-7513442.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Maskinen', genre: 'Elektro/Party', description: 'Energisk scenshow som sätter stämningen i topp', image: 'https://images.pexels.com/photos/36675302/pexels-photo-36675302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: '2 Blyga Läppar', genre: 'Rock/Party', description: 'Liveband som levererar med full kraft', image: 'https://images.pexels.com/photos/20993079/pexels-photo-20993079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'J.O.X', genre: 'Party/Dans', description: 'Garanti för full dansgolv hela kvällen', image: 'https://images.pexels.com/photos/11053643/pexels-photo-11053643.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'LBSB', genre: 'Liveband', description: 'Underhållning som roar både stor som liten', image: 'https://images.pexels.com/photos/28264496/pexels-photo-28264496.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
] as const;

export interface SponsorCompany {
  name: string;
  description: string;
  logo: string;
  url: string;
}

export const SPONSORS = {
  mainPartner: {
    name: 'JSC Koncernen',
    description: 'Vi löser dina logistikproblem på ett enkelt sätt.',
    url: 'https://www.jscforvaltning.se/',
    logo: 'https://asedatruckmeet.se/web/image/3821-d9abdff8/JSC-Koncernen-1-1400x560.png',
  },
  platinumPartner: {
    name: 'Uppvidinge Kommun',
    description: 'Tätt samarbete för ett tryggt och ordnat evenemang.',
    url: 'https://www.uppvidinge.se',
    logo: 'https://www.uppvidinge.se/images/18.3b1c0e6018a0a0f4f6d8/Logo_Uppvidinge_kommun.png',
  },
  goldPartners: [
    { name: 'Blomstermåla Åkeri AB', description: 'Familjeföretag i Mönsterås med transporter i Sverige, Norden och Västeuropa. Samarbetar med Mönsterås LBC.', logo: '', url: '' },
    { name: 'Alvinssons Mönsterås', description: 'Lokalt företag med starkt engagemang i Småland.', logo: '', url: '' },
    { name: 'JSC Transport AB', description: 'Trygga, effektiva och hållbara transporter och lagerlösningar i Jönköping och Växjö.', logo: '', url: 'https://www.jscforvaltning.se/' },
    { name: 'Nordlo', description: 'IT-satsning som framtidssäkrar JSC Förvaltning och andra företag i regionen.', logo: '', url: 'https://nordlo.com/' },
  ] as SponsorCompany[],
  silverPartners: [
    { name: 'Asfaltentreprenör Småland', description: 'Asfaltsbeläggning, markstensläggning och markentreprenad i Småland och Östergötland.', logo: '', url: '' },
    { name: 'Bilservice i Åseda', description: 'Lokal bilservice som stöttar evenemanget.', logo: '', url: '' },
    { name: 'Mönsterås LBC', description: 'Lager och logistik i hjärtat av Småland.', logo: '', url: '' },
    { name: 'JSC Kran & Specialtransport', description: 'Kranlyft och specialtransporter för alla typer av uppdrag.', logo: '', url: 'https://www.jscforvaltning.se/' },
    { name: 'JSC Logistik', description: 'Kompletta logistiklösningar för företag i hela Norden.', logo: '', url: 'https://www.jscforvaltning.se/' },
    { name: 'ÅGL Transport', description: 'Pålitliga transporter med lång erfarenhet i branschen.', logo: '', url: '' },
  ] as SponsorCompany[],
  bronzePartners: [
    { name: 'Åseda Biltvätt', description: 'Håll ditt ekipage skinande rent.', logo: '', url: '' },
    { name: 'Småland Däck', description: 'Däck och service för lastbilar och personbilar.', logo: '', url: '' },
    { name: 'Växjö Hyrcenter', description: 'Hyrmaskiner och verktyg för alla projekt.', logo: '', url: '' },
    { name: 'Kronobergs Gästgivaregård', description: 'Mat och logi för resenärer i Småland.', logo: '', url: '' },
    { name: 'Uppvidinge Bygg', description: 'Byggentreprenad och renovering i lokalområdet.', logo: '', url: '' },
    { name: 'Åseda Livs', description: 'Din lokala livsmedelsbutik i Åseda.', logo: '', url: '' },
    { name: 'Smålands Tryckeri', description: 'Tryckeri och reklammaterial för företag.', logo: '', url: '' },
    { name: 'Truck Parts Sweden', description: 'Reservdelar och tillbehör för lastbilar.', logo: '', url: '' },
  ] as SponsorCompany[],
} as const;

export const RULES = [
  { title: 'Öppettider', content: 'Fredag: kl. 14:00–20:00 | Lördag: kl. 08:00–09:00 (inpassering) | Stängs 01:00 varje natt.' },
  { title: 'Inpassering', content: 'Alla fordon måste vara inpasserade inom angivna tider. För sent ankomna ekipage hänvisas till extern parkering.' },
  { title: 'Alkohol & droger', content: 'Föräldrafritt område. Ingen medtagad alkohol. Försäljning sker i anordnarens barer. Nolltolerans mot droger.' },
  { title: 'Husdjur', content: 'Husdjur är inte tillåtna på evenemangsområdet av säkerhetsskäl.' },
  { title: 'Boende', content: 'Camping finns i anslutning till området. Boka campingtillägg via biljettshoppen. Begränsat antal platser.' },
  { title: 'Truck-show & tävling', content: 'Anmälan till truck-show görs i butiken. Röstning om årets finaste lastbil sker på plats under lördagen.' },
] as const;

export const MOCK_TICKETS = [
  {
    id: 1,
    name: 'Helhelg-biljett',
    description: 'Tillgång till hela evenemanget fredag–söndag. Inkluderar camping.',
    price: '650',
    category: 'Standard',
    available: true,
    badge: 'Mest sålda',
  },
  {
    id: 2,
    name: 'Fredag–Lördag',
    description: 'Tillgång fredag och lördag. Perfekt för helgen utan camping.',
    price: '450',
    category: 'Standard',
    available: true,
    badge: null,
  },
  {
    id: 3,
    name: 'Söndagsbiljett',
    description: 'Tillgång söndag. Se truck-showen och röstning på årets finaste lastbil.',
    price: '150',
    category: 'Dagsbiljett',
    available: true,
    badge: null,
  },
  {
    id: 4,
    name: 'VIP-paket',
    description: 'Helhelg med premiumcamping, VIP-område närmast scen och exklusivt merch-paket.',
    price: '1200',
    category: 'VIP',
    available: true,
    badge: 'Premium',
  },
  {
    id: 5,
    name: 'Campingtillägg',
    description: 'Tillägg för campingplats. Kräver giltig helbiljett. Begränsat antal platser.',
    price: '200',
    category: 'Tillägg',
    available: true,
    badge: null,
  },
  {
    id: 6,
    name: 'Truck-show anmälan',
    description: 'Anmäl ditt ekipage till truck-show och tävlan om årets finaste lastbil.',
    price: '100',
    category: 'Tillägg',
    available: false,
    badge: 'Slutsåld',
  },
] as const;
