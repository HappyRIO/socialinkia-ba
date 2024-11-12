import Footer from "../../navigation/Footer";
import Header from "../../navigation/Header";

export default function Aboutus() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="nav w-full">
        <Header />
      </div>
      <div className="maincontent px-2 flex py-10 gap-10 flex-col justify-center items-center max-w-[1100px]">
        <div className="pgtitle py-4 text-4xl font-bold md:text-8xl text-center w-full">
          <h1>Who are we?</h1>
        </div>
        <div className="imagesection">
          <img src="/images/about.png" alt="" />
        </div>
        <div className="provezone w-full flex gap-2 justify-between items-center">
          <div className="Customer-prove flex flex-col justify-center items-center">
            <p className="text-3xl text-center sm:text-8xl font-bold text-accent">
              2k+
            </p>
            <p>Customer</p>
          </div>
          <div className="Customers-satisfied flex flex-col justify-center items-center">
            <p className="text-3xl text-center sm:text-8xl font-bold text-accent">
              95%
            </p>
            <p>Customers satisfied</p>
          </div>
          <div className="Growth-and-expansion flex flex-col justify-center items-center">
            <p className="text-3xl text-center sm:text-8xl font-bold text-accent">
              73%
            </p>
            <p>Growth and expansion</p>
          </div>
        </div>
        <div className="reachtextzone gap-5 flex flex-col-reverse md:flex-row">
          <div className="textcontent w-full md:w-1/2">
            <p>
              At <span className="font-bold text-accent">Socialinkia</span>, we
              are a team of imnovators passionate about artificial intelligence
              and technology applied to digital marketing. Our mission is to
              transform the way companies create and manage their publications,
              helping them save time and resources while improving the quality
              and impact of their communication.
            </p>
            <br />
            <p>
              Through <span className="font-bold text-accent">Socialinkia</span>
              , we offer an advanced tool that generates automatic and
              personalized publications through AI, designed to connect with the
              audience and strengthen the online presence of brands. Whether for
              social networks, blogs or any other digital channel, our platform
              creates relevant content, attractive and aligned with the identity
              of each company.
            </p>
            <br />
            <p>
              Our goal is to simplify and optimize the content creation process,
              providing brands with an efficient, creative and high-performance
              solution to stand out in an increasingly competitive digital
              world.
            </p>
          </div>
          <div className="imagezone flex justify-center items-center w-full md:w-1/2">
            <img src="/images/image.png" alt="" />
          </div>
        </div>
      </div>
      <div className="slide-holder w-full bg-black py-5 my-24">
        <div className="w-full text-3xl font-bold sm:text-8xl text-accent flex flex-row gap-9">
          <p>Socialinkia</p>
          <p>automatic</p>
          <p>community</p>
          <p>Socialinkia</p>
        </div>
      </div>
      <div className="footer w-full">
        <Footer />
      </div>
    </div>
  );
}
