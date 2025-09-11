// components/LogoCloud.tsx
import Image from 'next/image'

const logos = [
  {
    src: "/images/ICICI_Bank_Logo.svg",
    alt: "ICICI Bank Logo",
    className: "h-10 w-auto" // ICICI is wider, so control height
  },
  {
    src: "/images/PhonePe_Logo.svg",
    alt: "PhonePe Logo",
    className: "h-12 w-auto" // PhonePe is square-ish
  },
  {
    src: "/images/UOB_Logo.svg",
    alt: "UOB Bank Logo",
    className: "h-10 w-auto" // UOB is wider
  },
  {
    src: "/images/sonyliv.jpg",
    alt: "SonyLiv Logo",
    className: "h-10 w-auto" // Control height for consistency
  },
  {
    src: "/images/DisneyHotstar_2024.png",
    alt: "Disney+ Hotstar Logo",
    className: "h-10 w-auto" // Control height for consistency
  }
]

export default function LogoCloud() {
  return (
    <section id="results"   className="py-16 bg-white text-black dark:bg-black dark:text-white ">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-5xl font-bold  mb-8">Trusted by Customers</p>
        <div className="flex flex-wrap justify-center bg-white items-center gap-8 md:gap-16">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={128}
                height={48}
                className={logo.className}
                style={{
                  objectFit: 'contain',
                  maxWidth: '128px' // Ensure they don't get too wide
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
