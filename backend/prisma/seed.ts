import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

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
  },
  {
    content:
      "Diaspora ma baschan, nai home feel hudaina kabhi kabhi. Nepal gayo bhane stranger lagcha, yahaan pani fully belong hudaina. Yo in-between feeling kaise explain garnu?",
  },

  {
    content:
      "Sabai le bhancha timi strong chau, timi handle garchu. Tara ko suncha? Kabhi kabhi tired huncha yesto strong image maintain garnu parcha bhanera.",
  },
  {
    content:
      "Aamaa sanga call garein aaja. Ramrai kura bhayena, tara unko awaaj sunera man halka bhayo. Tyo feeling chai describe nai garna sakdina.",
  },
  {
    content:
      "Relationship ma kura garnu man lagcha tara words nai audaina. Andar kei cha jo express garna garo lagcha. Afai ni bujhdina ke chaiyo bhanera.",
  },
  {
    content:
      "Aaja pehilo palo afnai laagi kei garein — coffee piyein, kitab padein, phone bandha garein. Sano kura thiyo tara man ma auchit lagyo. Afnai laagi baach'nu ni parcha raicha.",
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
  for (const story of stories) {
    await prisma.story.create({ data: story });
  }
  console.log(`✅ Seeded ${stories.length} stories.`);

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
