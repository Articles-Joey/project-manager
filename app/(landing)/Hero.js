export default function Hero() {
    return (
        <div className='container'>

            <div className='hero text-center'>
                
                <img
                    src="img/npm-articles.svg"
                    height={100}
                    style={{}}
                    className='mb-3'
                ></img>

                <div className="hero-animation">
                    <div className="full-text">
                        <span className="slide-left">Articles Media</span>
                        <span className="slide-right">Project Manager</span>
                    </div>
                    <div className="abbr-text">
                        <span className="pop-in am">AM</span>
                        <span className="pop-in">PM</span>
                    </div>
                </div>

                <p>Not to be confused or affiliated with Node Package Manager (NPM).</p>

            </div>

        </div>
    )
}