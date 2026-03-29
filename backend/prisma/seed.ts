import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env
  .DATABASE_URL!.replace(/[?&]sslmode=[^&]*/, (match) =>
    match.startsWith("?") ? "?" : "",
  )
  .replace(/\?$/, "");

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const stories = [
  {
    content:
      "Aaja boss le feri overtime maagyo — bina kei bhanai. Ghar pugda raat ko 10 bhaisakeko thiyo. Yesto thakaan lagcha ki kei ni garnu man lagdaina.",
    theme: "career",
    circleId: "PadhneBahini",
    status: "APPROVED",
  },
  {
    content:
      "Diaspora ma baschan, nai home feel hudaina kabhi kabhi. Nepal gayo bhane stranger lagcha, yahaan pani fully belong hudaina. Yo in-between feeling kaise explain garnu?",
    theme: "diaspora",
    circleId: "Pardesh",
    status: "APPROVED",
  },
  {
    content:
      "Sabai le bhancha timi strong chau, timi handle garchu. Tara ko suncha? Kabhi kabhi tired huncha yesto strong image maintain garnu parcha bhanera.",
    theme: "general",
    circleId: "SathiCircle",
    status: "APPROVED",
  },
  {
    content:
      "Aamaa sanga call garein aaja. Ramrai kura bhayena, tara unko awaaj sunera man halka bhayo. Tyo feeling chai describe nai garna sakdina.",
    theme: "domestic",
    circleId: "SathiCircle",
    status: "APPROVED",
  },
  {
    content:
      "Relationship ma kura garnu man lagcha tara words nai audaina. Andar kei cha jo express garna garo lagcha. Afai ni bujhdina ke chaiyo bhanera.",
    theme: "domestic",
    circleId: "SathiCircle",
    status: "APPROVED",
  },
  {
    content:
      "Aaja pehilo palo afnai laagi kei garein — coffee piyein, kitab padein, phone bandha garein. Sano kura thiyo tara man ma auchit lagyo. Afnai laagi baach'nu ni parcha raicha.",
    theme: "general",
    circleId: "SathiCircle",
    status: "APPROVED",
  },
  // Mock stories from frontend
  {
    content:
      "Sasurali maa sab kuch thik dekhaucha outta face but ghar bhitra chain chaina. Koi sunidaina lagcha.",
    theme: "domestic",
    circleId: "SathiCircle",
    status: "APPROVED",
  },
  {
    content:
      "Office maa presentation gareko din — boss le appreciate gare. Tara ghar aayepachi feri eklai feel garyo.",
    theme: "career",
    circleId: "PadhneBahini",
    status: "APPROVED",
  },
  {
    content:
      "Aama sangha argue garyo aaja. Dukha lagyo. Tara bhannu pani garo cha.",
    theme: "domestic",
    circleId: "NayaAama",
    status: "APPROVED",
  },
  {
    content:
      "Visa process stress le frustrated lagyo. Sab kuch uncertain feel hunchha.",
    theme: "diaspora",
    circleId: "Pardesh",
    status: "APPROVED",
  },
  {
    content:
      "Naani ko school pressure le afai stressed hunchu. Ko herna aucha mero stress?",
    theme: "postpartum",
    circleId: "NayaAama",
    status: "APPROVED",
  },
  {
    content:
      "Ghar bata tadha bhayera sometimes Nepali food ko smell miss garchhu. Bisaune kura ho tara man lagcha.",
    theme: "diaspora",
    circleId: "Pardesh",
    status: "APPROVED",
  },
];

const circlesData = [
  { slug: 'naya-aama',     circleId: 'NayaAama',     name: 'New Mothers',    nepaliName: 'नया आमा',     themeAffinity: 'postpartum' },
  { slug: 'pardesh',       circleId: 'Pardesh',       name: 'Diaspora',       nepaliName: 'परदेश',       themeAffinity: 'diaspora'   },
  { slug: 'sathi',         circleId: 'SathiCircle',   name: 'Sathi Circle',   nepaliName: 'साथी',        themeAffinity: 'harassment' },
  { slug: 'padhne-bahini', circleId: 'PadhneBahini',  name: 'Career Sisters', nepaliName: 'पढ्ने बहिनी', themeAffinity: 'career'     },
]

async function main() {
  console.log("Seeding stories...");
  const existing = await prisma.story.count();
  if (existing > 0) {
    console.log(`⚠️  ${existing} stories already exist — skipping story seed.`);
  } else {
    for (const story of stories) {
      await prisma.story.create({ data: story });
    }
    console.log(`✅ Seeded ${stories.length} stories.`);
  }

  console.log("Seeding circles...");
  for (const c of circlesData) {
    await prisma.circle.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, memberCount: 0 },
    });
  }
  console.log(`✅ Seeded ${circlesData.length} circles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
