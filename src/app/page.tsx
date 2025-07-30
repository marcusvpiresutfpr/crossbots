import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function Home() {
  // Fetch data from the database
  const users = await prisma.user.findMany({
    select: { id: true, name: true, imageUrl: true, role: true, bio: true },
    // Exclude visitors from the list
    where: {
      role: {
        not: "VISITOR",
      },
    },
  });
  const robots = await prisma.robot.findMany({
    select: { id: true, name: true, description: true, imageUrl: true },
  });
  const competitions = await prisma.competition.findMany({
    orderBy: { date: "desc" },
    take: 3,
    select: {
      id: true,
      name: true,
      date: true,
      imageUrl: true,
      description: true,
      location: true,
    },
  });

  return (
    <main>
      {/* Hero Section */}

      <section
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/736x/21/4c/17/214c176c265262217faee3d3eb1f53c9.jpg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Welcome to CROSSBOTS</h1>
            <p className="mb-5">
              Crossbots, a competitive robotics team from UTFPR.
            </p>
          </div>
        </div>
      </section>


      {/* Our Robots */}
      <section className="py-10 bg-base-200">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Our Robots</h2>
        </div>
        <div className="divider"></div>
        <div className="grid gap-6 px-10 max-w-7xl mx-auto"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
          }}>
          {robots.map((robot) => (
            <div key={robot.id} className="card bg-base-100 shadow-xl">
              <figure className="h-64 overflow-hidden">
                <Image
                  width={400}
                  height={500}
                  src={robot.imageUrl || "https://www.picellileiloes.com.br/arquivos/leiloes/lotes/imagens/063782a6239b98.jpg"}
                  alt={robot.name}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{robot.name}</h3>
                <p className="line-clamp-5">{robot.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Competitions */}
      <section className="py-10 bg-base-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Recent Competitions</h2>
          <p className="text-lg">
            Showcasing our latest achievements and experiences.
          </p>
        </div>
        <div className="grid gap-6 px-10 max-w-7xl mx-auto"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
          }}>
          {competitions.map((competition) => (
            <div key={competition.id} className="card bg-base-200 shadow-xl">
              <figure className="h-64 overflow-hidden">
                <Image
                  width={400}
                  height={300}
                  src={competition.imageUrl || "https://www.picellileiloes.com.br/arquivos/leiloes/lotes/imagens/063782a6239b98.jpg"}
                  alt={competition.name}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{competition.name}</h3>
                <p>{competition.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(competition.date).toLocaleDateString()} - {competition.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team History */}
      <section className="py-10 bg-base-200">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Our Journey</h2>
          <p className="text-lg">
            From humble beginnings to national recognition.
          </p>
        </div>
        <div className="px-10 max-w-4xl mx-auto">
          <p className="text-justify">
            Founded in 2015 by a group of passionate students and mentors, [Team
            Name] has grown into a formidable presence in the competitive robotics
            scene. Our dedication to innovation, teamwork, and continuous learning
            has propelled us to numerous victories and accolades. Each year, we
            strive to push the boundaries of what&apos;s possible, inspiring the next
            generation of engineers and technologists.
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="py-10 bg-base-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Get in Touch</h2>
          <p className="text-lg">
            Interested in collaborating or learning more? We&apos;d love to hear from
            you.
          </p>
        </div>
        <div className="max-w-xl mx-auto px-10">
          <form className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-10 bg-base-100 min-h-screen max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Meet Our Team</h2>
        </div>
        <div className="divider"></div>
        <div
          className="grid gap-6 px-10"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
          }}
        >
          {users.map((user) => (
            <div key={user.id} className="card bg-base-200 shadow-xl">
              <figure>
                <Image
                  src={user.imageUrl || "https://pm1.aminoapps.com/6718/82a548b321b7cd8700e60088e2265896c0ac805e_hq.jpg"}
                  width={128}
                  height={128}
                  alt={user.name}
                  className="rounded-full w-20 h-20 mt-4"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">{user.name}</h3>
                {/* Max 3 lines */}
                <p className="text-sm line-clamp-3">{user.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
    </main>
  );
}
