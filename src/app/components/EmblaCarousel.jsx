import React, { useCallback } from 'react'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import {useRouter} from "next/navigation";
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebaseConfig";

const EmblaCarousel = (props) => {
  const photoSrc = ["/portfolio_one.png", "/portfolio_two.png", "/portfolio_three.png"]; 
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const onNavButtonClick = useCallback((emblaApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi, onNavButtonClick)

  const handleOptionClick = (index) => {
      if (!user) {
          router.push('/sign-in');
      }
      else {
            if (index % photoSrc.length === 0){
                router.push('/first-template-form');
            }
            if (index % photoSrc.length === 1){
                router.push('/second-template-form');
            }
      }
  }  
    
  return (
    <section className="bg-white pt-20">
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                {slides.map((index) => (
                    <div className="embla__slide" key={index} >
                      <div
                        className="embla__slide__number"
                        onClick={() => handleOptionClick(index)}
                        style={{
                          backgroundImage: `url(${photoSrc[index % photoSrc.length]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          width: '100%',
                          height: '100%'
                        }}>
                      </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__buttons">
                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </div>
        <img className="flex flex-col lg:flex-row bg-white pb-10 justify-center items-center w-full" src="/Bubbles.png" alt="" />
    </section>
  )
}

export default EmblaCarousel
