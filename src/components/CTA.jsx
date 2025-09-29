export default function CTA() {
    return (
        <section className="py-20 hero-gradient text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Customer Experience?</h2>
                <p className="text-xl mb-10 max-w-3xl mx-auto">Partner with Aberdeen and leverage the power of MozarkAI to drive growth, reduce churn, and increase revenue.</p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold transition-colors border-2 border-white duration-300 hover:bg-green-500 hover:text-white">Book BFSI Demo</button>
                      <button className="bg-red-400 text-black px-8 py-3 rounded-lg font-semibold transition-colors border-2 border-white duration-300 hover:bg-green-500 hover:text-white">Book OTT Demo</button>
               </div>
            </div>
            <div className="w-full max-w-xs">
              <input type="range" min={0} max="100" value="25" className="range" step="25" />
              <div className="flex justify-between px-2.5 mt-2 text-xs">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
              <div className="flex justify-between px-2.5 mt-2 text-xs">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

        </section>
    );
}
